import '@/utils/styles/globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientWrapper from '../ClientWrapper';
import { siteConfig } from '@/config/seo.config';
import { CartSnackbarProvider } from '@/utils/context/CartSnackbarContext';
import { dana } from '../fonts/font';

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
    default: 'سبد خرید',
    template: `%s | سبد خرید`,
  },

  description: 'سبد خرید شما در فروشگاه شریف‌زین',

  // جلوگیری از ایندکس شدن در گوگل
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },

  alternates: {
    canonical: `${siteConfig.domain}/cart`,
  },

  icons: {
    icon: siteConfig.icons.icon,
    shortcut: siteConfig.icons.icon,
    apple: siteConfig.icons.apple,
  },

  manifest: '/favicon/site.webmanifest',
};

export default function CartLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={dana.variable}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <body>
        <AppRouterCacheProvider>
          <ClientWrapper>
            <CartSnackbarProvider>{children}</CartSnackbarProvider>
          </ClientWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
