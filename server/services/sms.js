const axios = require('axios');

// --------------------------------------------------
// MELIPAYAMAK CONFIG
// --------------------------------------------------

const MELIPAYAMAK_USERNAME = process.env.MELIPAYAMAK_USERNAME;

const MELIPAYAMAK_API_KEY = process.env.MELIPAYAMAK_API_KEY;

// OTP verification pattern
const MELIPAYAMAK_BODY_ID = process.env.MELIPAYAMAK_BODY_ID;

// Password reset pattern
const MELIPAYAMAK_RESET_BODY_ID = process.env.MELIPAYAMAK_RESET_BODY_ID;

// MeliPayamak legacy API
const MELIPAYAMAK_URL = 'https://api.payamak-panel.com/post/Send.asmx/SendByBaseNumber2';

// --------------------------------------------------
// PHONE
// --------------------------------------------------

function normalizePhone(phone) {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  let value = String(phone).trim();

  if (value.startsWith('+98')) {
    value = `0${value.slice(3)}`;
  } else if (value.startsWith('0098')) {
    value = `0${value.slice(4)}`;
  } else if (value.startsWith('98')) {
    value = `0${value.slice(2)}`;
  }

  value = value.replace(/[^\d]/g, '');

  if (value.length === 10 && value.startsWith('9')) {
    value = `0${value}`;
  }

  return value;
}

function isValidIranianPhone(phone) {
  return /^09\d{9}$/.test(String(phone || ''));
}

// --------------------------------------------------
// SEND PATTERN SMS
// --------------------------------------------------

async function sendVerifyCode(to, code, bodyId = MELIPAYAMAK_BODY_ID) {
  // ----------------------------------------------
  // Config validation
  // ----------------------------------------------

  if (!MELIPAYAMAK_USERNAME) {
    throw new Error('MELIPAYAMAK_USERNAME is not configured');
  }

  if (!MELIPAYAMAK_API_KEY) {
    throw new Error('MELIPAYAMAK_API_KEY is not configured');
  }

  if (!bodyId) {
    throw new Error('MeliPayamak bodyId is not configured');
  }

  // ----------------------------------------------
  // Phone validation
  // ----------------------------------------------

  const phone = normalizePhone(to);

  if (!isValidIranianPhone(phone)) {
    throw new Error(`Invalid Iranian phone number: ${phone}`);
  }

  // ----------------------------------------------
  // OTP validation
  // ----------------------------------------------

  if (!code) {
    throw new Error('OTP code is required');
  }

  // ----------------------------------------------
  // Body ID validation
  // ----------------------------------------------

  const numericBodyId = Number(bodyId);

  if (!Number.isInteger(numericBodyId)) {
    throw new Error(`MeliPayamak bodyId must be a numeric integer. Received: ${bodyId}`);
  }

  // ----------------------------------------------
  // Request
  // ----------------------------------------------

  const params = new URLSearchParams();

  params.append('username', MELIPAYAMAK_USERNAME);

  /**
   * IMPORTANT
   *
   * According to MeliPayamak support:
   *
   * password = API KEY
   */
  params.append('password', MELIPAYAMAK_API_KEY);

  params.append('text', String(code));

  params.append('to', phone);

  params.append('bodyId', String(numericBodyId));

  console.log('\n========================================');

  console.log('       MELIPAYAMAK SEND PATTERN');

  console.log('========================================');

  console.log('PHONE:', phone);

  console.log('BODY ID:', numericBodyId);

  console.log('USERNAME:', MELIPAYAMAK_USERNAME ? 'SET' : 'MISSING');

  console.log('API KEY:', MELIPAYAMAK_API_KEY ? `SET (${MELIPAYAMAK_API_KEY.length} chars)` : 'MISSING');

  console.log('OTP:', code);

  console.log('URL:', MELIPAYAMAK_URL);

  console.log('========================================\n');

  try {
    const response = await axios.post(MELIPAYAMAK_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },

      timeout: 20000,

      responseType: 'text',

      validateStatus: () => true,
    });

    const rawResponse = typeof response.data === 'string' ? response.data.trim() : String(response.data);

    console.log('\n========================================');

    console.log('     MELIPAYAMAK RESPONSE');

    console.log('========================================');

    console.log('HTTP STATUS:', response.status);

    console.log('RAW RESPONSE:', rawResponse);

    console.log('========================================\n');

    // ------------------------------------------
    // Parse XML response
    // ------------------------------------------

    const match = rawResponse.match(/<string[^>]*>(.*?)<\/string>/i);

    const result = match ? match[1].trim() : rawResponse;

    // ------------------------------------------
    // MeliPayamak error
    // ------------------------------------------

    if (result.startsWith('-')) {
      const error = new Error(`MeliPayamak returned error code ${result}`);

      error.meliPayamakCode = result;

      error.httpStatus = response.status;

      error.rawResponse = rawResponse;

      throw error;
    }

    // ------------------------------------------
    // HTTP error
    // ------------------------------------------

    if (response.status < 200 || response.status >= 300) {
      const error = new Error(`MeliPayamak HTTP ${response.status}`);

      error.httpStatus = response.status;

      error.rawResponse = rawResponse;

      throw error;
    }

    // ------------------------------------------
    // Success
    // ------------------------------------------

    return {
      success: true,

      phone,

      code: String(code),

      bodyId: numericBodyId,

      messageId: result,

      rawResponse,
    };
  } catch (error) {
    console.error('\n========================================');

    console.error('[MELIPAYAMAK ERROR]');

    console.error('MESSAGE:', error?.message);

    console.error('MELIPAYAMAK CODE:', error?.meliPayamakCode);

    console.error('HTTP STATUS:', error?.httpStatus || error?.response?.status);

    console.error('RAW RESPONSE:', error?.rawResponse || error?.response?.data);

    console.error('BODY ID:', numericBodyId);

    console.error('PHONE:', phone);

    console.error('========================================\n');

    throw error;
  }
}

// --------------------------------------------------
// PASSWORD RESET SMS
// --------------------------------------------------

async function sendPasswordResetCode(phone, code) {
  return sendVerifyCode(phone, code, MELIPAYAMAK_RESET_BODY_ID);
}

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
  normalizePhone,

  isValidIranianPhone,

  sendVerifyCode,

  sendPasswordResetCode,
};
