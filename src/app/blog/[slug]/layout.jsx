import { siteConfig } from '@/config/seo.config';
import { getBlogBySlug } from '@/lib/api';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: currentBlogData } = await getBlogBySlug(slug);

  const pathname = currentBlogData?.post?.title;
  const title = pathname?.replaceAll('-', ' ');
  const cleanTitle = decodeURIComponent(title || '');

  if (!title) {
    return {
      title: 'مقاله یافت نشد',
      description: 'مقاله مورد نظر شما یافت نشد یا حذف شده است.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${cleanTitle}`,

    description: `مطالعه مقاله "${cleanTitle}" در بلاگ شریف زین. بررسی تخصصی موبایل، لوازم جانبی، گجت‌های هوشمند، راهنمای خرید و جدیدترین اخبار دنیای تکنولوژی.`,

    keywords: [cleanTitle, 'شریف زین', ...siteConfig.keywords],

    openGraph: {
      title: `${cleanTitle}`,
      description: `جدیدترین مقاله درباره ${cleanTitle}. بررسی تخصصی، راهنمای خرید و معرفی بهترین محصولات دیجیتال و لوازم جانبی موبایل.`,
      url: `https://sharifzin.ir/blog/${title}`,
      siteName: 'Loboshop | فروشگاه اینترنتی لوازم جانبی موبایل',
      locale: 'fa_IR',
      type: 'article',
      images: [{ url: '/assets/logo/sharifzin.webp', width: 1200, height: 630, alt: `${cleanTitle} | بلاگ شریف زین` }],
      publishedTime: '2025-01-01T00:00:00Z',
      modifiedTime: '2025-02-01T00:00:00Z',
      authors: ['تیم تولید محتوای شریف زین'],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} | Loboshop`,
      description: `مطالعه مقاله ${cleanTitle} در بلاگ شریف زین و آشنایی با جدیدترین اخبار، بررسی‌ها و راهنمای خرید محصولات دیجیتال.`,
      images: ['/assets/logo/sharifzin.webp'],
    },

    alternates: {
      canonical: `https://sharifzin.ir/blog/${title}`,
    },

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

    other: {
      'article:published_time': '2025-01-01T00:00:00Z',
      'article:modified_time': '2025-02-01T00:00:00Z',
      'article:author': 'تیم تولید محتوای شریف زین',
      'article:section': cleanTitle,
    },
  };
}

export default async function RootLayout({ params, children }) {
  const { slug } = await params;
  const { data: currentBlogData } = await getBlogBySlug(slug);

  const pathname = currentBlogData?.post?.title;
  const title = pathname?.replaceAll('-', ' ');
  const cleanTitle = decodeURIComponent(title || '');

  return (
    <>
      <AppRouterCacheProvider>{children}</AppRouterCacheProvider>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: cleanTitle,
            description: siteConfig?.defaultDescription,
            image: 'https://sharifzin.ir/assets/logo/sharifzin.webp',
            datePublished: '2025-01-01T08:00:00+03:30',
            dateModified: '2025-02-01T09:00:00+03:30',
            author: { '@type': 'Organization', name: 'تیم تولید محتوای شریف زین' },
            publisher: { '@type': 'Organization', name: 'Loboshop', logo: { '@type': 'ImageObject', url: 'https://sharifzin.ir/assets/logo/sharifzin.webp' } },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://sharifzin.ir/blog/${title}` },
            inLanguage: 'fa-IR',
          }),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: 'https://sharifzin.ir' },
              { '@type': 'ListItem', position: 2, name: 'بلاگ', item: 'https://sharifzin.ir/blog' },
              { '@type': 'ListItem', position: 3, name: cleanTitle, item: `https://sharifzin.ir/blog/${title}` },
            ],
          }),
        }}
      />
    </>
  );
}
