const db = require('../models/dbConnection');

// POST /api/v1/discount/validate
exports.validateDiscount = async (req, res) => {
  try {
    const { code, totalPrice = 0 } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'کد تخفیف الزامی است' });
    }

    const normalizedCode = code.trim().toUpperCase();

    const [rows] = await db.query(
      `SELECT * FROM discount_codes 
       WHERE code = ? AND is_active = 1`,
      [normalizedCode]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'کد تخفیف نامعتبر است' });
    }

    const discount = rows[0];

    // تاریخ انقضا
    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
      return res.status(400).json({ message: 'کد تخفیف منقضی شده است' });
    }

    // محدودیت تعداد استفاده
    if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
      return res.status(400).json({ message: 'ظرفیت استفاده از این کد به پایان رسیده است' });
    }

    // حداقل مبلغ سفارش
    if (Number(totalPrice) < Number(discount.min_order_amount || 0)) {
      return res.status(400).json({
        message: `حداقل مبلغ سفارش برای این کد ${Number(discount.min_order_amount).toLocaleString()} تومان است`,
      });
    }

    // محاسبه مبلغ تخفیف
    let discountAmount = 0;
    if (discount.type === 'percent') {
      discountAmount = Math.round((Number(totalPrice) * Number(discount.value)) / 100);
    } else {
      discountAmount = Math.min(Number(discount.value), Number(totalPrice));
    }

    return res.json({
      success: true,
      discount: {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        label: discount.type === 'percent' ? `${discount.value}٪ تخفیف` : `${Number(discount.value).toLocaleString()} تومان تخفیف`,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    return res.status(500).json({ message: 'خطا در بررسی کد تخفیف' });
  }
};
