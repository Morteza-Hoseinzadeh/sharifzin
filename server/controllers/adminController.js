const db = require('../models/dbConnection');

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

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return res.json({ message: 'وضعیت سفارش به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در به‌روزرسانی وضعیت' });
  }
};

// ==================== USERS ====================
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');

    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت کاربران' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت کاربران' });
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

exports.createProduct = async (req, res) => {
  try {
    const { title, subtitle, brand, category, category_fa, model, price, discount, final_price, thumbnail, images, colors, material, best_for, description, features, specifications } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'عنوان محصول الزامی است' });
    }

    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^ا-یa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // اگر slug خالی شد
    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const [existing] = await db.query('SELECT id FROM products WHERE slug = ?', [slug]);

    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const [result] = await db.query(
      `
      INSERT INTO products (slug, title, subtitle, brand, category, category_fa, model, price, discount, final_price, thumbnail, images, colors, material, best_for, description, features, specifications )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        slug,
        title || null,
        subtitle || null,
        brand || null,
        category || null,
        category_fa || null,
        model || null,
        Number(price) || 0,
        Number(discount) || 0,
        Number(final_price) || 0,
        thumbnail || null,
        JSON.stringify(Array.isArray(images) ? images : []),
        JSON.stringify(Array.isArray(colors) ? colors : []),
        material || null,
        JSON.stringify(Array.isArray(best_for) ? best_for : []),
        description || null,
        JSON.stringify(Array.isArray(features) ? features : []),
        JSON.stringify(specifications && typeof specifications === 'object' ? specifications : {}),
      ]
    );

    return res.status(201).json({ message: 'محصول با موفقیت اضافه شد', id: result.insertId, slug });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    return res.status(500).json({ message: 'خطا در افزودن محصول' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, brand, category, category_fa, model, price, discount, final_price, thumbnail, images, colors, material, best_for, description, features, specifications, stock, sold } = req.body;

    let slug = title
      ? title
          .toLowerCase()
          .replace(/[^ا-یa-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      : null;

    await db.query(
      `UPDATE products SET
        title = ?, subtitle = ?, brand = ?, category = ?, category_fa = ?, model = ?,
        price = ?, discount = ?, final_price = ?, thumbnail = ?, images = ?, colors = ?,
        material = ?, best_for = ?, description = ?, features = ?, specifications = ?,
        stock = ?, sold = ?, slug = ? 
       WHERE id = ?`,
      [title, subtitle, brand, category, category_fa, model, price || 0, discount || 0, final_price || price || 0, thumbnail || null, JSON.stringify(images || []), JSON.stringify(colors || []), material || null, best_for || null, description || null, JSON.stringify(features || []), JSON.stringify(specifications || {}), stock || 0, sold || 0, slug, id]
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

    // اول چک کنیم محصول وجود دارد
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

// ==================== PRODUCT IMAGE UPLOAD ====================
const productUpload = require('../middlewares/upload');

exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'هیچ تصویری انتخاب نشده است',
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const imageUrl = await productUpload.convertToWebp(file.buffer);

      uploadedImages.push(imageUrl);
    }

    return res.status(201).json({
      message: 'تصاویر با موفقیت آپلود شدند',
      images: uploadedImages,
      thumbnail: uploadedImages[0] || null,
    });
  } catch (error) {
    console.error('PRODUCT IMAGE UPLOAD ERROR:', error);

    return res.status(500).json({
      message: 'خطا در آپلود تصاویر',
      error: error.message,
    });
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
    const [result] = await db.query('INSERT INTO categories (name, description, name_fa, description_fa, color, slug) VALUES (?, ?, ?, ?, ?, ?)', [
      name,
      description,
      name_fa,
      description_fa,
      color,
      name
        .toLowerCase()
        .replace(/[^ا-یa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-'),
    ]);
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
