const axios = require('axios');

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const SANDBOX = process.env.ZARINPAL_SANDBOX !== 'false';

const CALLBACK_URL = process.env.ZARINPAL_CALLBACK_URL;

const REQUEST_URL = SANDBOX ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json' : 'https://api.zarinpal.com/pg/v4/payment/request.json';

const VERIFY_URL = SANDBOX ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json' : 'https://api.zarinpal.com/pg/v4/payment/verify.json';

const START_PAY_URL = SANDBOX ? 'https://sandbox.zarinpal.com/pg/StartPay/' : 'https://www.zarinpal.com/pg/StartPay/';

/**
 * ساخت درخواست پرداخت
 */
const requestPayment = async ({ amount, description, orderId, email, mobile }) => {
  if (!MERCHANT_ID) {
    throw new Error('ZARINPAL_MERCHANT_ID تنظیم نشده است');
  }

  if (!CALLBACK_URL) {
    throw new Error('ZARINPAL_CALLBACK_URL تنظیم نشده است');
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error('مبلغ پرداخت نامعتبر است');
  }

  const callbackUrl = new URL(CALLBACK_URL);

  callbackUrl.searchParams.set('order_id', String(orderId));

  const payload = {
    merchant_id: MERCHANT_ID,
    amount: Number(amount),
    description: description || `پرداخت سفارش ${orderId}`,
    callback_url: callbackUrl.toString(),

    metadata: {
      order_id: String(orderId),
    },
  };

  if (email) {
    payload.metadata.email = email;
  }

  if (mobile) {
    payload.metadata.mobile = mobile;
  }

  const response = await axios.post(REQUEST_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 15000,
  });

  const result = response.data;

  if (!result || !result.data) {
    throw new Error(result?.errors ? JSON.stringify(result.errors) : 'پاسخ نامعتبر از زرین‌پال دریافت شد');
  }

  if (Number(result.data.code) !== 100) {
    throw new Error(result.data.message || result.errors?.message || `خطای زرین‌پال: ${result.data.code}`);
  }

  const authority = result.data.authority;

  if (!authority) {
    throw new Error('Authority از زرین‌پال دریافت نشد');
  }

  return {
    authority,
    paymentUrl: `${START_PAY_URL}${authority}`,
    code: result.data.code,
    message: result.data.message,
  };
};

/**
 * تایید پرداخت
 */
const verifyPayment = async ({ amount, authority }) => {
  if (!MERCHANT_ID) {
    throw new Error('ZARINPAL_MERCHANT_ID تنظیم نشده است');
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error('مبلغ پرداخت نامعتبر است');
  }

  if (!authority) {
    throw new Error('Authority وجود ندارد');
  }

  const payload = {
    merchant_id: MERCHANT_ID,
    amount: Number(amount),
    authority,
  };

  const response = await axios.post(VERIFY_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 15000,
  });

  const result = response.data;

  const code = Number(result?.data?.code);

  if (code !== 100 && code !== 101) {
    throw new Error(result?.data?.message || result?.errors?.message || `تایید پرداخت ناموفق بود: ${code}`);
  }

  return {
    success: true,
    code,
    refId: result.data.ref_id,
    message: result.data.message,
  };
};

module.exports = {
  requestPayment,
  verifyPayment,
};
