import '@/utils/styles/globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientWrapper from '../../app/ClientWrapper';
import { siteConfig } from '@/config/seo.config';
import { CartSnackbarProvider } from '@/utils/context/CartSnackbarContext';
import { dana } from '../../app/fonts/font';

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
    default: 'پنل کاربری',
    template: `%s | پنل کاربری`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: siteConfig.icons.icon,
    shortcut: siteConfig.icons.icon,
    apple: siteConfig.icons.apple,
  },
  manifest: '/favicon/site.webmanifest',
};

export default function UserLayout({ children }) {
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
