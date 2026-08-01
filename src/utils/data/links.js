import { TruckFast, ShieldTick, WalletMoney, Refresh2 } from 'iconsax-reactjs';

export const links = [
  { title: 'صفحه اصلی', href: '/' },
  { title: 'محصولات', href: '/products' },
  { title: 'برندها', href: '/shop' },
  { title: 'خدمات', href: '/faq' },
  { title: 'مقاله', href: '/blog' },
  { title: 'درباره ی ما', href: '/about' },
  { title: 'تماس با ما', href: '/contact' },
];

export const categories = [
  { title: 'تلفن همراه', href: '/category/mobile', src: '/assets/categories/iphone.webp' },
  { title: 'تبلت', href: '/category/tablet', src: '/assets/categories/tablet.webp' },
  { title: 'ساعت و مچ بند', href: '/category/smart-watch', src: '/assets/categories/watch.webp' },
  { title: 'ایرپاد', href: '/category/airpods', src: '/assets/categories/airpod.webp' },
  { title: 'کالای دیجیتال', href: '/category/digital-products', src: '/assets/categories/charger.webp' },
];

export const items = [
  {
    icon: TruckFast,
    title: 'تحویل اکسپرس',
    description: 'تحویل در کمتر از ۲ ساعت',
  },
  {
    icon: ShieldTick,
    title: 'ضمانت اصالت',
    description: 'تضمین اصل بودن کالا',
  },
  {
    icon: WalletMoney,
    title: 'پرداخت امن',
    description: 'درگاه پرداخت معتبر',
  },
  {
    icon: Refresh2,
    title: 'بازگشت کالا',
    description: '۷ روز ضمانت بازگشت',
  },
];
