const db = require('../models/dbConnection');
const crypto = require('crypto');
const axios = require('axios');
const { requestPayment } = require('../services/zarinpal');

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
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد',
      });
    }

    const order = orders[0];

    // بررسی cart token
    if (order.cart_token !== cartToken) {
      return res.status(403).json({
        success: false,
        message: 'توکن سبد خرید نامعتبر است',
      });
    }

    // اگر قبلاً پرداخت شده
    if (order.status === 'paid') {
      return res.json({
        success: true,
        message: 'این سفارش قبلاً پرداخت شده است',
        status: 'paid',
        paymentUrl: null,
      });
    }

    // مبلغ سفارش
    const payableAmount = Number(order.payable_amount);

    if (!payableAmount || payableAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'مبلغ سفارش نامعتبر است',
      });
    }

    // -----------------------------------------
    // تومان -> ریال
    // -----------------------------------------
    const amountInRial = payableAmount * 10;

    // -----------------------------------------
    // ساخت درخواست پرداخت زرین پال
    // -----------------------------------------
    const payment = await requestPayment({
      amount: amountInRial,
      description: `پرداخت سفارش ${order.order_code}`,
      orderId: order.id,
      mobile: order.phone,
    });

    // -----------------------------------------
    // ذخیره Authority در سفارش
    // -----------------------------------------
    await db.query(
      `
        UPDATE orders
        SET
          authority = ?,
          updated_at = NOW()
        WHERE id = ?
      `,
      [payment.authority, order.id]
    );

    // -----------------------------------------
    // Response
    // -----------------------------------------
    return res.json({
      success: true,

      message: 'لینک پرداخت با موفقیت ایجاد شد',

      status: 'pending_payment',

      orderCode: order.order_code,

      paymentUrl: payment.paymentUrl,

      authority: payment.authority,
    });
  } catch (error) {
    console.error('Pay error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'خطا در ایجاد لینک پرداخت',
    });
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

// ---------- GET /api/v1/payment/callback ----------
// بازگشت از زرین‌پال

exports.paymentCallback = async (req, res) => {
  try {
    const { Authority, Status, order_id } = req.query;

    // ---------------------------------------------
    // بررسی اطلاعات Callback
    // ---------------------------------------------

    if (!Authority || !order_id) {
      return res.redirect(`${process.env.BASE_URL}/checkout?payment=error`);
    }

    // ---------------------------------------------
    // دریافت سفارش
    // ---------------------------------------------

    const [orders] = await db.query(
      `
        SELECT *
        FROM orders
        WHERE id = ?
        LIMIT 1
      `,
      [order_id]
    );

    if (!orders.length) {
      return res.redirect(`${process.env.BASE_URL}/checkout?payment=error`);
    }

    const order = orders[0];

    // ---------------------------------------------
    // اگر سفارش قبلاً پرداخت شده
    // ---------------------------------------------

    if (order.status === 'paid') {
      return res.redirect(`${process.env.BASE_URL}/checkout/success?order=${encodeURIComponent(order.order_code)}&ref=${encodeURIComponent(order.ref_id || '')}`);
    }

    // ---------------------------------------------
    // بررسی Authority
    // ---------------------------------------------

    if (order.authority && order.authority !== Authority) {
      console.error('Authority mismatch:', {
        orderAuthority: order.authority,
        callbackAuthority: Authority,
        orderId: order.id,
      });

      return res.redirect(`${process.env.BASE_URL}/checkout?payment=error&order=${encodeURIComponent(order.order_code)}`);
    }

    // ---------------------------------------------
    // پرداخت توسط کاربر لغو شده
    // ---------------------------------------------

    if (!Status || String(Status).toUpperCase() !== 'OK') {
      await db.query(
        `
          UPDATE orders
          SET
            status = 'payment_failed',
            updated_at = NOW()
          WHERE id = ?
            AND status <> 'paid'
        `,
        [order.id]
      );

      return res.redirect(`${process.env.BASE_URL}/checkout?payment=failed&order=${encodeURIComponent(order.order_code)}`);
    }

    // ---------------------------------------------
    // مبلغ سفارش
    // ---------------------------------------------

    const payableAmount = Number(order.payable_amount);

    if (!Number.isFinite(payableAmount) || payableAmount <= 0) {
      console.error('Invalid order amount:', order.payable_amount);

      return res.redirect(`${process.env.BASE_URL}/checkout?payment=error&order=${encodeURIComponent(order.order_code)}`);
    }

    // ---------------------------------------------
    // تومان -> ریال
    //
    // مبلغ داخل DB شما تومان است
    // زرین‌پال مبلغ را ریال می‌خواهد
    // ---------------------------------------------

    const amountInRial = Math.round(payableAmount * 10);

    // ---------------------------------------------
    // ZarinPal Verify
    // ---------------------------------------------

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;

    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';

    const verifyUrl = isSandbox ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json' : 'https://api.zarinpal.com/pg/v4/payment/verify.json';

    const verifyData = {
      merchant_id: merchantId,
      amount: amountInRial,
      authority: Authority,
    };

    const { data } = await axios.post(verifyUrl, verifyData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000,
    });

    console.log('ZarinPal Verify:', data);

    // ---------------------------------------------
    // بررسی نتیجه Verify
    // ---------------------------------------------

    const verifyCode = Number(data?.data?.code);

    if (verifyCode !== 100 && verifyCode !== 101) {
      console.error('ZarinPal Verify failed:', data);

      await db.query(
        `
          UPDATE orders
          SET
            status = 'payment_failed',
            updated_at = NOW()
          WHERE id = ?
            AND status <> 'paid'
        `,
        [order.id]
      );

      return res.redirect(`${process.env.BASE_URL}/checkout?payment=failed&order=${encodeURIComponent(order.order_code)}`);
    }

    // ---------------------------------------------
    // پرداخت موفق
    // ---------------------------------------------

    const refId = data.data.ref_id;

    // ---------------------------------------------
    // Update Order
    // ---------------------------------------------

    const [updateResult] = await db.query(
      `
          UPDATE orders

          SET
            status = 'paid',
            authority = ?,
            ref_id = ?,
            paid_at = NOW(),
            updated_at = NOW()

          WHERE id = ?
            AND status <> 'paid'
        `,
      [Authority, refId, order.id]
    );

    // ---------------------------------------------
    // افزایش مصرف کد تخفیف
    //
    // فقط اگر همین Callback سفارش را
    // برای اولین بار paid کرده باشد
    // ---------------------------------------------

    if (updateResult.affectedRows === 1 && order.discount_code) {
      await db.query(
        `
          UPDATE discount_codes
          SET
            used_count =
              COALESCE(used_count, 0) + 1
          WHERE code = ?
        `,
        [order.discount_code]
      );
    }

    // ---------------------------------------------
    // Redirect به صفحه موفقیت
    // ---------------------------------------------

    return res.redirect(`${process.env.BASE_URL}/checkout/success?payment=success&order=${encodeURIComponent(order.order_code)}&ref=${encodeURIComponent(refId)}`);
  } catch (error) {
    console.error('Payment Callback Error:', error.response?.data || error.message || error);

    return res.redirect(`${process.env.BASE_URL}/checkout?payment=error`);
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
