const { verifyToken } = require('../utils/authUtils');
const { query } = require('../utils/dbQuery');

/**
 * Reads `Authorization: Bearer <token>`, verifies it, loads the user
 * from the DB (to catch since-blocked/deleted accounts), and attaches
 * it to req.user.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message_fa: 'توکن احراز هویت ارسال نشده است' });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message_fa: 'توکن نامعتبر یا منقضی شده است' });
    }

    const rows = await query('SELECT id, full_name, phone, email, role, status FROM users WHERE id = ?', [decoded.id]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message_fa: 'کاربر یافت نشد' });
    }

    const user = rows[0];
    if (user.status !== 'active') {
      return res.status(403).json({ message_fa: 'حساب کاربری شما مسدود شده است' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message_fa: 'خطا در احراز هویت', message_en: error.message, error });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message_fa: 'دسترسی غیرمجاز' });
  }
  return next();
}

module.exports = { authenticate, requireAdmin };
