const express = require('express');
const { query } = require('../../utils/dbQuery');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories');
    if (result) return res.status(200).json({ message: 'اطلاعات با موفقیت دریافت شد', data: result });
  } catch (error) {
    return res.status(500).json({ message_fa: 'خطا در دریافت اطلاعات', message_en: error.message, error });
  }
});

module.exports = router;
