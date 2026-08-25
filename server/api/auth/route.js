const express = require('express');
const { query } = require('../../utils/dbQuery');
const { hashPassword, comparePassword, generateOtpCode, getOtpExpiryDate, sendSms, signToken, isValidIranianPhone, OTP_MAX_ATTEMPTS, verifyToken } = require('../../utils/auth/authUtils');

const router = express.Router();

// ------------------------------------------------------------
// Normalizes Iranian mobile numbers to a single canonical form
// (0912xxxxxxx) so register/login/OTP lookups always match,
// regardless of whether the client sends 0912..., +98912...,
// or 98912.... Adjust the target format to match whatever
// isValidIranianPhone() expects.
// ------------------------------------------------------------
function normalizePhone(phone) {
  if (!phone) return phone;
  let p = String(phone).trim().replace(/[\s-]/g, '');
  if (p.startsWith('+98')) p = '0' + p.slice(3);
  else if (p.startsWith('0098')) p = '0' + p.slice(4);
  else if (p.startsWith('98')) p = '0' + p.slice(2);
  else if (p.startsWith('9') && p.length === 10) p = '0' + p;
  return p;
}

// Never leak internal error details to the client.
function fail(res, status, message_fa, error, context) {
  console.error(`[auth:${context}]`, error);
  return res.status(status).json({ message_fa });
}

// ============================================================
// POST /auth/register
// ============================================================
router.post('/register', async (req, res) => {
  try {
    const { fullName, phone: rawPhone, password, confirmPassword } = req.body;

    if (!fullName || !rawPhone || !password || !confirmPassword) {
      return res.status(400).json({ message_fa: 'همه فیلدها الزامی هستند' });
    }
    if (!isValidIranianPhone(rawPhone)) {
      return res.status(400).json({ message_fa: 'شماره موبایل معتبر نیست' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message_fa: 'رمز عبور باید حداقل ۸ کاراکتر باشد' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message_fa: 'رمز عبور و تکرار آن یکسان نیستند' });
    }

    const phone = normalizePhone(rawPhone);

    const existing = await query('SELECT id, phone_verified_at FROM users WHERE phone = ?', [phone]);

    if (existing && existing.length > 0) {
      if (existing[0].phone_verified_at) {
        return res.status(409).json({ message_fa: 'این شماره موبایل قبلاً ثبت‌نام کرده است' });
      }
      const code = generateOtpCode();
      await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, 'register', getOtpExpiryDate()]);
      await sendSms(phone, `کد تایید شریف‌زین: ${code}`);
      return res.status(200).json({ message: 'کد تایید مجدد ارسال شد' });
    }

    const hashed = await hashPassword(password);

    try {
      await query('INSERT INTO users (full_name, phone, password, role, status) VALUES (?, ?, ?, ?, ?)', [fullName, phone, hashed, 'customer', 'active']);
    } catch (dbErr) {
      // Unique index on users.phone catches the race where two
      // requests for the same number both passed the SELECT above.
      if (dbErr && dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message_fa: 'این شماره موبایل قبلاً ثبت‌نام کرده است' });
      }
      throw dbErr;
    }

    const code = generateOtpCode();
    await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, 'register', getOtpExpiryDate()]);
    await sendSms(phone, `کد تایید شریف‌زین: ${code}`);

    return res.status(201).json({ message: 'ثبت‌نام انجام شد، کد تایید برای شما پیامک شد' });
  } catch (error) {
    return fail(res, 500, 'خطا در ثبت‌نام', error, 'register');
  }
});

router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message_fa: 'توکن احراز هویت ارسال نشده است',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        message_fa: 'توکن نامعتبر یا منقضی شده است',
      });
    }

    if (!decoded?.id) {
      return res.status(401).json({
        message_fa: 'اطلاعات توکن نامعتبر است',
      });
    }

    const userRows = await query(
      `
        SELECT
          id,
          full_name,
          phone,
          email,
          role,
          status,
          phone_verified_at
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [decoded.id]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({
        message_fa: 'کاربر یافت نشد',
      });
    }

    const user = userRows[0];

    if (user.status && user.status !== 'active') {
      return res.status(403).json({
        message_fa: 'حساب کاربری شما فعال نیست',
      });
    }

    return res.status(200).json({
      message: 'احراز هویت موفق بود',
      user,
    });
  } catch (error) {
    console.error('AUTH VERIFY ERROR:', error);

    return res.status(500).json({
      message_fa: 'خطا در بررسی احراز هویت',
    });
  }
});

// ============================================================
// POST /auth/verify-otp
// ============================================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone: rawPhone, code } = req.body;

    if (!rawPhone || !code) {
      return res.status(400).json({ message_fa: 'شماره موبایل و کد تایید الزامی است' });
    }

    const phone = normalizePhone(rawPhone);

    const otpRows = await query(
      `SELECT * FROM otp_codes
       WHERE phone = ? AND purpose = 'register' AND consumed_at IS NULL
       ORDER BY id DESC LIMIT 1`,
      [phone]
    );

    if (!otpRows || otpRows.length === 0) {
      return res.status(400).json({ message_fa: 'کد تاییدی برای این شماره یافت نشد' });
    }

    const otp = otpRows[0];

    if (new Date(otp.expires_at) < new Date()) {
      return res.status(400).json({ message_fa: 'کد تایید منقضی شده است' });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message_fa: 'تعداد تلاش‌های مجاز به پایان رسیده، کد جدید درخواست کنید' });
    }
    if (otp.code !== String(code)) {
      await query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?', [otp.id]);
      return res.status(400).json({ message_fa: 'کد تایید نادرست است' });
    }

    await query('UPDATE otp_codes SET consumed_at = NOW() WHERE id = ?', [otp.id]);
    await query('UPDATE users SET phone_verified_at = NOW() WHERE phone = ?', [phone]);

    const userRows = await query('SELECT id, full_name, phone, email, role, status FROM users WHERE phone = ?', [phone]);
    const user = userRows[0];

    const token = signToken({ id: user.id, role: user.role });

    return res.status(200).json({ message: 'شماره موبایل با موفقیت تایید شد', data: { user, token } });
  } catch (error) {
    return fail(res, 500, 'خطا در تایید کد', error, 'verify-otp');
  }
});

// ============================================================
// POST /auth/resend-otp
// body: { phone, purpose: 'register' | 'reset_password' }
// ============================================================
router.post('/resend-otp', async (req, res) => {
  try {
    const { phone: rawPhone, purpose } = req.body;

    if (!rawPhone || !['register', 'reset_password'].includes(purpose)) {
      return res.status(400).json({ message_fa: 'ورودی نامعتبر است' });
    }

    const phone = normalizePhone(rawPhone);

    const userRows = await query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message_fa: 'کاربری با این شماره یافت نشد' });
    }

    const recent = await query(
      `SELECT id FROM otp_codes
       WHERE phone = ? AND purpose = ? AND created_at > (NOW() - INTERVAL 60 SECOND)
       ORDER BY id DESC LIMIT 1`,
      [phone, purpose]
    );
    if (recent && recent.length > 0) {
      return res.status(429).json({ message_fa: 'لطفاً کمی صبر کنید و دوباره تلاش کنید' });
    }

    const code = generateOtpCode();
    await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, purpose, getOtpExpiryDate()]);
    await sendSms(phone, `کد تایید شریف‌زین: ${code}`);

    return res.status(200).json({ message: 'کد تایید ارسال شد' });
  } catch (error) {
    return fail(res, 500, 'خطا در ارسال کد', error, 'resend-otp');
  }
});

// ============================================================
// POST /auth/login
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { phone: rawPhone, password } = req.body;

    if (!rawPhone || !password) {
      return res.status(400).json({ message_fa: 'شماره موبایل و رمز عبور الزامی است' });
    }

    const phone = normalizePhone(rawPhone);

    const rows = await query('SELECT id, full_name, phone, email, password, role, status, phone_verified_at FROM users WHERE phone = ?', [phone]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message_fa: 'شماره موبایل یا رمز عبور اشتباه است' });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ message_fa: 'حساب کاربری شما مسدود شده است' });
    }
    if (!user.phone_verified_at) {
      return res.status(403).json({ message_fa: 'شماره موبایل شما هنوز تایید نشده است' });
    }

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message_fa: 'شماره موبایل یا رمز عبور اشتباه است' });
    }

    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    const token = signToken({ id: user.id, role: user.role });
    delete user.password;

    return res.status(200).json({ message: 'ورود با موفقیت انجام شد', data: { user, token } });
  } catch (error) {
    return fail(res, 500, 'خطا در ورود', error, 'login');
  }
});

// ============================================================
// POST /auth/forgot-password/request
// ============================================================
router.post('/forgot-password/request', async (req, res) => {
  try {
    const { phone: rawPhone } = req.body;

    if (!rawPhone || !isValidIranianPhone(rawPhone)) {
      return res.status(400).json({ message_fa: 'شماره موبایل معتبر نیست' });
    }

    const phone = normalizePhone(rawPhone);

    const rows = await query('SELECT id, status FROM users WHERE phone = ?', [phone]);
    // Don't reveal whether the account exists, and don't let a
    // blocked account fish for confirmation either.
    if (!rows || rows.length === 0 || rows[0].status !== 'active') {
      return res.status(200).json({ message: 'در صورت وجود حساب کاربری، کد تایید ارسال شد' });
    }

    const code = generateOtpCode();
    await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, 'reset_password', getOtpExpiryDate()]);
    await sendSms(phone, `کد بازیابی رمز عبور شریف‌زین: ${code}`);

    return res.status(200).json({ message: 'در صورت وجود حساب کاربری، کد تایید ارسال شد' });
  } catch (error) {
    return fail(res, 500, 'خطا در ارسال کد بازیابی', error, 'forgot-password/request');
  }
});

// ============================================================
// POST /auth/forgot-password/reset
// body: { phone, code, newPassword, confirmNewPassword }
// ============================================================
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { phone: rawPhone, code, newPassword, confirmNewPassword } = req.body;

    if (!rawPhone || !code || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message_fa: 'همه فیلدها الزامی هستند' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message_fa: 'رمز عبور باید حداقل ۸ کاراکتر باشد' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message_fa: 'رمز عبور و تکرار آن یکسان نیستند' });
    }

    const phone = normalizePhone(rawPhone);

    // A blocked user shouldn't be able to reset their way back in.
    const userRows = await query('SELECT id, status FROM users WHERE phone = ?', [phone]);
    if (!userRows || userRows.length === 0) {
      return res.status(400).json({ message_fa: 'کد تاییدی برای این شماره یافت نشد' });
    }
    if (userRows[0].status !== 'active') {
      return res.status(403).json({ message_fa: 'حساب کاربری شما مسدود شده است' });
    }

    const otpRows = await query(
      `SELECT * FROM otp_codes
       WHERE phone = ? AND purpose = 'reset_password' AND consumed_at IS NULL
       ORDER BY id DESC LIMIT 1`,
      [phone]
    );

    if (!otpRows || otpRows.length === 0) {
      return res.status(400).json({ message_fa: 'کد تاییدی برای این شماره یافت نشد' });
    }

    const otp = otpRows[0];

    if (new Date(otp.expires_at) < new Date()) {
      return res.status(400).json({ message_fa: 'کد تایید منقضی شده است' });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message_fa: 'تعداد تلاش‌های مجاز به پایان رسیده، کد جدید درخواست کنید' });
    }
    if (otp.code !== String(code)) {
      await query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?', [otp.id]);
      return res.status(400).json({ message_fa: 'کد تایید نادرست است' });
    }

    const hashed = await hashPassword(newPassword);
    await query('UPDATE otp_codes SET consumed_at = NOW() WHERE id = ?', [otp.id]);
    await query('UPDATE users SET password = ? WHERE phone = ?', [hashed, phone]);

    return res.status(200).json({ message: 'رمز عبور با موفقیت تغییر کرد' });
  } catch (error) {
    return fail(res, 500, 'خطا در تغییر رمز عبور', error, 'forgot-password/reset');
  }
});

// ============================================================
// GET /auth/me
// ============================================================
const { authenticate } = require('../../middlewares/auth/auth.middleware');

router.get('/me', authenticate, async (req, res) => {
  return res.status(200).json({ message: 'اطلاعات کاربر', data: req.user });
});

module.exports = router;
