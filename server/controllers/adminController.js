const db = require('../models/dbConnection');
const { randomUUID } = require('crypto');
const productUpload = require('../middlewares/upload');
const { sendOrderConfirmationSMS } = require('../services/sms');

// Allowed order statuses - adjust to match your actual workflow
const ALLOWED_ORDER_STATUSES = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

function getIranDateTime() {
  const now = new Date();

  const date = new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const time = new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  return {
    date,
    time,
  };
}

const statusMap = {
  pending_payment: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  pickup_dispatched: 'در حال برداشتن زین',
  picked_up: 'برداشته شده',
  at_shop: 'در مغازه',
  inspecting: 'در حال بررسی',
  ready_to_ship: 'آماده ارسال',
  return_dispatched: 'در حال ارسال بازگشت',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

function normalizePhone(phone) {
  if (!phone) return '';

  let value = String(phone).trim();

  // Persian digits -> English
  value = value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));

  // Arabic digits -> English
  value = value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

  // Remove spaces, -, (, )
  value = value.replace(/[\s\-()]/g, '');

  // +98xxxxxxxxxx -> 09xxxxxxxxxx
  if (value.startsWith('+98')) {
    value = '0' + value.slice(3);
  }

  // 98xxxxxxxxxx -> 09xxxxxxxxxx
  if (value.startsWith('98') && value.length === 12) {
    value = '0' + value.slice(2);
  }

  return value;
}

// ==================== DASHBOARD ====================
exports.getAdminDashboard = async (req, res) => {
  try {
    const [totalSales] = await db.query('SELECT SUM(payable_amount) as total FROM orders WHERE status = "paid"');
    const [todaySales] = await db.query('SELECT SUM(payable_amount) as total FROM orders WHERE status = "paid" AND DATE(created_at) = CURDATE()');
    const [newOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "pending_payment"');
    const [activeUsers] = await db.query('SELECT COUNT(DISTINCT user_id) as count FROM orders');
    const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM products');

    return res.json({
      totalSales: totalSales[0].total || 0,
      todaySales: todaySales[0].total || 0,
      newOrders: newOrders[0].count || 0,
      activeUsers: activeUsers[0].count || 0,
      totalProducts: totalProducts[0].count || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در داشبورد' });
  }
};

// ==================== ORDERS ====================
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, u.full_name as user_name 
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );
    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت سفارش‌ها' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ---------------------------------------------------------
    // Validate status
    // ---------------------------------------------------------

    if (!statusMap[status]) {
      return res.status(400).json({
        message: 'وضعیت سفارش نامعتبر است',
      });
    }

    // ---------------------------------------------------------
    // Get order FIRST
    // ---------------------------------------------------------

    const [orders] = await db.query(
      `
      SELECT
        id,
        order_code,
        full_name,
        phone,
        payable_amount,
        status
      FROM orders
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'سفارش یافت نشد',
      });
    }

    const order = orders[0];

    // ---------------------------------------------------------
    // Update order status
    // ---------------------------------------------------------

    const [result] = await db.query(
      `
      UPDATE orders
      SET
        status = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'سفارش یافت نشد',
      });
    }

    // ---------------------------------------------------------
    // Send SMS
    // ---------------------------------------------------------

    try {
      const { date, time } = getIranDateTime();

      await sendOrderConfirmationSMS({
        phone: normalizePhone(order.phone),
        fullName: order.full_name,
        orderCode: order.order_code,
        amount: order.payable_amount,
        date,
        time,
        status: statusMap[status],
      });

      console.log(`[SMS] Order status SMS sent successfully: ${order.order_code}`);
    } catch (smsError) {
      // SMS failure must NOT break order status update
      console.error(`[SMS] Failed to send order status SMS for ${order.order_code}:`, smsError.message);
    }

    // ---------------------------------------------------------
    // Response
    // ---------------------------------------------------------

    return res.json({
      message: 'وضعیت سفارش با موفقیت به‌روزرسانی شد',
      order: {
        id: order.id,
        order_code: order.order_code,
        status,
      },
    });
  } catch (error) {
    console.error('UPDATE ORDER STATUS ERROR:', error);

    return res.status(500).json({
      message: 'خطا در به‌روزرسانی وضعیت',
    });
  }
};

// ==================== USERS ====================
exports.getAllUsers = async (req, res) => {
  try {
    // Never SELECT * here - excludes password hashes / other sensitive columns
    const [rows] = await db.query('SELECT id, full_name, email, phone, created_at FROM users ORDER BY created_at DESC');

    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت کاربران' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    return res.json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در حذف کاربر' });
  }
};

// ==================== PRODUCTS ====================
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت محصولات' });
  }
};

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^ا-یa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

exports.createProduct = async (req, res) => {
  try {
    const { title, subtitle, brand, category, category_fa, model, price, discount, final_price, thumbnail, images, colors, material, best_for, description, features, specifications } = req.body;

    // if (!title || !title.trim()) {
    //   return res.status(400).json({ message: 'عنوان محصول الزامی است' });
    // }

    let slug = slugify(title);

    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const [existing] = await db.query('SELECT id FROM products WHERE slug = ?', [slug]);

    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // ✅ was Math.random(0, 999999) - invalid, produced a float, not an id
    const productId = randomUUID();

    const [result] = await db.query(
      `
      INSERT INTO products (id, slug, title, subtitle, brand, category, category_fa, model, price, discount, final_price, thumbnail, images, colors, material, best_for, description, features, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [productId, slug, title || null, subtitle || null, brand || null, category || null, category_fa || null, model || null, Number(price) || 0, Number(discount) || 0, Number(final_price) || 0, thumbnail || null, JSON.stringify(Array.isArray(images) ? images : []), JSON.stringify(Array.isArray(colors) ? colors : []), material || null, JSON.stringify(Array.isArray(best_for) ? best_for : []), description || null, JSON.stringify(Array.isArray(features) ? features : []), JSON.stringify(specifications && typeof specifications === 'object' ? specifications : {})]
    );

    // ✅ new: پاسخ قبلاً فقط { message, id, slug } بود - یعنی title و بقیه‌ی
    // فیلدهای محصول تو پاسخ نبودن. اگه فرانت بعد از ساخت محصول بخواد همون
    // محصول رو مستقیم به لیست اضافه کنه یا نمایش بده (مثلاً newProduct.title)،
    // undefined می‌شد و باعث خطای "Cannot read properties of undefined
    // (reading 'title')" می‌شد. حالا کل رکورد ساخته‌شده برگردونده میشه.
    return res.status(201).json({
      message: 'محصول با موفقیت اضافه شد',
      product: {
        id: productId,
        slug,
        title,
        subtitle: subtitle || null,
        brand: brand || null,
        category: category || null,
        category_fa: category_fa || null,
        model: model || null,
        price: Number(price) || 0,
        discount: Number(discount) || 0,
        final_price: Number(final_price) || 0,
        thumbnail: thumbnail || null,
        images: Array.isArray(images) ? images : [],
        colors: Array.isArray(colors) ? colors : [],
        material: material || null,
        best_for: Array.isArray(best_for) ? best_for : [],
        description: description || null,
        features: Array.isArray(features) ? features : [],
        specifications: specifications && typeof specifications === 'object' ? specifications : {},
      },
    });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    return res.status(500).json({ message: 'خطا در افزودن محصول' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, brand, category, category_fa, model, price, discount, final_price, thumbnail, images, colors, material, description, features, specifications } = req.body;

    const [existing] = await db.query('SELECT slug FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    // ✅ Only regenerate slug when a new title is actually provided.
    // Previously: if `title` was omitted, slug was set to null and overwrote the existing one.
    const slug = title ? slugify(title) : existing[0].slug;

    await db.query(
      `UPDATE products SET
        title = ?, subtitle = ?, brand = ?, category = ?, category_fa = ?, model = ?,
        price = ?, discount = ?, final_price = ?, thumbnail = ?, images = ?, colors = ?,
        material = ?, description = ?, features = ?, specifications = ?,
        slug = ?
       WHERE id = ?`,
      [title, subtitle, brand, category, category_fa, model, price || 0, discount || 0, final_price || price || 0, thumbnail || null, JSON.stringify(images || []), JSON.stringify(colors || []), material || null, description || null, JSON.stringify(features || []), JSON.stringify(specifications || {}), slug, id]
    );

    return res.json({ message: 'محصول به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در به‌روزرسانی محصول' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db.query('SELECT id FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ message: 'محصول با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در حذف محصول' });
  }
};

exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'هیچ تصویری انتخاب نشده است' });
    }

    const imageUrl = await productUpload.convertToWebp(req.file);

    return res.status(201).json({
      message: 'تصویر با موفقیت آپلود شد',
      image: imageUrl,
      thumbnail: imageUrl,
    });
  } catch (error) {
    console.error('PRODUCT IMAGE UPLOAD ERROR:', error);
    return res.status(500).json({ message: 'خطا در آپلود تصویر', error: error.message });
  }
};

// ==================== CATEGORIES ====================
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت دسته‌بندی‌ها' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, name_fa, description_fa, color } = req.body;

    // ✅ was missing - name.toLowerCase() below would throw on missing name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'نام دسته‌بندی الزامی است' });
    }

    const [result] = await db.query('INSERT INTO categories (name, description, name_fa, description_fa, color, slug) VALUES (?, ?, ?, ?, ?, ?)', [name, description, name_fa, description_fa, color, slugify(name)]);

    return res.status(201).json({ message: 'دسته‌بندی با موفقیت ایجاد شد', id: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در ایجاد دسته‌بندی' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
    }
    return res.json({ message: 'دسته‌بندی با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در حذف دسته‌بندی' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, name_fa, description_fa, color } = req.body;
    const [result] = await db.query('UPDATE categories SET name = ?, description = ?, name_fa = ?, description_fa = ?, color = ? WHERE id = ?', [name, description, name_fa, description_fa, color, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
    }
    return res.json({ message: 'دسته‌بندی با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در به‌روزرسانی دسته‌بندی' });
  }
};

// ==================== DISCOUNT CODES ====================

exports.getAllDiscountCodes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        code,
        type,
        value,
        min_order_amount,
        max_uses,
        used_count,
        is_active,
        expires_at,
        created_at
      FROM discount_codes
      ORDER BY created_at DESC
    `);

    return res.json({
      data: rows,
    });
  } catch (error) {
    console.error('GET DISCOUNT CODES ERROR:', error);

    return res.status(500).json({
      message: 'خطا در دریافت کدهای تخفیف',
    });
  }
};

exports.getDiscountCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        code,
        type,
        value,
        min_order_amount,
        max_uses,
        used_count,
        is_active,
        expires_at,
        created_at
      FROM discount_codes
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'کد تخفیف یافت نشد',
      });
    }

    return res.json({
      data: rows[0],
    });
  } catch (error) {
    console.error('GET DISCOUNT CODE ERROR:', error);

    return res.status(500).json({
      message: 'خطا در دریافت کد تخفیف',
    });
  }
};

exports.createDiscountCode = async (req, res) => {
  try {
    const { code, type, value, min_order_amount, max_uses, is_active, expires_at } = req.body;

    // =========================
    // Validation
    // =========================

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: 'کد تخفیف الزامی است',
      });
    }

    if (!['percent', 'flat'].includes(type)) {
      return res.status(400).json({
        message: 'نوع تخفیف نامعتبر است',
      });
    }

    if (value === undefined || value === null || Number(value) <= 0) {
      return res.status(400).json({
        message: 'مقدار تخفیف باید بیشتر از صفر باشد',
      });
    }

    if (type === 'percent' && Number(value) > 100) {
      return res.status(400).json({
        message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد',
      });
    }

    if (max_uses !== undefined && max_uses !== null && Number(max_uses) < 0) {
      return res.status(400).json({
        message: 'تعداد استفاده نامعتبر است',
      });
    }

    // =========================
    // Normalize code
    // =========================

    const normalizedCode = code.trim().toUpperCase();

    // =========================
    // Check duplicate
    // =========================

    const [existing] = await db.query(
      `
      SELECT id
      FROM discount_codes
      WHERE code = ?
      `,
      [normalizedCode]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'این کد تخفیف قبلاً ثبت شده است',
      });
    }

    // =========================
    // Insert
    // =========================

    const [result] = await db.query(
      `
      INSERT INTO discount_codes
      (
        code,
        type,
        value,
        min_order_amount,
        max_uses,
        used_count,
        is_active,
        expires_at
      )
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
      `,
      [normalizedCode, type, Number(value), Number(min_order_amount) || 0, max_uses === '' || max_uses === null || max_uses === undefined ? null : Number(max_uses), is_active === undefined ? 1 : is_active ? 1 : 0, expires_at || null]
    );

    return res.status(201).json({
      message: 'کد تخفیف با موفقیت ایجاد شد',
      id: result.insertId,
    });
  } catch (error) {
    console.error('CREATE DISCOUNT CODE ERROR:', error);

    return res.status(500).json({
      message: 'خطا در ایجاد کد تخفیف',
    });
  }
};

exports.updateDiscountCode = async (req, res) => {
  try {
    const { id } = req.params;

    const { code, type, value, min_order_amount, max_uses, is_active, expires_at } = req.body;

    // =========================
    // Validation
    // =========================

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: 'کد تخفیف الزامی است',
      });
    }

    if (!['percent', 'flat'].includes(type)) {
      return res.status(400).json({
        message: 'نوع تخفیف نامعتبر است',
      });
    }

    if (value === undefined || value === null || Number(value) <= 0) {
      return res.status(400).json({
        message: 'مقدار تخفیف باید بیشتر از صفر باشد',
      });
    }

    if (type === 'percent' && Number(value) > 100) {
      return res.status(400).json({
        message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد',
      });
    }

    // =========================
    // Check existing
    // =========================

    const [current] = await db.query(
      `
      SELECT id
      FROM discount_codes
      WHERE id = ?
      `,
      [id]
    );

    if (current.length === 0) {
      return res.status(404).json({
        message: 'کد تخفیف یافت نشد',
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    // =========================
    // Duplicate code check
    // =========================

    const [duplicate] = await db.query(
      `
      SELECT id
      FROM discount_codes
      WHERE code = ?
      AND id != ?
      `,
      [normalizedCode, id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        message: 'این کد تخفیف قبلاً استفاده شده است',
      });
    }

    // =========================
    // Update
    // =========================

    await db.query(
      `
      UPDATE discount_codes
      SET
        code = ?,
        type = ?,
        value = ?,
        min_order_amount = ?,
        max_uses = ?,
        is_active = ?,
        expires_at = ?
      WHERE id = ?
      `,
      [normalizedCode, type, Number(value), Number(min_order_amount) || 0, max_uses === '' || max_uses === null || max_uses === undefined ? null : Number(max_uses), is_active ? 1 : 0, expires_at || null, id]
    );

    return res.json({
      message: 'کد تخفیف با موفقیت به‌روزرسانی شد',
    });
  } catch (error) {
    console.error('UPDATE DISCOUNT CODE ERROR:', error);

    return res.status(500).json({
      message: 'خطا در به‌روزرسانی کد تخفیف',
    });
  }
};

exports.deleteDiscountCode = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM discount_codes
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'کد تخفیف یافت نشد',
      });
    }

    return res.json({
      message: 'کد تخفیف با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('DELETE DISCOUNT CODE ERROR:', error);

    return res.status(500).json({
      message: 'خطا در حذف کد تخفیف',
    });
  }
};
