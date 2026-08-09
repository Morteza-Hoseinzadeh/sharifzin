const express = require('express');
const { query } = require('../../utils/dbQuery');
const { hashPassword, comparePassword, generateOtpCode, getOtpExpiryDate, sendSms, signToken, isValidIranianPhone, OTP_MAX_ATTEMPTS } = require('../../utils/auth/authUtils');

const router = express.Router();

/**
 * Assumptions (adjust to match your actual `dbQuery` wrapper):
 * - `query(sql, params)` runs a parameterized MySQL query.
 * - For SELECT, it resolves to an array of row objects.
 * - For INSERT, MySQL has no RETURNING clause, so rather than
 *   relying on what INSERT returns, every INSERT here is followed
 *   by a SELECT (by phone or insertId) to fetch the fresh row —
 *   this works regardless of whether your wrapper returns the raw
 *   mysql2 ResultSetHeader, [rows, fields], or something else.
 * - Uses `?` placeholders (mysql2 style). Swap to `$1, $2...` if
 *   your wrapper is actually Postgres-flavored.
 */

// ============================================================
// POST /auth/register
// Creates an unverified user + sends a registration OTP.
// ============================================================
router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, password, confirmPassword } = req.body;

    if (!fullName || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message_fa: 'همه فیلدها الزامی هستند' });
    }
    if (!isValidIranianPhone(phone)) {
      return res.status(400).json({ message_fa: 'شماره موبایل معتبر نیست' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message_fa: 'رمز عبور باید حداقل ۸ کاراکتر باشد' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message_fa: 'رمز عبور و تکرار آن یکسان نیستند' });
    }

    const existing = await query('SELECT id, phone_verified_at FROM users WHERE phone = ?', [phone]);

    if (existing && existing.length > 0) {
      if (existing[0].phone_verified_at) {
        return res.status(409).json({ message_fa: 'این شماره موبایل قبلاً ثبت‌نام کرده است' });
      }
      // Registered but never verified — let them retry by refreshing
      // the OTP instead of blocking them forever.
      const code = generateOtpCode();
      await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, 'register', getOtpExpiryDate()]);
      await sendSms(phone, `کد تایید شریف‌زین: ${code}`);
      return res.status(200).json({ message: 'کد تایید مجدد ارسال شد' });
    }

    const hashed = await hashPassword(password);
    await query('INSERT INTO users (full_name, phone, password, role, status) VALUES (?, ?, ?, ?, ?)', [fullName, phone, hashed, 'customer', 'active']);

    const code = generateOtpCode();
    await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, 'register', getOtpExpiryDate()]);
    await sendSms(phone, `کد تایید شریف‌زین: ${code}`);

    return res.status(201).json({ message: 'ثبت‌نام انجام شد، کد تایید برای شما پیامک شد' });
  } catch (error) {
    return res.status(500).json({ message_fa: 'خطا در ثبت‌نام', message_en: error.message, error });
  }
});

// ============================================================
// POST /auth/verify-otp
// Verifies the registration OTP, marks phone_verified_at, and
// logs the user in (returns a token) so they don't have to sign
// in separately right after verifying.
// ============================================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ message_fa: 'شماره موبایل و کد تایید الزامی است' });
    }

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
    return res.status(500).json({ message_fa: 'خطا در تایید کد', message_en: error.message, error });
  }
});

// ============================================================
// POST /auth/resend-otp
// body: { phone, purpose: 'register' | 'reset_password' }
// ============================================================
router.post('/resend-otp', async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    if (!phone || !['register', 'reset_password'].includes(purpose)) {
      return res.status(400).json({ message_fa: 'ورودی نامعتبر است' });
    }

    const userRows = await query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message_fa: 'کاربری با این شماره یافت نشد' });
    }

    // simple throttle: block resending if an unexpired code was
    // issued in the last 60 seconds
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
    return res.status(500).json({ message_fa: 'خطا در ارسال کد', message_en: error.message, error });
  }
});

// ============================================================
// POST /auth/login
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message_fa: 'شماره موبایل و رمز عبور الزامی است' });
    }

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
    return res.status(500).json({ message_fa: 'خطا در ورود', message_en: error.message, error });
  }
});

// ============================================================
// POST /auth/forgot-password/request
// Issues a reset_password OTP for an existing phone number.
// ============================================================
router.post('/forgot-password/request', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !isValidIranianPhone(phone)) {
      return res.status(400).json({ message_fa: 'شماره موبایل معتبر نیست' });
    }

    const rows = await query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (!rows || rows.length === 0) {
      // Avoid confirming/denying account existence to outside callers.
      return res.status(200).json({ message: 'در صورت وجود حساب کاربری، کد تایید ارسال شد' });
    }

    const code = generateOtpCode();
    await query('INSERT INTO otp_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [phone, code, 'reset_password', getOtpExpiryDate()]);
    await sendSms(phone, `کد بازیابی رمز عبور شریف‌زین: ${code}`);

    return res.status(200).json({ message: 'در صورت وجود حساب کاربری، کد تایید ارسال شد' });
  } catch (error) {
    return res.status(500).json({ message_fa: 'خطا در ارسال کد بازیابی', message_en: error.message, error });
  }
});

// ============================================================
// POST /auth/forgot-password/reset
// body: { phone, code, newPassword, confirmNewPassword }
// ============================================================
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { phone, code, newPassword, confirmNewPassword } = req.body;

    if (!phone || !code || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message_fa: 'همه فیلدها الزامی هستند' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message_fa: 'رمز عبور باید حداقل ۸ کاراکتر باشد' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message_fa: 'رمز عبور و تکرار آن یکسان نیستند' });
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
    return res.status(500).json({ message_fa: 'خطا در تغییر رمز عبور', message_en: error.message, error });
  }
});

// ============================================================
// GET /auth/me   (example protected route)
// Mount `authenticate` where this router is registered, e.g.:
//   const { authenticate } = require('../../middlewares/auth.middleware');
//   router.get('/me', authenticate, ...)
// Included here directly for convenience.
// ============================================================
const { authenticate } = require('../../middlewares/auth/auth.middleware');

router.get('/me', authenticate, async (req, res) => {
  return res.status(200).json({ message: 'اطلاعات کاربر', data: req.user });
});

module.exports = router;
