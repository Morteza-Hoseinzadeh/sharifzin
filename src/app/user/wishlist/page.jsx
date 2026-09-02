'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Grid, Button, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Heart, ArrowLeft2, ShoppingCart, Trash, Bag2 } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';

const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };

function WishlistCard({ item, onRemove }) {
  const { user } = useCheckUserRole();

  const [isRemoving, setIsRemoving] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await axiosInstance.delete('/api/v1/user/wishlist', {
        data: { productId: item.id, userId: user?.id },
      });
      onRemove(item.id);
    } catch (err) {
      alert('خطا در حذف از علاقه‌مندی‌ها');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/v1/cart/add', {
        productId: item.id,
        quantity: 1,
      });
      alert('به سبد خرید اضافه شد!');
    } catch (err) {
      alert('خطا در افزودن به سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ...neoSoft, p: 2, height: '100%' }}>
      <Stack gap={1.8}>
        {item.thumbnail ? (
          <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
        ) : (
          <Box sx={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '14px', bgcolor: alpha(INK, 0.04), display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK_SOFT, position: 'relative', overflow: 'hidden' }}>
            <Bag2 size={40} variant="Bold" />
          </Box>
        )}

        <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK, mb: 0.8, lineHeight: 1.5 }}>{item.title}</Typography>

        <Stack direction="row" alignItems="baseline" gap={1} sx={{ mb: 1.5 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: INK }}>{ConvertToPersianDigit(item.price)} تومان</Typography>
        </Stack>

        <Stack direction="row" gap={1}>
          <Button
            fullWidth
            onClick={handleAddToCart}
            disabled={loading}
            startIcon={<ShoppingCart size={16} style={{ marginLeft: '8px' }} />}
            sx={{
              py: 1.1,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: 13,
              color: '#fff',
              bgcolor: ACCENT_ORANGE,
              boxShadow: `4px 4px 10px ${alpha(ACCENT_ORANGE, 0.3)}`,
            }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : 'افزودن به سبد'}
          </Button>

          <IconButton
            onClick={handleRemove}
            disabled={isRemoving}
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              color: '#E53E3E',
              ...neoSoft,
            }}
          >
            {isRemoving ? <CircularProgress size={18} color="inherit" /> : <Trash size={18} />}
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function WishlistPage() {
  const { user, loading: checkUserRoleLoading } = useCheckUserRole();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/v1/user/wishlist?id=${user?.id}`);
      setWishlist(data.data || []);
    } catch (err) {
      setError('خطا در دریافت علاقه‌مندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [checkUserRoleLoading]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box sx={{ width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#E53E3E', 0.12), color: '#E53E3E' }}>
                  <Heart size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>علاقه‌مندی‌ها</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>{loading ? '...' : `${ConvertToPersianDigit(wishlist.length)} محصول`}</Typography>
                </Box>
              </Stack>

              <Button component={Link} href="/user/dashboard" endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />} sx={{ px: 2, py: 1, borderRadius: '12px', fontWeight: 600, fontSize: 13, color: INK, ...neoSoft }}>
                بازگشت
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : wishlist.length === 0 ? (
            <Box sx={{ ...neoRaised, p: 6, textAlign: 'center' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(INK_SOFT, 0.1), color: INK_SOFT, mx: 'auto', mb: 2.5 }}>
                <Heart size={36} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>لیست علاقه‌مندی خالی است</Typography>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 1, mb: 3 }}>محصولات مورد علاقه خود را اینجا ذخیره کنید</Typography>
              <Button component={Link} href="/" sx={{ px: 3, py: 1.3, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}` }}>
                مشاهده محصولات
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {wishlist.map((item) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                  <WishlistCard item={item} onRemove={handleRemove} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
