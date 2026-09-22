const axios = require('axios');

const MELIPAYAMAK_USERNAME = process.env.MELIPAYAMAK_USERNAME;
const MELIPAYAMAK_API_KEY = process.env.MELIPAYAMAK_API_KEY;

const MELIPAYAMAK_BODY_ID = process.env.MELIPAYAMAK_BODY_ID;
const MELIPAYAMAK_RESET_BODY_ID = process.env.MELIPAYAMAK_RESET_BODY_ID;

const MELIPAYAMAK_ORDER_BODY_ID = process.env.MELIPAYAMAK_ORDER_BODY_ID || '534447';

const MELIPAYAMAK_URL = 'https://api.payamak-panel.com/post/Send.asmx/SendByBaseNumber2';

// -------------------------------------------------------------
// Phone helpers
// -------------------------------------------------------------

function normalizePhone(phone) {
  if (!phone) return '';

  let value = String(phone).trim();

  // Persian digits -> English
  value = value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));

  // Arabic digits -> English
  value = value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

  // Remove spaces, -, (, )
  value = value.replace(/[\s\-()]/g, '');

  // +98xxxxxxxxxx -> 09xxxxxxxxxx
  if (value.startsWith('+98')) {
    value = '0' + value.slice(3);
  }

  // 98xxxxxxxxxx -> 09xxxxxxxxxx
  if (value.startsWith('98') && value.length === 12) {
    value = '0' + value.slice(2);
  }

  return value;
}

function isValidIranianPhone(phone) {
  const normalized = normalizePhone(phone);

  return /^09\d{9}$/.test(normalized);
}

// -------------------------------------------------------------
// SendByBaseNumber2
// -------------------------------------------------------------

async function sendPatternSMS(to, values, bodyId) {
  if (!MELIPAYAMAK_USERNAME) {
    throw new Error('MELIPAYAMAK_USERNAME is not configured');
  }

  if (!MELIPAYAMAK_API_KEY) {
    throw new Error('MELIPAYAMAK_API_KEY is not configured');
  }

  const phone = normalizePhone(to);

  if (!isValidIranianPhone(phone)) {
    throw new Error(`Invalid Iranian phone number: ${to}`);
  }

  if (!bodyId) {
    throw new Error('MeliPayamak bodyId is not configured');
  }

  const numericBodyId = Number(bodyId);

  if (!Number.isInteger(numericBodyId) || numericBodyId <= 0) {
    throw new Error(`Invalid MeliPayamak bodyId: ${bodyId}`);
  }

  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Pattern SMS values must be a non-empty array');
  }

  /*
   * MeliPayamak SendByBaseNumber2 expects pattern
   * variables separated with semicolon.
   *
   * Example:
   *
   * [
   *   'مرتضی',
   *   'SZ-123456',
   *   '2500000',
   *   '1405/07/01',
   *   '14:35',
   *   'در انتظار پرداخت'
   * ]
   *
   * becomes:
   *
   * مرتضی;SZ-123456;2500000;1405/07/01;14:35;در انتظار پرداخت
   */

  const text = values.map((value) => String(value ?? '')).join(';');

  const params = new URLSearchParams();

  params.append('username', MELIPAYAMAK_USERNAME);
  params.append('password', MELIPAYAMAK_API_KEY);
  params.append('text', text);
  params.append('to', phone);
  params.append('bodyId', String(numericBodyId));

  try {
    const response = await axios.post(MELIPAYAMAK_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 15000,
    });

    const rawResponse = String(response.data ?? '').trim();

    /*
     * MeliPayamak normally returns:
     *
     * <string xmlns="http://tempuri.org/">123456789</string>
     *
     * or an error code such as:
     *
     * -1
     * -4
     * -5
     */

    const match = rawResponse.match(/<string[^>]*>(.*?)<\/string>/i);

    const result = match ? String(match[1]).trim() : rawResponse.replace(/<[^>]+>/g, '').trim();

    if (!result) {
      throw new Error(`MeliPayamak returned an empty response. Raw response: ${rawResponse}`);
    }

    // MeliPayamak error responses are negative numbers.
    if (/^-\d+$/.test(result)) {
      throw new Error(`MeliPayamak SMS failed. Error code: ${result}`);
    }

    return {
      success: true,
      phone,
      bodyId: numericBodyId,
      messageId: result,
      rawResponse,
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`MeliPayamak HTTP ${error.response.status}: ${String(error.response.data)}`);
    }

    throw error;
  }
}

// -------------------------------------------------------------
// Verify / Register OTP
// -------------------------------------------------------------

async function sendVerifyCode(to, code) {
  if (!MELIPAYAMAK_BODY_ID) {
    throw new Error('MELIPAYAMAK_BODY_ID is not configured');
  }

  if (!code) {
    throw new Error('Verification code is required');
  }

  return sendPatternSMS(to, [code], MELIPAYAMAK_BODY_ID);
}

// -------------------------------------------------------------
// Password reset OTP
// -------------------------------------------------------------

async function sendPasswordResetCode(to, code) {
  if (!MELIPAYAMAK_RESET_BODY_ID) {
    throw new Error('MELIPAYAMAK_RESET_BODY_ID is not configured');
  }

  if (!code) {
    throw new Error('Password reset code is required');
  }

  return sendPatternSMS(to, [code], MELIPAYAMAK_RESET_BODY_ID);
}

// -------------------------------------------------------------
// Order confirmation SMS
// Body ID: 534447
// -------------------------------------------------------------

async function sendOrderConfirmationSMS({ phone, fullName, orderCode, amount, date, time, status }) {
  const bodyId = process.env.MELIPAYAMAK_ORDER_BODY_ID || '534447';

  return sendPatternSMS(phone, [fullName, orderCode, amount, date, time, status], bodyId);
}
// -------------------------------------------------------------
// Exports
// -------------------------------------------------------------

module.exports = {
  normalizePhone,
  isValidIranianPhone,

  sendPatternSMS,
  sendVerifyCode,
  sendPasswordResetCode,
  sendOrderConfirmationSMS,
};
