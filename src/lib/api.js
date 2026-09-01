import axiosInstance from '@/utils/API/axiosInstance';

export async function getProducts() {
  try {
    const response = await axiosInstance.get('/api/v1/products');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getCategories() {
  try {
    const response = await axiosInstance.get('/api/v1/categories');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getBlogs() {
  try {
    const response = await axiosInstance.get('/api/v1/blogs');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentProduct(slug) {
  try {
    const response = await axiosInstance.get(`/api/v1/products/${slug}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getBlogBySlug(slug) {
  try {
    const response = await axiosInstance.get(`/api/v1/blogs/${slug}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

// گرفتن سبد
export async function getCart(cartToken) {
  const res = await axiosInstance.get('/api/v1/cart', {
    headers: {
      'x-cart-token': cartToken,
    },
  });
  return res.data;
}

// افزودن به سبد
export async function addToCart({ productId, quantity, color, cartToken }) {
  const res = await axiosInstance.post(
    '/api/v1/cart/add',
    { productId, quantity, color },
    {
      headers: {
        'x-cart-token': cartToken,
      },
    }
  );
  return res.data;
}
