const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { sendVerifyCode } = require('../../services/sms');

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const OTP_EXPIRY_MINUTES = 2;
const OTP_MAX_ATTEMPTS = 5;

// --------------------------------------------------
// PASSWORD
// --------------------------------------------------

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// --------------------------------------------------
// OTP
// --------------------------------------------------

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSms(phone, code) {
  if (!code) {
    throw new Error('OTP code is required');
  }

  const result = await sendVerifyCode(phone, code);

  return {
    success: true,
    code: String(code),
    messageId: result?.messageId || null,
    rawResponse: result?.rawResponse || null,
  };
}

function getOtpExpiryDate() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

// --------------------------------------------------
// JWT
// --------------------------------------------------

function signToken(payload) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.verify(token, JWT_SECRET);
}

// --------------------------------------------------
// PHONE
// --------------------------------------------------

function isValidIranianPhone(phone) {
  return /^09[0-9]{9}$/.test(String(phone || ''));
}

module.exports = {
  hashPassword,
  comparePassword,
  generateOtpCode,
  sendSms,
  getOtpExpiryDate,
  signToken,
  verifyToken,
  isValidIranianPhone,
  OTP_MAX_ATTEMPTS,
};
