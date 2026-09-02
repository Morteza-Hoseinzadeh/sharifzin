const db = require('../models/dbConnection');

// ==================== GET /api/v1/user/wishlist ====================
exports.getWishlist = async (req, res) => {
  try {
    const id = req.query.id;

    const [rows] = await db.query(
      `SELECT w.id, w.product_id, p.title, p.thumbnail, p.price, w.created_at
       FROM user_wishlist w
       JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ?`,
      [id]
    );

    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت علاقه‌مندی‌ها' });
  }
};

// ==================== POST /api/v1/user/wishlist ====================
exports.addToWishlist = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'شناسه محصول الزامی است' });
    }

    // چک کردن تکراری
    const [check] = await db.query('SELECT id FROM user_wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);

    if (check.length) {
      return res.status(409).json({ message: 'این محصول قبلاً به علاقه‌مندی‌ها اضافه شده است' });
    }

    await db.query('INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)', [userId, productId]);

    return res.status(201).json({ message: 'محصول به علاقه‌مندی‌ها اضافه شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در افزودن به علاقه‌مندی‌ها', error });
  }
};

// ==================== DELETE /api/v1/user/wishlist ====================
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    const result = await db.query('DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);

    console.log(result);

    if (!result?.length) {
      return res.status(404).json({ message: 'محصول در علاقه‌مندی‌ها یافت نشد' });
    }

    return res.json({ message: 'محصول از علاقه‌مندی‌ها حذف شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در حذف از علاقه‌مندی‌ها' });
  }
};
