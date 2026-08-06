import '../../utils/styles/globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { siteConfig } from '@/config/seo.config';
import { dana } from '../fonts/font';
import ClientWrapper from '../ClientWrapper';

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
    default: 'خدمات تخصصی شریف‌زین | زین‌سازی و تعمیرات موتورسیکلت',
    template: `%s | خدمات شریف‌زین`,
  },

  description: 'خدمات تخصصی شریف‌زین شامل زین‌سازی سفارشی، تعمیر و بازسازی زین موتورسیکلت، تعویض فوم، دوخت حرفه‌ای و گارانتی اصالت کالا. با بیش از سال‌ها تجربه در خدمت شما هستیم.',

  keywords: ['خدمات زین‌سازی', 'تعمیر زین موتورسیکلت', 'زین‌سازی سفارشی', 'تعویض فوم زین', 'دوخت زین موتور', 'شریف‌زین خدمات', 'زین دست‌دوز', 'بازسازی زین موتورسیکلت'],

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
    canonical: `${siteConfig.domain}/services`,
    languages: {
      'fa-IR': `${siteConfig.domain}/services`,
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
    url: `${siteConfig.domain}/services`,
    siteName: siteConfig.name,
    title: 'خدمات تخصصی شریف‌زین | زین‌سازی و تعمیرات',
    description: 'زین‌سازی سفارشی، تعمیر و بازسازی زین موتورسیکلت، تعویض فوم و دوخت حرفه‌ای با گارانتی اصالت کالا.',
    images: [
      {
        url: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
        width: 1200,
        height: 630,
        alt: 'خدمات شریف‌زین',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'خدمات تخصصی شریف‌زین | زین‌سازی و تعمیرات',
    description: 'زین‌سازی سفارشی، تعمیر و بازسازی زین موتورسیکلت با کیفیت بالا و گارانتی اصالت.',
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
    sameAs: ['https://instagram.com/sharifzin_', 'https://t.me/sharifzin'],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'خدمات تخصصی زین‌سازی و تعمیرات موتورسیکلت',
    description: 'ارائه خدمات حرفه‌ای زین‌سازی سفارشی، تعمیر و بازسازی زین، تعویض فوم، دوخت تخصصی و گارانتی اصالت کالا.',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Iran',
    },
    serviceType: ['زین‌سازی سفارشی', 'تعمیر زین موتورسیکلت', 'تعویض فوم زین', 'دوخت حرفه‌ای زین', 'بازسازی زین'],
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
      </head>

      <body>
        <AppRouterCacheProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
