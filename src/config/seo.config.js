// config/seo.config.js

const BASE_URL = process.env.BASE_URL || 'https://sharifzin.ir';

export const siteConfig = {
  name: 'شریف زین',

  domain: BASE_URL,

  defaultTitle: 'خرید و تعویض زین موتور | شریف زین',

  defaultDescription: 'خرید انواع زین موتور، تعویض و روکش زین موتور با بهترین کیفیت و قیمت مناسب. مشاوره رایگان و ارسال به سراسر کشور.',

  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },

  social: {
    instagram: 'https://instagram.com/sharifzin_',
    twitter: '',
  },

  contact: {
    phone: '',
    email: 'info@sharifzin.ir',
  },

  keywords: ['خرید زین موتور', 'تعویض زین موتور', 'زین موتور', 'روکش زین موتور', 'تعمیر زین موتور', 'قیمت زین موتور', 'زین‌دوزی موتور', 'زین موتور هوندا', 'زین موتور یاماها', 'زین موتور CG 125'],
};
