'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Button, IconButton, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, Minus, Trash, ShoppingCart, ArrowLeft2, TickCircle } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '22px',
  boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
  border: 'none',
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

const neoInset = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// ==================== Mock Cart Data ====================
const initialCart = [
  {
    id: 1,
    title: 'زین موتورسیکلت مدل کلاسیک',
    price: 2850000,
    quantity: 1,
    color: 'مشکی',
    thumbnail: '/assets/products/cg125/1.webp',
  },
  {
    id: 2,
    title: 'زین اسپرت دوخت لوزی',
    price: 3200000,
    quantity: 1,
    color: 'قهوه‌ای',
    thumbnail: '/assets/products/cg125/1.webp',
  },
];

// ==================== Components ====================
function QuantityControl({ value, onIncrease, onDecrease }) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton
        size="small"
        onClick={onIncrease}
        sx={{
          width: 32,
          height: 32,
          borderRadius: '10px',
          bgcolor: ACCENT_ORANGE,
          color: '#fff',
          '&:hover': { bgcolor: '#E06B10' },
        }}
      >
        <Add size={16} />
      </IconButton>

      <Box
        sx={{
          minWidth: 42,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...neoInset,
          fontWeight: 700,
          fontSize: 14,
          color: INK,
        }}
      >
        {ConvertToPersianDigit(value)}
      </Box>

      <IconButton
        size="small"
        onClick={onDecrease}
        sx={{
          width: 32,
          height: 32,
          borderRadius: '10px',
          bgcolor: ACCENT_ORANGE,
          color: '#fff',
          '&:hover': { bgcolor: '#E06B10' },
        }}
      >
        <Minus size={16} />
      </IconButton>
    </Stack>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <Box sx={{ ...neoSoft, p: 2.5 }}>
      <Stack direction="row" gap={2} alignItems="center">
        {/* Image */}
        <Box sx={{ width: 90, height: 90, borderRadius: '14px', bgcolor: alpha(ACCENT_ORANGE, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...neoInset }}>
          {item.thumbnail && <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />}
          <ShoppingCart size={28} color={alpha(ACCENT_ORANGE, 0.4)} />
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: INK, mb: 0.6, lineHeight: 1.4 }}>{item.title}</Typography>
          <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 1.5 }}>رنگ دوخت: {item.color}</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={1.5}>
            <QuantityControl value={item.quantity} onIncrease={() => onIncrease(item.id)} onDecrease={() => onDecrease(item.id)} />

            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>
                {ConvertToPersianDigit((item.price * item.quantity).toLocaleString())}
                <Typography component="span" sx={{ fontSize: 12, color: INK_SOFT, mr: 0.5 }}>
                  تومان
                </Typography>
              </Typography>

              <IconButton
                size="small"
                onClick={() => onRemove(item.id)}
                sx={{
                  color: '#E53E3E',
                  '&:hover': { bgcolor: alpha('#E53E3E', 0.08) },
                }}
              >
                <Trash size={18} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function CartPage() {
  const [cart, setCart] = useState(initialCart);

  const increaseQty = (id) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQty = (id) => {
    setCart((prev) => prev.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)));
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Empty State
  if (cart.length === 0) {
    return (
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="sm">
          <Box sx={{ ...neoRaised, p: 5, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                background: SURFACE,
                boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`,
                color: INK_SOFT,
              }}
            >
              <ShoppingCart size={36} />
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: 18, color: INK, mb: 1.5 }}>سبد خرید شما خالی است</Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT, mb: 3.5 }}>هنوز محصولی به سبد خرید اضافه نکرده‌اید.</Typography>

            <Button
              component={Link}
              href="/products"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: 14.5,
                color: '#fff',
                bgcolor: ACCENT_ORANGE,
                boxShadow: `6px 6px 14px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                '&:hover': { bgcolor: '#E06B10' },
              }}
            >
              مشاهده محصولات
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK }}>سبد خرید</Typography>
          <Typography sx={{ fontSize: 14, color: INK_SOFT }}>{ConvertToPersianDigit(totalItems)} کالا</Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack gap={2}>
              {cart.map((item) => (
                <CartItem key={item.id} item={item} onIncrease={increaseQty} onDecrease={decreaseQty} onRemove={removeItem} />
              ))}
            </Stack>
          </Grid>

          {/* Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ ...neoRaised, p: 3, position: 'sticky', top: 24 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>خلاصه سفارش</Typography>

              <Stack gap={1.8} sx={{ mb: 2.5 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>جمع کل کالاها</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{ConvertToPersianDigit(totalPrice.toLocaleString())} تومان</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>هزینه ارسال</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_ORANGE }}>رایگان</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ borderColor: alpha(INK, 0.08), mb: 2.5 }} />

              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: INK }}>مبلغ قابل پرداخت</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: INK }}>
                  {ConvertToPersianDigit(totalPrice.toLocaleString())}
                  <Typography component="span" sx={{ fontSize: 12, color: INK_SOFT, mr: 0.5 }}>
                    تومان
                  </Typography>
                </Typography>
              </Stack>

              <Button
                fullWidth
                sx={{
                  py: 1.7,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#fff',
                  bgcolor: ACCENT_ORANGE,
                  boxShadow: `6px 6px 14px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                  mb: 1.5,
                  '&:hover': { bgcolor: '#E06B10' },
                }}
              >
                ادامه فرآیند خرید
              </Button>

              <Button
                component={Link}
                href="/products"
                fullWidth
                sx={{
                  py: 1.4,
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: INK,
                  ...neoSoft,
                  '&:hover': {
                    boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                  },
                }}
              >
                بازگشت به فروشگاه
              </Button>

              {/* Trust badges */}
              <Stack gap={1.2} sx={{ mt: 3 }}>
                {['پرداخت امن', 'گارانتی اصالت کالا', 'ارسال سریع'].map((text) => (
                  <Stack key={text} direction="row" alignItems="center" gap={1}>
                    <TickCircle size={16} variant="Bold" color={ACCENT_ORANGE} />
                    <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ChildrenLayout>
  );
}
