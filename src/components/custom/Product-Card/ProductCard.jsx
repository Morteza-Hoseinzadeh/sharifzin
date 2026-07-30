'use client';

import React, { useRef } from 'react';
import { alpha, Box, Button, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import { Category, EmptyWallet, Heart, Share, Tag, TickCircle } from 'iconsax-reactjs';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';

export default function ProductCard({ item }) {
  const imgRef = useRef(null);

  const theme = useTheme();
  const { isCooperation, loading, isLoggedIn } = useCheckUserRole();

  // Select the base price based on the user's role
  const basePrice = isCooperation ? item?.cooperation_price : item?.price;

  // Calculate the discounted price dynamically
  const finalPrice = item?.isOnSale && basePrice ? Math.round((basePrice * (1 - item.discountPercentage / 100)) / 10000) * 10000 : basePrice;

  const styles = {
    iconBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 1.5,
      borderRadius: '10px',
      cursor: 'pointer',
      transition: '0.2s',
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
    },
    discountBadge: {
      position: 'relative',
      overflow: 'hidden',
      px: 1.2,
      py: 0.4,
      bgcolor: 'error.main',
      color: '#fff',
      borderRadius: '10px',
      fontSize: '0.75rem',
      fontWeight: 600,
      '&::after': { content: '""', position: 'absolute', top: 0, left: '-80%', width: '50%', height: '100%', background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,.55) 50%, transparent 100%)', transform: 'skewX(-25deg)', animation: 'shine 1.5s infinite' },
      '@keyframes shine': { '0%': { left: '-80%' }, '100%': { left: '140%' } },
    },
  };

  const handleDetectUserProductsLike = () => {
    const likedProducts = {};
    const productIds = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('sharifzin-products-like-')) {
        likedProducts[key] = localStorage.getItem(key);

        // Extract the numeric ID correctly
        const id = key.split('-')[3];
        productIds.push(id);
      }
    }

    return productIds;
  };

  const likedIds = handleDetectUserProductsLike();

  const isProductLike = likedIds.includes(String(item?.id)) && localStorage.getItem(`sharifzin-products-like-${item?.id}`) === 'true';

  return (
    <Box sx={{ position: 'relative', width: 280, height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', p: 3, borderRadius: '32px', backgroundColor: 'background.paper', boxShadow: '0 0 50px #00000010' }}>
      <Box position={'absolute'} top={16} left={16}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={1}>
          <Tooltip title="اشتراک گذاری محصول">
            <Box sx={{ width: 45, height: 45, borderRadius: '14px', background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '.3s', '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.35)}` } }}>
              <Share size={22} color="#fff" variant="Bulk" />
            </Box>
          </Tooltip>

          {isLoggedIn && (
            <Tooltip title={isProductLike ? 'حذف از علاقه مندی ها' : 'افزودن به علاقه مندی ها'}>
              <Box sx={{ width: 45, height: 45, borderRadius: '14px', background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '.3s', '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.35)}` } }}>
                <Heart size={22} color={'white'} variant={isProductLike ? 'Bulk' : 'outlined'} />
              </Box>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box component="img" ref={imgRef} src={item?.image_url || '/placeholder.png'} alt={item?.name || 'محصول'} loading="lazy" sx={{ width: 200, height: 200, objectFit: 'contain', display: 'block' }} />

      <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" mb={1} mt={2}>
        {/* Brand */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Box color="secondary.main">
            <Tag size={22} variant="Bulk" color={theme.palette.primary.main} />
          </Box>
          <Typography variant="caption" fontWeight={600} color="primary.main">
            {item?.brand || '—'}
          </Typography>
        </Box>

        {/* Category */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Box color="secondary.main">
            <Category size={22} variant="Bulk" color={theme.palette.primary.main} />
          </Box>
          <Typography variant="caption" fontWeight={600} color="primary.main">
            {item?.category_fa || item?.category || '—'}
          </Typography>
        </Box>

        {/* Sale Status */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          {item?.stock < 0 ? (
            <>
              <Box color="error.main">
                <EmptyWallet size={22} variant="Bulk" color={theme.palette.error.main} />
              </Box>
              <Typography variant="caption" color="error.main" fontWeight={600}>
                اتمام
              </Typography>
            </>
          ) : (
            <>
              <Box color="primary.main">
                <TickCircle size={22} variant="Bulk" color={theme.palette.primary.main} />
              </Box>
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                موجود
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Box component="a" href={`/product/${item?.category}/${item?.slug}`} sx={{ color: 'text.primary', textDecoration: 'none', transition: 'all ease 0.2s', '&:hover': { color: 'primary.main' } }}>
        <Typography variant="h1" sx={{ width: 'fit-content', mt: 1, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }, fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>
          {item?.name || 'بدون نام'}
        </Typography>
      </Box>

      <Box width="100%" display="flex" flexDirection="column" alignItems="flex-start" gap={0.8} mt={2}>
        {item?.isOnSale && (
          <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection="row-reverse" width="100%">
            {loading ? (
              <Skeleton variant="rounded" width={100} height={20} />
            ) : (
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {basePrice?.toLocaleString('fa-IR')}
              </Typography>
            )}

            <Box sx={styles.discountBadge}>%{ConvertToPersianDigit(item?.discountPercentage)} تخفیف</Box>
          </Box>
        )}

        <Box width="100%" display="flex" alignItems="center" justifyContent="left" gap={0.5}>
          {loading ? (
            <Skeleton variant="rounded" width={120} height={30} />
          ) : (
            <>
              <Typography variant="h5" fontWeight={600} color="primary.main">
                {finalPrice?.toLocaleString('fa-IR')}
              </Typography>

              <img src="/assets/svg-overlays/toman-overlay.svg" width={20} height={20} alt="تومان" />
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ width: '100%', overflow: 'hidden', mt: 2, borderRadius: '24px', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            width: '100%',
            height: 58,
            borderRadius: '12px',
            fontSize: '0.90rem',
            fontWeight: '600',
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.35)}`,
            transition: '.3s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 18px 35px ${alpha(theme.palette.primary.main, 0.45)}` },
            '&::before': { content: '""', position: 'absolute', top: 0, left: '-120%', width: '70%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)', transform: 'skewX(-25deg)', animation: 'shine 2.5s infinite' },
            '@keyframes shine': { '0%': { left: '-120%' }, '100%': { left: '150%' } },
          }}
        >
          مشاهده اطلاعات محصول
        </Button>
      </Box>
    </Box>
  );
}
