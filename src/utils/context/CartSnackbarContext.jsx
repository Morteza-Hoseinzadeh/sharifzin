'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { addToCart as apiAddToCart, getCart as apiGetCart } from '@/lib/api';

const CartContext = createContext(null);

// گرفتن یا ساختن cartToken
function getOrCreateCartToken() {
  if (typeof window === 'undefined') return null;

  let token = localStorage.getItem('cartToken');

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('cartToken', token);
  }

  return token;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartToken, setCartToken] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // بارگذاری اولیه سبد
  useEffect(() => {
    const token = getOrCreateCartToken();
    setCartToken(token);

    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await apiGetCart(token);

        if (response?.cartToken) {
          localStorage.setItem('cartToken', response.cartToken);
          setCartToken(response.cartToken);
        }

        setCartItems(response?.items || []);
      } catch (err) {
        console.error('Fetch cart error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchCart();
  }, []);

  /**
   * افزودن محصول به سبد
   */
  const handleAddToCart = useCallback(
    async ({ productId, quantity = 1, color = null, product = null }) => {
      try {
        setIsAdding(true);
        setError(null);

        const token = cartToken || getOrCreateCartToken();

        const response = await apiAddToCart({
          productId,
          quantity,
          color,
          cartToken: token,
        });

        // به‌روزرسانی توکن اگر سرور یکی جدید داده باشد
        if (response?.cartToken) {
          localStorage.setItem('cartToken', response.cartToken);
          setCartToken(response.cartToken);
        }

        // به‌روزرسانی لیست آیتم‌ها از پاسخ سرور
        if (response?.items) {
          setCartItems(response.items);
        } else {
          // fallback optimistic
          setCartItems((previousItems) => {
            const existingIndex = previousItems.findIndex((item) => String(item.product_id || item.productId) === String(productId) && String(item.color ?? '') === String(color ?? ''));

            if (existingIndex !== -1) {
              const updated = [...previousItems];
              updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: Number(updated[existingIndex].quantity || 0) + Number(quantity),
              };
              return updated;
            }

            return [...previousItems, { productId, quantity, color, product }];
          });
        }

        return { success: true, data: response };
      } catch (err) {
        console.error('Add to cart error:', err);

        const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'افزودن محصول به سبد خرید انجام نشد.';

        setError(message);
        return { success: false, error: message };
      } finally {
        setIsAdding(false);
      }
    },
    [cartToken]
  );

  const removeLocalItem = useCallback((productId, color = null) => {
    setCartItems((previousItems) => previousItems.filter((item) => !(String(item.product_id || item.productId) === String(productId) && String(item.color ?? '') === String(color ?? ''))));
  }, []);

  const clearLocalCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0), [cartItems]);

  const cartProductsCount = useMemo(() => cartItems.length, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartProductsCount,
      cartToken,
      isAdding,
      isLoading,
      error,
      addToCart: handleAddToCart,
      removeLocalItem,
      clearLocalCart,
      setError,
      setCartItems,
    }),
    [cartItems, cartCount, cartProductsCount, cartToken, isAdding, isLoading, error, handleAddToCart, removeLocalItem, clearLocalCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside <CartProvider />');
  }

  return context;
}
