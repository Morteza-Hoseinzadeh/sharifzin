import '@/utils/styles/globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import ClientWrapper from './ClientWrapper';

import { siteConfig } from '@/config/seo.config';

import { CartSnackbarProvider } from '@/utils/context/CartSnackbarContext';

import { dana } from './fonts/font';

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

  manifest: '/favicon/site.webmanifest',

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
        alt: 'شریف‌زین',
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
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
    sameAs: ['https://instagram.com/sharifzin', 'https://t.me/sharifzin'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.domain,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.domain}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="fa" dir="rtl" className={dana.variable}>
      <head>
        <link rel="dns-prefetch" href="//api.sharifzin.ir" />
        <meta name="format-detection" content="telephone=yes,email=yes" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
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
