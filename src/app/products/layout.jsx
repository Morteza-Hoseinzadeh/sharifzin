// app/products/layout.jsx

import { siteConfig } from '@/config/seo.config';
import { getProducts } from '@/lib/api';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ClientWrapper from '../ClientWrapper';
import { CartSnackbarProvider } from '@/utils/context/CartSnackbarContext';

const getAllProducts = async () => {
  try {
    const res = await getProducts();
    return res?.data || [];
  } catch (err) {
    console.error('Failed to fetch products for /products layout metadata:', err);
    return [];
  }
};

export async function generateMetadata() {
  const url = `${siteConfig.domain}/products`;

  const pageTitle = 'خرید زین موتور اصل و دست‌دوز';
  const pageDescription = siteConfig.defaultDescription;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: siteConfig.keywords,

    alternates: { canonical: url },

    robots: { index: true, follow: true },

    // moved out of a manual <link>/<meta> in <head>
    formatDetection: { telephone: true, email: true },
    other: {
      'dns-prefetch': '//api.sharifzin.ir',
    },

    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      type: 'website',
      locale: 'fa_IR',
      images: [
        {
          url: `${siteConfig.domain}/assets/logo/sharifzin.webp`,
          width: 1200,
          height: 1200,
          alt: siteConfig.name,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`${siteConfig.domain}/assets/logo/sharifzin.webp`],
    },
  };
}

export default async function ProductsLayout({ children }) {
  const url = `${siteConfig.domain}/products`;
  const products = await getAllProducts();

  const pageTitle = 'خرید زین موتور اصل و دست‌دوز';
  const pageDescription = siteConfig.defaultDescription;

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: pageTitle,
    headline: 'خرید زین موتورسیکلت',
    description: pageDescription,
    inLanguage: 'fa-IR',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteConfig.domain}/#website`,
    },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteConfig.domain}/product/${product.slug}`,
      item: {
        '@type': 'Product',
        name: product.title,
        image: `${siteConfig.domain}${product.thumbnail}`,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'Offer',
          price: String(product.final_price ?? product.price),
          priceCurrency: 'IRR',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: siteConfig.domain },
      { '@type': 'ListItem', position: 2, name: 'محصولات', item: url },
    ],
  };

  return (
    <>
      <AppRouterCacheProvider>
        <ClientWrapper>
          <CartSnackbarProvider>{children}</CartSnackbarProvider>
        </ClientWrapper>
      </AppRouterCacheProvider>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
