import axiosInstance from '@/utils/API/axiosInstance';

export async function getProducts() {
  try {
    const response = await axiosInstance.get('/api/v1/products');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {}
}

export async function getCategories() {
  try {
    const response = await axiosInstance.get('/api/v1/categories');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {}
}

export function getCurrentProduct(slug) {
  return products?.filter((item) => item?.slug === slug);
}
