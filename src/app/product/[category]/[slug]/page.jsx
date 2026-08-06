import { cache } from 'react';
import { notFound } from 'next/navigation';

import { getCurrentProduct } from '../../../../lib/api';

import ProductView from '../../../../components/pages/current-page-product/ProductView';
import ChildrenLayout from '../../../../components/ChildrenLayout';

const getProduct = cache(async (rawName) => {
  const decodedSlug = decodeURIComponent(rawName);
  const currentProductData = await getCurrentProduct(decodedSlug);
  return currentProductData?.[0] ?? null;
});

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product?.title) notFound();

  return (
    <ChildrenLayout>
      <ProductView product={product} />;
    </ChildrenLayout>
  );
}
