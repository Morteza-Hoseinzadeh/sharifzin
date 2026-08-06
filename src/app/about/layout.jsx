import '../../utils/styles/globals.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientWrapper from '../ClientWrapper';
import { siteConfig } from '@/config/seo.config';
import { CartSnackbarProvider } from '../../utils/context/CartSnackbarContext';
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
    default: 'درباره ما - داستان، ارزش‌ها و تیم ما',
    template: `%s | درباره شریف‌زین`,
  },

  description: 'با داستان شریف‌زین، ارزش‌ها، تجربه بیش از ۱۰ ساله و تیم متخصص ما آشنا شوید. زین‌سازی تخصصی موتورسیکلت با تضمین اصالت و کیفیت.',

  keywords: ['درباره شریف‌زین', 'داستان شریف‌زین', 'تیم شریف‌زین', 'زین‌سازی تخصصی', 'کارگاه زین‌سازی', 'تجربه زین‌سازی', 'شریف‌زین تهران'],

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
    canonical: `${siteConfig.domain}/about-us`,
    languages: {
      'fa-IR': `${siteConfig.domain}/about-us`,
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
    url: `${siteConfig.domain}/about-us`,
    siteName: siteConfig.name,
    title: 'درباره ما',
    description: 'داستان شکل‌گیری شریف‌زین، ارزش‌ها و بیش از ۱۰ سال تجربه در زین‌سازی تخصصی موتورسیکلت.',
    images: [
      {
        url: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
        width: 1200,
        height: 630,
        alt: 'درباره شریف‌زین',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'درباره ما',
    description: 'با داستان، ارزش‌ها و تیم متخصص شریف‌زین آشنا شوید. بیش از ۱۰ سال تجربه در زین‌سازی تخصصی.',
    images: [`${siteConfig.domain}/assets/logo/sharifzin.webp`],
  },
};

export default function AboutUsLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
    description: 'شریف‌زین، متخصص زین‌سازی و تعمیرات حرفه‌ای موتورسیکلت با بیش از ۱۰ سال تجربه.',
    foundingDate: '2013',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressLocality: 'تهران',
      streetAddress: 'میدان رازی (گمرک)، خیابان مولوی، رو به روی پاساژ بهمن، کوچه خسجته، پلاک ۶، طبقه بالا',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-910-194-1207',
      contactType: 'customer service',
      availableLanguage: 'Persian',
    },
    sameAs: ['https://instagram.com/sharifzin_', 'https://t.me/sharifzin'],
  };

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'درباره شریف‌زین',
    description: 'صفحه درباره ما شریف‌زین؛ داستان شکل‌گیری، ارزش‌ها، آمار و مسیر پیشرفت مجموعه.',
    url: `${siteConfig.domain}/about-us`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
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
