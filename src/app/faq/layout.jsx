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
    default: 'سوالات متداول',
    template: `%s | سوالات متداول شریف‌زین`,
  },

  description: 'پاسخ به سوالات متداول درباره زین‌سازی، گارانتی، نحوه سفارش، زمان تحویل، مرجوعی کالا و خدمات تخصصی شریف‌زین.',

  keywords: ['سوالات متداول شریف‌زین', 'پرسش و پاسخ زین موتور', 'گارانتی زین', 'نحوه سفارش زین', 'زمان تحویل زین', 'مرجوعی کالا شریف‌زین', 'FAQ شریف‌زین'],

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
    canonical: `${siteConfig.domain}/faq`,
    languages: {
      'fa-IR': `${siteConfig.domain}/faq`,
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
    url: `${siteConfig.domain}/faq`,
    siteName: siteConfig.name,
    title: 'سوالات متداول',
    description: 'پاسخ به رایج‌ترین سوالات درباره محصولات، خدمات، گارانتی و نحوه سفارش در شریف‌زین.',
    images: [
      {
        url: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
        width: 1200,
        height: 630,
        alt: 'سوالات متداول شریف‌زین',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'سوالات متداول',
    description: 'پاسخ به سوالات متداول درباره زین‌سازی، گارانتی، سفارش و خدمات شریف‌زین.',
    images: [`${siteConfig.domain}/assets/logo/sharifzin.webp`],
  },
};

export default function FaqLayout({ children }) {
  return (
    <AppRouterCacheProvider>
      <ClientWrapper>
        <CartSnackbarProvider>{children}</CartSnackbarProvider>
      </ClientWrapper>
    </AppRouterCacheProvider>
  );
}
