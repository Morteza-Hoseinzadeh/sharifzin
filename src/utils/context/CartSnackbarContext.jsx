// src/utils/context/CartSnackbarContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

// Removed unused imports: Button, Typography, Box, Tooltip, IconButton, ShoppingCart
import { Snackbar, Alert, Box, Tooltip, IconButton, Typography } from '@mui/material';

// Icons
import { ShoppingCart } from 'iconsax-reactjs';

// Utils
import axiosInstance from '@/utils/API/axiosInstance';

const CartSnackbarContext = createContext(undefined);

export function CartSnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  /**
   * Handles adding an item to the shopping cart.
   * It ensures a cart exists (initializing if necessary) and then adds the item.
   * Updates snackbar state to provide user feedback on the process.
   * @param {object} item - The item to add to the cart. Expected to have at least an 'id'.
   */

  const showAddToCartSnackbar = async (item) => {
    setOpen(true);
    setCurrentItemId(item?.id);
    setSnackbarMessage('در حال افزودن به سبد خرید...');
    setSnackbarSeverity('success');

    let cart_uuid = localStorage.getItem('sharifzin_cart_uuid');

    try {
      if (!cart_uuid) {
        const { user } = JSON.parse(localStorage.getItem('sharifzin_auth_token') || '{}');
        const initResponse = await axiosInstance.post('/api/cart/init', { user_id: user?.id || null });

        if (initResponse.data?.cart_uuid) {
          cart_uuid = initResponse.data.cart_uuid;
          localStorage.setItem('sharifzin_cart_uuid', cart_uuid);
        } else {
          throw new Error('Failed to initialize cart');
        }
      }

      const addResponse = await axiosInstance.post('/api/cart/add', { cart_uuid, product_id: item.id, quantity: item.quantity || 1, color: item.color, price: item.price, image_url: item.image_url });

      if (addResponse.status >= 200 && addResponse.status < 300) {
        setSnackbarMessage('محصول با موفقیت به سبد خرید اضافه شد');
        setSnackbarSeverity('success');
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setSnackbarMessage('خطا در افزودن محصول به سبد خرید');
      setSnackbarSeverity('error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Clear message and item ID when closing to avoid showing old messages
    setSnackbarMessage('');
    setCurrentItemId(null);
  };

  const handleNavigate = () => {
    window.location.href = '/cart';
    handleClose();
  };

  // Determine if the snackbar should show the "View Cart" button
  // For now, we'll show it on success, but could be extended
  const showViewCartButton = snackbarSeverity === 'success' && open && currentItemId;

  return (
    <CartSnackbarContext.Provider value={{ showAddToCartSnackbar }}>
      {children}
      <Snackbar open={open} autoHideDuration={snackbarSeverity === 'error' ? null : 4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} sx={{ zIndex: 2000 }}>
        <Alert onClose={handleClose} variant="filled" icon={false} severity={snackbarSeverity} sx={{ backgroundColor: snackbarSeverity === 'success' ? 'success.main' : 'error.main', color: '#ffffff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', fontWeight: 500, fontSize: { xs: '0.875rem', md: '1.05rem' }, padding: { xs: '8px 12px', md: '8px 16px' }, alignItems: 'center', minWidth: { xs: 'unset', md: 340 }, '& .MuiAlert-action': { padding: 0, marginRight: 0 } }}>
          <Box display="flex" alignItems="center" gap={{ xs: 1.5, md: 2 }} sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              {snackbarMessage} {/* Display dynamic message */}
            </Typography>

            {/* Show "View Cart" button only on success and when an item was actually processed */}
            {showViewCartButton && (
              <Tooltip title="مشاهده سبد خرید" arrow placement="top">
                <IconButton size="small" onClick={handleNavigate} aria-label="مشاهده سبد خرید" sx={{ backgroundColor: snackbarSeverity === 'success' ? 'success.light' : 'error.light', p: '12px', borderRadius: '12px', color: '#ffffff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
                  <ShoppingCart size={20} variant="Bulk" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Alert>
      </Snackbar>
    </CartSnackbarContext.Provider>
  );
}

export const useCartSnackbar = () => {
  const context = useContext(CartSnackbarContext);
  if (!context) {
    throw new Error('useCartSnackbar must be used within a CartSnackbarProvider');
  }
  return context;
};
