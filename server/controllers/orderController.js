const db = require('../models/dbConnection');
const crypto = require('crypto');
const axios = require('axios');

// ---------- Helpers ----------
async function getOrCreateCart(cartToken) {
  if (!cartToken) cartToken = crypto.randomUUID();

  const [rows] = await db.query('SELECT * FROM carts WHERE token = ?', [cartToken]);
  if (rows.length) return rows[0];

  const [result] = await db.query('INSERT INTO carts (token) VALUES (?)', [cartToken]);
  return { id: result.insertId, token: cartToken };
}

const CART_ITEM_SELECT = `
  SELECT
    ci.id, ci.quantity, ci.color, ci.price_at_add,
    p.id AS product_id, p.title, p.slug, p.thumbnail,
    p.price, p.final_price
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.cart_id = ?
`;

function generateOrderCode() {
  const part = Date.now().toString().slice(-8);
  return `SZ-${part}`;
}

// ---------- POST /api/v1/orders/checkout ----------
exports.checkout = async (req, res) => {
  try {
    const cartToken = req.headers['x-cart-token'];
    const { fullName, phone, address, city = 'تهران', postalCode = null, addressNote = null, discountCode = null } = req.body;

    if (!fullName?.trim() || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({ message: 'نام، شماره تماس و آدرس الزامی است' });
    }

    const cart = await getOrCreateCart(cartToken);
    const [items] = await db.query(CART_ITEM_SELECT, [cart.id]);

    if (!items.length) {
      return res.status(400).json({ message: 'سبد خرید خالی است' });
    }

    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price_at_add, 0);

    // اعتبارسنجی و اعمال تخفیف
    let discountAmount = 0;
    let finalDiscountCode = null;

    if (discountCode) {
      const [discountRows] = await db.query(
        `SELECT * FROM discount_codes 
         WHERE code = ? AND is_active = 1`,
        [discountCode.trim().toUpperCase()]
      );

      if (discountRows.length) {
        const d = discountRows[0];
        const expired = d.expires_at && new Date(d.expires_at) < new Date();
        const overUsed = d.max_uses !== null && d.used_count >= d.max_uses;

        if (!expired && !overUsed && subtotal >= (d.min_order_amount || 0)) {
          if (d.type === 'percent') {
            discountAmount = Math.round((subtotal * d.value) / 100);
          } else {
            discountAmount = Math.min(d.value, subtotal);
          }
          finalDiscountCode = d.code;

          await db.query('UPDATE discount_codes SET used_count = used_count + 1 WHERE id = ?', [d.id]);
        }
      }
    }

    const payableAmount = Math.max(0, subtotal - discountAmount);

    const orderCode = generateOrderCode();

    const [orderResult] = await db.query(
      `INSERT INTO orders (
        order_code, cart_token, full_name, phone, address, city, postal_code, address_note,
        subtotal, discount_code, discount_amount, payable_amount, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')`,
      [orderCode, cart.token, fullName.trim(), phone.trim(), address.trim(), city, postalCode, addressNote, subtotal, finalDiscountCode, discountAmount, payableAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO order_items 
         (order_id, product_id, title, color, quantity, unit_price, thumbnail)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.title, item.color, item.quantity, item.price_at_add, item.thumbnail]
      );
    }

    // خالی کردن سبد
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

    return res.status(201).json({
      success: true,
      orderCode,
      payableAmount,
      status: 'pending_payment',
      message: 'سفارش با موفقیت ثبت شد. برای تکمیل خرید، به پرداخت بروید.',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ message: 'خطا در ثبت سفارش' });
  }
};

// ---------- POST /api/v1/orders/:code/pay ----------
exports.payOrder = async (req, res) => {
  try {
    const { code } = req.params;
    const cartToken = req.headers['x-cart-token'];

    const [orders] = await db.query('SELECT * FROM orders WHERE order_code = ?', [code]);

    if (!orders.length) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    const order = orders[0];

    if (order.cart_token !== cartToken) {
      return res.status(403).json({ message: 'توکن سبد خرید نامعتبر است' });
    }

    await db.query('UPDATE orders SET status = "paid" WHERE id = ?', [order.id]);

    return res.json({
      success: true,
      message: 'پرداخت با موفقیت انجام شد',
      status: 'paid',
    });
  } catch (error) {
    console.error('Pay error:', error);
    return res.status(500).json({ message: 'خطا در ثبت پرداخت' });
  }
};

// ---------- GET /api/v1/orders/:code ----------
exports.getOrderByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const [orders] = await db.query('SELECT * FROM orders WHERE order_code = ?', [code]);

    if (!orders.length) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    const order = orders[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    return res.json({
      order: {
        id: order.id,
        orderCode: order.order_code,
        fullName: order.full_name,
        phone: order.phone,
        address: order.address,
        city: order.city,
        postalCode: order.postal_code,
        addressNote: order.address_note,
        subtotal: order.subtotal,
        discountCode: order.discount_code,
        discountAmount: order.discount_amount,
        payableAmount: order.payable_amount,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      },
      items,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ message: 'خطا در دریافت سفارش' });
  }
};

// ---------- GET /api/v1/orders/:code ----------
exports.getOrderByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const [orders] = await db.query('SELECT * FROM orders WHERE order_code = ?', [code]);

    if (!orders.length) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    const order = orders[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    return res.json({
      order: {
        id: order.id,
        orderCode: order.order_code,
        fullName: order.full_name,
        phone: order.phone,
        address: order.address,
        city: order.city,
        postalCode: order.postal_code,
        addressNote: order.address_note,
        subtotal: order.subtotal,
        discountCode: order.discount_code,
        discountAmount: order.discount_amount,
        payableAmount: order.payable_amount,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      },
      items,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ message: 'خطا در دریافت سفارش' });
  }
};

// ---------- Helpers ----------
async function getOrCreateCart(cartToken) {
  if (!cartToken) cartToken = crypto.randomUUID();

  const [rows] = await db.query('SELECT * FROM carts WHERE token = ?', [cartToken]);
  if (rows.length) return rows[0];

  const [result] = await db.query('INSERT INTO carts (token) VALUES (?)', [cartToken]);
  return { id: result.insertId, token: cartToken };
}

function generateOrderCode() {
  const part = Date.now().toString().slice(-8);
  return `SZ-${part}`;
}

// ---------- POST /api/v1/orders/checkout ----------
exports.checkout = async (req, res) => {
  try {
    const cartToken = req.headers['x-cart-token'];
    const { fullName, phone, address, city = 'تهران', postalCode = null, addressNote = null, discountCode = null } = req.body;

    if (!fullName?.trim() || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({ message: 'نام، شماره تماس و آدرس الزامی است' });
    }

    const cart = await getOrCreateCart(cartToken);
    const [items] = await db.query(CART_ITEM_SELECT, [cart.id]);

    if (!items.length) {
      return res.status(400).json({ message: 'سبد خرید خالی است' });
    }

    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price_at_add, 0);

    let discountAmount = 0;
    let finalDiscountCode = null;

    if (discountCode) {
      const [discountRows] = await db.query(`SELECT * FROM discount_codes WHERE code = ? AND is_active = 1`, [discountCode.trim().toUpperCase()]);

      if (discountRows.length) {
        const d = discountRows[0];
        const expired = d.expires_at && new Date(d.expires_at) < new Date();
        const overUsed = d.max_uses !== null && d.used_count >= d.max_uses;

        if (!expired && !overUsed && subtotal >= (d.min_order_amount || 0)) {
          if (d.type === 'percent') {
            discountAmount = Math.round((subtotal * d.value) / 100);
          } else {
            discountAmount = Math.min(d.value, subtotal);
          }
          finalDiscountCode = d.code;
          await db.query('UPDATE discount_codes SET used_count = used_count + 1 WHERE id = ?', [d.id]);
        }
      }
    }

    const payableAmount = Math.max(0, subtotal - discountAmount);
    const orderCode = generateOrderCode();

    const [orderResult] = await db.query(
      `INSERT INTO orders (
        order_code, cart_token, full_name, phone, address, city, postal_code, address_note,
        subtotal, discount_code, discount_amount, payable_amount, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')`,
      [orderCode, cart.token, fullName.trim(), phone.trim(), address.trim(), city, postalCode, addressNote, subtotal, finalDiscountCode, discountAmount, payableAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, title, color, quantity, unit_price, thumbnail)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.title, item.color, item.quantity, item.price_at_add, item.thumbnail]
      );
    }

    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

    return res.status(201).json({
      success: true,
      orderCode,
      payableAmount,
      status: 'pending_payment',
      message: 'سفارش با موفقیت ثبت شد. برای تکمیل خرید، به پرداخت بروید.',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ message: 'خطا در ثبت سفارش' });
  }
};

// ---------- GET /api/v1/payment/callback  ← بازگشت از زرین‌پال ----------
exports.paymentCallback = async (req, res) => {
  try {
    const { Authority, Status, order_code } = req.query;

    if (Status !== 'OK') {
      // پرداخت ناموفق
      return res.redirect(`${process.env.BASE_URL || 'https://sharifzin.ir'}/checkout?payment=failed&order=${order_code}`);
    }

    const [orders] = await db.query('SELECT * FROM orders WHERE order_code = ?', [order_code]);
    if (!orders.length) {
      return res.redirect(`${process.env.BASE_URL || 'https://sharifzin.ir'}/checkout?payment=error`);
    }

    const order = orders[0];

    // ========== Verify پرداخت ==========
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';

    const verifyUrl = isSandbox ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json' : 'https://api.zarinpal.com/pg/v4/payment/verify.json';

    const verifyData = {
      merchant_id: merchantId,
      amount: Math.round(Number(order.payable_amount)),
      authority: Authority,
    };

    const { data } = await axios.post(verifyUrl, verifyData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (data.data && (data.data.code === 100 || data.data.code === 101)) {
      // پرداخت موفق
      await db.query(
        `UPDATE orders SET 
          status = 'paid', 
          ref_id = ?, 
          paid_at = NOW() 
         WHERE id = ?`,
        [data.data.ref_id, order.id]
      );

      return res.redirect(`${process.env.BASE_URL || 'https://sharifzin.ir'}/checkout/success?order=${order.order_code}&ref=${data.data.ref_id}`);
    } else {
      console.error('Verify failed:', data);
      return res.redirect(`${process.env.BASE_URL || 'https://sharifzin.ir'}/checkout?payment=failed&order=${order_code}`);
    }
  } catch (error) {
    console.error('Callback error:', error);
    return res.redirect(`${process.env.BASE_URL || 'https://sharifzin.ir'}/checkout?payment=error`);
  }
};

// ---------- PATCH /api/v1/orders/:id/status (ادمین) ----------
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pickupDriverName, pickupTrackingCode, returnDriverName, returnTrackingCode, adminNote } = req.body;

    const allowed = ['pending_payment', 'paid', 'pickup_dispatched', 'picked_up', 'at_shop', 'inspecting', 'ready_to_ship', 'return_dispatched', 'delivered', 'cancelled'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: 'وضعیت نامعتبر است' });
    }

    const [result] = await db.query(
      `UPDATE orders SET
        status = ?,
        pickup_driver_name = COALESCE(?, pickup_driver_name),
        pickup_tracking_code = COALESCE(?, pickup_tracking_code),
        return_driver_name = COALESCE(?, return_driver_name),
        return_tracking_code = COALESCE(?, return_tracking_code),
        admin_note = COALESCE(?, admin_note)
       WHERE id = ?`,
      [status, pickupDriverName || null, pickupTrackingCode || null, returnDriverName || null, returnTrackingCode || null, adminNote || null, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);

    return res.json({
      message: 'وضعیت سفارش به‌روزرسانی شد',
      order: orders[0],
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ message: 'خطا در به‌روزرسانی وضعیت' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 200');
    return res.json({ data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت لیست سفارش‌ها' });
  }
};

// Get User Order Base On CartUUID
exports.getUserOrders = async (req, res) => {
  try {
    const { cart_token } = req.params;

    const [orders] = await db.query('SELECT * FROM orders WHERE cart_token = ?', [cart_token]);
    return res.json({ data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت لیست سفارش‌ها' });
  }
};
