import '@/utils/styles/globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientWrapper from '@/app/ClientWrapper';
import { siteConfig } from '@/config/seo.config';
import { dana } from '@/app/fonts/font';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#EEEEEE',
};

export const metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: 'پیگیری سفارش',
    template: '%s',
  },
  description: 'پیگیری وضعیت سفارش در فروشگاه شریف‌زین',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: siteConfig.icons.icon,
    shortcut: siteConfig.icons.icon,
    apple: siteConfig.icons.apple,
  },
};

export default function OrdersLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={dana.variable}>
      <body>
        <AppRouterCacheProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
