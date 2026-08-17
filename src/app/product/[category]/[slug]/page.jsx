import { getCurrentProduct } from '../../../../lib/api';

import ProductView from '../../../../components/pages/current-page-product/ProductView';
import ChildrenLayout from '../../../../components/ChildrenLayout';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getCurrentProduct(slug);

  console.log(product)

  return (
    <ChildrenLayout>
      <ProductView product={product?.data[0]} />;
    </ChildrenLayout>
  );
}
