const db = require('../models/dbConnection');

// ---------- GET /api/v1/user/addresses ----------
exports.getAddresses = async (req, res) => {
  try {
    // اگر سیستم لاگین داری از req.user.id استفاده کن
    // فعلاً با cartToken یا یک user_id فرضی کار می‌کنیم
    const userId = req.user?.id || req.headers['x-user-id'] || 1;

    const [rows] = await db.query(
      `SELECT * FROM user_addresses 
       WHERE user_id = ? 
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    return res.json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در دریافت آدرس‌ها' });
  }
};

// ---------- POST /api/v1/user/addresses ----------
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'] || 1;
    const { title = 'منزل', receiver, phone, province = 'تهران', city = 'تهران', address, postalCode, isDefault = false } = req.body;

    if (!receiver?.trim() || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({ message: 'نام گیرنده، شماره تماس و آدرس الزامی است' });
    }

    // اگر آدرس جدید پیش‌فرض باشد، بقیه را غیرفعال کن
    if (isDefault) {
      await db.query('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    const [result] = await db.query(
      `INSERT INTO user_addresses 
       (user_id, title, receiver, phone, province, city, address, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, receiver.trim(), phone.trim(), province, city, address.trim(), postalCode || null, isDefault ? 1 : 0]
    );

    const [newAddress] = await db.query('SELECT * FROM user_addresses WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      message: 'آدرس با موفقیت اضافه شد',
      data: newAddress[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در ثبت آدرس' });
  }
};

// ---------- PUT /api/v1/user/addresses/:id ----------
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'] || 1;
    const { id } = req.params;
    const { title, receiver, phone, province, city, address, postalCode, isDefault } = req.body;

    // بررسی مالکیت
    const [existing] = await db.query('SELECT * FROM user_addresses WHERE id = ? AND user_id = ?', [id, userId]);

    if (!existing.length) {
      return res.status(404).json({ message: 'آدرس یافت نشد' });
    }

    if (isDefault) {
      await db.query('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }

    await db.query(
      `UPDATE user_addresses SET
        title = COALESCE(?, title),
        receiver = COALESCE(?, receiver),
        phone = COALESCE(?, phone),
        province = COALESCE(?, province),
        city = COALESCE(?, city),
        address = COALESCE(?, address),
        postal_code = COALESCE(?, postal_code),
        is_default = COALESCE(?, is_default)
       WHERE id = ? AND user_id = ?`,
      [title, receiver, phone, province, city, address, postalCode, isDefault !== undefined ? (isDefault ? 1 : 0) : null, id, userId]
    );

    const [updated] = await db.query('SELECT * FROM user_addresses WHERE id = ?', [id]);

    return res.json({
      message: 'آدرس به‌روزرسانی شد',
      data: updated[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در ویرایش آدرس' });
  }
};

// ---------- DELETE /api/v1/user/addresses/:id ----------
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'] || 1;
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [id, userId]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'آدرس یافت نشد' });
    }

    return res.json({ message: 'آدرس حذف شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا در حذف آدرس' });
  }
};

// ---------- PATCH /api/v1/user/addresses/:id/default ----------
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'] || 1;
    const { id } = req.params;

    await db.query('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    const [result] = await db.query('UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'آدرس یافت نشد' });
    }

    return res.json({ message: 'آدرس پیش‌فرض تنظیم شد' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'خطا' });
  }
};
