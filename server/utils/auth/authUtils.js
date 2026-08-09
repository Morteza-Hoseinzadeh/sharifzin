const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const OTP_EXPIRY_MINUTES = 2;
const OTP_MAX_ATTEMPTS = 5;

// ---- password ------------------------------------------------

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// ---- otp -------------------------------------------------------

function generateOtpCode() {
  // 6-digit numeric code, zero-padded
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getOtpExpiryDate() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

/**
 * Stub SMS sender — replace with a real gateway (Kavenegar,
 * Melipayamak, etc). Left as a TODO since no provider was specified.
 */
async function sendSms(phone, message) {
  // eslint-disable-next-line no-console
  console.log(`[SMS -> ${phone}]: ${message}`);
  // TODO: integrate real SMS provider here.
  return true;
}

// ---- jwt ---------------------------------------------------------

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ---- phone validation --------------------------------------------

function isValidIranianPhone(phone) {
  return /^09[0-9]{9}$/.test(String(phone || ''));
}

module.exports = {
  hashPassword,
  comparePassword,
  generateOtpCode,
  getOtpExpiryDate,
  sendSms,
  signToken,
  verifyToken,
  isValidIranianPhone,
  OTP_MAX_ATTEMPTS,
};
