import { products } from '@/utils/data/productsMock';

export function getProducts() {
  return products;
}

export function getCategories() {
  return products;
}

export function getCurrentProduct(slug) {
  return products?.filter((item) => item?.slug === slug);
}
