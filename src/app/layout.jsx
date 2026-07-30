import '@/utils/styles/globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import ClientWrapper from './ClientWrapper';

import { siteConfig } from '@/config/seo.config';

import { CartSnackbarProvider } from '@/utils/context/CartSnackbarContext';

import { dana } from './fonts/font';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#06B6D4',
};

export const metadata = {
  metadataBase: new URL(siteConfig.domain),

  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.defaultDescription,
  keywords: siteConfig.keywords,

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
    canonical: siteConfig.domain,
    languages: {
      'fa-IR': siteConfig.domain,
    },
  },

  icons: {
    icon: siteConfig.icons.icon,
    shortcut: siteConfig.icons.icon,
    apple: siteConfig.icons.apple,
  },

  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: siteConfig.domain,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [
      {
        url: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
        width: 1200,
        height: 630,
        alt: 'شریف زین',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [`${siteConfig.domain}/assets/logo/sharifzin.webp`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={dana.variable}>
      <head>
        <link rel="dns-prefetch" href="//api.sharifzin.ir" />
        <link rel="manifest" href="/public/favicon/site.webmanifest.json" />
        <meta name="format-detection" content="telephone=yes,email=yes" />
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
