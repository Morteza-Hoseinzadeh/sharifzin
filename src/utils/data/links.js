import { Home, Shop, DocumentText, MessageQuestion, Box2, UserOctagon, Mobile, Gameboy, Cpu, Headphone, Airpods, Watch, Box1, TruckFast, ShieldTick, WalletMoney, Refresh2, MonitorMobbile } from 'iconsax-reactjs';

export const links = [
  { title: 'صفحه اصلی', href: '/', hasDropdown: false },
  { title: 'محصولات', href: null, megaKey: 'products', hasDropdown: true },
  { title: 'برندها', href: '/shop', hasDropdown: false },
  { title: 'خدمات', href: '/faq', hasDropdown: false },
  { title: 'مقاله', href: '/blog', hasDropdown: false },
  { title: 'درباره ی ما', href: '/about', hasDropdown: false },
  { title: 'تماس با ما', href: '/about', hasDropdown: false },
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
