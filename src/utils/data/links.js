import theme from '../theme/theme';
import { TruckFast, ShieldTick, WalletMoney, Refresh2, ShoppingCart, UserOctagon, Receipt1 } from 'iconsax-reactjs';

export const links = [
  { title: 'صفحه اصلی', href: '/' },
  { title: 'محصولات', href: '/products' },
  { title: 'خدمات', href: '/services' },
  { title: 'مقاله', href: '/blog' },
  { title: 'درباره ی ما', href: '/about' },
  { title: 'سوالات متداول', href: '/faq' },
];

export const storeDetials = [
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

export const actions = [
  // TODO: Replace with instagram reels link
  { title: 'ثبت سفارش', href: 'https://instagram.com', icon: Receipt1, backgroundColor: theme.palette.primary.main },
  { title: 'سبد خرید', href: '/cart', icon: ShoppingCart, backgroundColor: theme.palette.secondary.main },
  { title: null, href: '/auth/sign-up', icon: UserOctagon, backgroundColor: theme.palette.text.primary },
];
