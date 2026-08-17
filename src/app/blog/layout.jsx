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
    default: 'بلاگ شریف‌زین | مقالات زین‌سازی و موتورسیکلت',
    template: `%s | بلاگ شریف‌زین`,
  },

  description: 'مقالات تخصصی درباره زین‌سازی، نگهداری زین موتورسیکلت، نکات فنی، راهنمای خرید و اخبار دنیای موتورسواری در بلاگ شریف‌زین.',

  keywords: ['بلاگ شریف‌زین', 'مقالات زین‌سازی', 'نگهداری زین موتور', 'راهنمای خرید زین', 'نکات فنی موتورسیکلت', 'مجله موتورسواری', 'آموزش زین‌سازی'],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  alternates: {
    canonical: `${siteConfig.domain}/blog`,
    languages: {
      'fa-IR': `${siteConfig.domain}/blog`,
    },
  },

  icons: {
    icon: siteConfig.icons.icon,
    shortcut: siteConfig.icons.icon,
    apple: siteConfig.icons.apple,
  },

  manifest: '/favicon/site.webmanifest',

  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: `${siteConfig.domain}/blog`,
    siteName: siteConfig.name,
    title: 'بلاگ شریف‌زین | مقالات تخصصی زین‌سازی',
    description: 'مقالات و راهنماهای تخصصی درباره زین‌سازی، نگهداری و دنیای موتورسواری.',
    images: [
      {
        url: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
        width: 1200,
        height: 630,
        alt: 'بلاگ شریف‌زین',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'بلاگ شریف‌زین | مقالات تخصصی',
    description: 'جدیدترین مقالات درباره زین‌سازی، نگهداری زین و نکات موتورسواری.',
    images: [`${siteConfig.domain}/assets/logo/sharifzin.webp`],
  },
};

export default function BlogLayout({ children }) {
  return (
    <AppRouterCacheProvider>
      <ClientWrapper>
        <CartSnackbarProvider>{children}</CartSnackbarProvider>
      </ClientWrapper>
    </AppRouterCacheProvider>
  );
}
