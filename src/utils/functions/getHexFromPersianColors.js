const persianColors = {
  قرمز: '#d32f2f',
  آبی: '#1976d2',
  سبز: '#388e3c',
  زرد: '#fbc02d',
  نارنجی: '#f57c00',
  بنفش: '#7b1fa2',
  صورتی: '#e91e63',
  سفید: '#ffffff',
  مشکی: '#000000',
  خاکستری: '#757575',
  سرمه‌ای: '#0d47a1',
  فیروزه‌ای: '#26a69a',
  یاسی: '#ab47bc',
  ارغوانی: '#7b1fa2',
  گلبهی: '#ec407a',
  هلویی: '#ff7043',
  آلبالویی: '#c2185b',
  خردلی: '#f9a825',
  زیتونی: '#558b2f',
  طلایی: '#f9a825',
  نقره‌ای: '#bdbdbd',
  برنزی: '#6d4c41',
  زرشکی: '#880e4f',
  آبی_روشن: '#64b5f6',
  سبز_روشن: '#81c784',
  زرد_روشن: '#fff176',
  نارنجی_روشن: '#ff8a65',
  بنفش_روشن: '#ba68c8',
  صورتی_روشن: '#f06292',
  خاکستری_روشن: '#e0e0e0',
  خاکستری_تیره: '#616161',
  آبی_تیره: '#0d47a1',
  سبز_تیره: '#2e7d32',
  زرد_تیره: '#fbc02d',
  نارنجی_تیره: '#f57c00',
  تیتانیوم: '#a8a29e', // Natural Titanium (grayish silver)
  تیتانیوم_مشکی: '#1f2528', // Black Titanium (dark charcoal)
  تیتانیوم_سفید: '#e5e7eb', // White / Silver Titanium
  تیتانیوم_طبیعی: '#a8a29e',
  تیتانیوم_سیاه: '#1f2528',
  تیتانیوم_نقره‌ای: '#d1d5db',
};

export function getHexFromPersianColor(name) {
  if (!name) return null;
  const key = name.trim().toLowerCase().replace(/\s+/g, '');
  return persianColors[key] || null;
}
