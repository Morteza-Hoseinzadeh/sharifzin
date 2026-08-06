'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Grid, Button, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Heart, ArrowLeft2, ShoppingCart, Trash, Bag2 } from 'iconsax-reactjs';
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

// ==================== Mock Data ====================
const initialWishlist = [
  {
    id: 1,
    title: 'زین موتورسیکلت مدل کلاسیک',
    price: 2850000,
    oldPrice: 3200000,
    thumbnail: '/assets/products/cg125/1.webp',
    inStock: true,
  },
  {
    id: 2,
    title: 'زین اسپرت دوخت لوزی',
    price: 3200000,
    oldPrice: null,
    thumbnail: '/assets/products/cg125/1.webp',
    inStock: true,
  },
  {
    id: 3,
    title: 'رویه زین چرم طبیعی',
    price: 980000,
    oldPrice: 1150000,
    thumbnail: '/assets/products/cg125/1.webp',
    inStock: false,
  },
  {
    id: 4,
    title: 'زین آفرود تقویت‌شده',
    price: 4100000,
    oldPrice: null,
    thumbnail: '/assets/products/cg125/1.webp',
    inStock: true,
  },
  {
    id: 5,
    title: 'کاور زین ضد آب حرفه‌ای',
    price: 450000,
    oldPrice: 520000,
    thumbnail: '/assets/products/cg125/1.webp',
    inStock: true,
  },
];

// ==================== Components ====================
function WishlistCard({ item, onRemove, onAddToCart }) {
  return (
    <Box sx={{ ...neoSoft, p: 2, height: '100%' }}>
      <Stack gap={1.8}>
        {/* Image Placeholder */}
        {item.thumbnail && item?.inStock ? (
          <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
        ) : (
          <Box sx={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '14px', bgcolor: alpha(INK, 0.04), display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK_SOFT, position: 'relative', overflow: 'hidden' }}>
            <Bag2 size={40} variant="Bold" />
            {!item.inStock && (
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: alpha('#000', 0.45), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 13, bgcolor: alpha('#E53E3E', 0.9), px: 1.5, py: 0.5, borderRadius: '8px' }}>ناموجود</Typography>
              </Box>
            )}
          </Box>
        )}

        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK, mb: 0.8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>

          <Stack direction="row" alignItems="baseline" gap={1} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: INK }}>
              {ConvertToPersianDigit(item.price.toLocaleString())}
              <Typography component="span" sx={{ fontSize: 11, color: INK_SOFT, mr: 0.3 }}>
                تومان
              </Typography>
            </Typography>
            {item.oldPrice && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, textDecoration: 'line-through' }}>{ConvertToPersianDigit(item.oldPrice.toLocaleString())}</Typography>}
          </Stack>
        </Box>

        <Stack direction="row" gap={1}>
          <Button
            fullWidth
            disabled={!item.inStock}
            startIcon={<ShoppingCart size={16} style={{ marginLeft: '8px' }} />}
            onClick={() => onAddToCart(item.id)}
            sx={{
              py: 1.1,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: 13,
              color: item.inStock ? '#fff' : INK_SOFT,
              bgcolor: item.inStock ? ACCENT_ORANGE : alpha(INK, 0.08),
              boxShadow: item.inStock ? `4px 4px 10px ${alpha(ACCENT_ORANGE, 0.3)}` : 'none',
              '&:hover': {
                bgcolor: item.inStock ? '#E06B10' : alpha(INK, 0.08),
              },
              '&.Mui-disabled': {
                color: INK_SOFT,
              },
            }}
          >
            افزودن به سبد
          </Button>
          <IconButton
            onClick={() => onRemove(item.id)}
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              color: '#E53E3E',
              ...neoSoft,
              boxShadow: `3px 3px 8px ${SHADOW_DARK}, -3px -3px 8px ${SHADOW_LIGHT}`,
              flexShrink: 0,
            }}
          >
            <Trash size={18} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (id) => {
    // TODO: add to cart logic
    console.log('Add to cart:', id);
  };

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Box width="100%">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha('#E53E3E', 0.12),
                    color: '#E53E3E',
                  }}
                >
                  <Heart size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>علاقه‌مندی‌ها</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>{ConvertToPersianDigit(wishlist.length)} محصول</Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                href="/user/dashboard"
                endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: 13,
                  color: INK,
                  ...neoSoft,
                }}
              >
                بازگشت
              </Button>
            </Stack>
          </Box>

          {/* Wishlist Grid */}
          {wishlist.length === 0 ? (
            <Box sx={{ ...neoRaised, p: 6, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(INK_SOFT, 0.1),
                  color: INK_SOFT,
                  mx: 'auto',
                  mb: 2.5,
                }}
              >
                <Heart size={36} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>لیست علاقه‌مندی خالی است</Typography>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 1, mb: 3 }}>محصولات مورد علاقه خود را اینجا ذخیره کنید</Typography>
              <Button
                component={Link}
                href="/"
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#fff',
                  bgcolor: ACCENT_ORANGE,
                  boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
                  '&:hover': { bgcolor: '#E06B10' },
                }}
              >
                مشاهده محصولات
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {wishlist.map((item) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                  <WishlistCard item={item} onRemove={handleRemove} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
