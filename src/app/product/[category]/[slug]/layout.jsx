import { cache } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientWrapper from '@/app/ClientWrapper';
import { getCurrentProduct } from '@/lib/api';

const SITE_NAME = 'خرید و تعویض زین موتور';
const SITE_URL = 'https://sharifzin.ir';

// Dedupe the fetch across generateMetadata + the layout — React's cache()
// makes sure getCurrentProduct only runs once per request instead of twice.
const getProduct = cache(async (rawName) => {
  const decodedSlug = decodeURIComponent(rawName);
  const currentProductData = await getCurrentProduct(decodedSlug);
  return currentProductData?.[0] ?? null;
});

export async function generateMetadata({ params }) {
  const { category, slug } = await params;

  const product = await getProduct(slug);

  if (!product?.slug) {
    return {
      title: 'محصول یافت نشد',
      description: 'متأسفیم، محصول مورد نظر شما یافت نشد.',
      robots: { index: false, follow: false },
    };
  }

  const decodedCategory = decodeURIComponent(category);
  const url = `${SITE_URL}/product/${decodedCategory?.toLowerCase()}/${slug?.toLowerCase() || ''}`;

  const pageTitle = `${product?.title} - خرید و قیمت`;
  const pageDescription = `خرید ${product?.title} با بهترین قیمت، تضمین اصالت، ارسال سریع و گارانتی معتبر از ${SITE_NAME}.${product?.description ? ` ${product?.description.slice(0, 150)}...` : ''}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [product?.title, product?.brand, product?.category, `خرید ${product?.title}`, `قیمت ${product?.title}`, `${product?.title} اصل`, `${product?.title} اورجینال`, 'شریف زین', 'فروشگاه زین موتور'],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      images: [
        {
          url: product?.image_url || '',
          width: 1200,
          height: 1200,
          alt: product?.title,
        },
      ],
      type: 'website',
      locale: 'fa_IR',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [product?.image_url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProductDetailLayout({ params, children }) {
  const { category, name } = await params;
  const product = getProduct(name);

  if (!product) {
    return <>{children}</>;
  }

  const decodedCategory = decodeURIComponent(category);
  const url = `${SITE_URL}/product/${decodedCategory?.toLowerCase()}/${name?.toLowerCase() || ''}`;

  const cleanCategory = product?.category;
  const cleanProductName = product?.title;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.title,
    image: product?.image_url ? [product?.image_url] : [],
    description: product?.description,
    sku: product?.id,
    mpn: product?.id,
    category: product?.category,
    brand: {
      '@type': 'Brand',
      name: product?.brand || SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'IRR',
      price: String(product?.discountedPrice ?? product?.price),
      availability: product?.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'فروشگاه', item: `${SITE_URL}/shop` },
      { '@type': 'ListItem', position: 3, name: cleanCategory, item: `${SITE_URL}/categories/${product?.category}` },
      { '@type': 'ListItem', position: 4, name: cleanProductName, item: url },
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo/sharifzin.webp`,
    sameAs: ['https://instagram.com/sharifzin_', 'https://t.me/sharifzin'],
  };

  return (
    <>
      <AppRouterCacheProvider>
        <ClientWrapper>{children}</ClientWrapper>
      </AppRouterCacheProvider>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    </>
  );
}
