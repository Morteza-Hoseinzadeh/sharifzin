const axios = require('axios');

const MELIPAYAMAK_USERNAME = process.env.MELIPAYAMAK_USERNAME;
const MELIPAYAMAK_PASSWORD = process.env.MELIPAYAMAK_PASSWORD;
const MELIPAYAMAK_BODY_ID = process.env.MELIPAYAMAK_PAYMENT_BODY_ID;

function normalizePhone(phone) {
  let p = phone.trim();
  if (p.startsWith('+98')) p = '0' + p.slice(3);
  if (p.startsWith('98')) p = '0' + p.slice(2);
  return p;
}

const jalaliDate = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(new Date());
const jalaliTime = new Intl.DateTimeFormat('fa-IR', { timeStyle: 'short' }).format(new Date());

/**
 * ارسال پیامک با پترن (Base Number) ملی‌پیامک
 * @param {string} to شماره موبایل گیرنده
 * @param {string[]} args مقادیر جایگزین در پترن، به ترتیب همون‌طور که در پنل تعریف کردید
 */
async function sendPatternSMS(to, args = []) {
  const payload = {
    username: MELIPAYAMAK_USERNAME,
    password: MELIPAYAMAK_PASSWORD,
    text: args.join(';'),
    to: normalizePhone(to),
    bodyId: MELIPAYAMAK_BODY_ID,
  };

  const { data } = await axios.post('https://console.melipayamak.com/api/send/simple/81a8ce5ef99841dc8b705f9b78ae3642', payload, { headers: { 'Content-Type': 'application/json' } });

  // مقدار برگشتی مثبت و طولانی‌تر از ۱۵ کاراکتر یعنی موفق بوده (RecId)
  // مقادیر منفی کد خطا هستن (طبق مستندات ملی‌پیامک)
  if (!data || Number(data) < 0) {
    throw new Error(`Melipayamak error code: ${data}`);
  }

  return data;
}

module.exports = { sendPatternSMS };
