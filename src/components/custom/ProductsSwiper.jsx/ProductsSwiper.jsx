'use client';

import React from 'react';
import { Box, IconButton, Skeleton, useTheme } from '@mui/material';
import { ArrowSquareLeft, ArrowSquareRight } from 'iconsax-reactjs';
import ProductCard from '../Product-Card/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

export default function ProductsSwiper({ data = [], loading = false, hasButton = false, bgColor }) {
  const theme = useTheme();

  const styles = {
    mainContainer: {
      direction: 'rtl',
    },

    sliderWrapper: {
      mt: 2,
      p: { xs: 1.5, md: 2 },
      backgroundColor: bgColor,
      borderRadius: '32px',
      overflow: 'hidden',
      position: 'relative',
      '& .swiper': {
        overflow: 'visible !important',
      },
    },

    swiperPrev: {
      position: 'absolute',
      right: { xs: 8, md: 12 }, // right side = next in RTL
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 12,
      bgcolor: 'primary.main',
      '&:hover': {
        bgcolor: 'primary.dark',
        transform: 'translateY(-50%) scale(1.1)',
      },
      transition: 'all 0.2s',
    },

    swiperNext: {
      position: 'absolute',
      left: { xs: 8, md: 12 }, // left side = prev
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 12,
      bgcolor: 'primary.main',
      '&:hover': {
        bgcolor: 'primary.dark',
        transform: 'translateY(-50%) scale(1.1)',
      },
      transition: 'all 0.2s',
    },
  };

  if (loading) {
    return (
      <Box sx={styles.mainContainer}>
        <Box sx={styles.sliderWrapper}>
          <Box sx={{ display: 'flex', gap: 2, px: 2, direction: 'rtl' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ flex: '0 0 280px' }}>
                <Skeleton variant="rectangular" width={280} height={420} sx={{ borderRadius: 3 }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  if (!data?.length) return null;

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.sliderWrapper}>
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={false}
          speed={600}
          direction="horizontal"
          dir="rtl"
          navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
          breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 }, 1200: { slidesPerView: 3 }, 1400: { slidesPerView: 5 } }}
          observer={true}
          observeParents={true}
          observeSlideChildren={true}
          style={{ direction: 'rtl', overflow: 'visible' }}
        >
          {data.map((product, index) => (
            <SwiperSlide key={index}>
              <Box width={'100%'} component="ul" role="list" aria-label="دسته بندی محصولات در فروشگاه شریف زین" sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2, overflowX: 'auto', pb: 2, WebkitOverflowScrolling: 'touch' }}>
                <Box component="li" role="listitem" sx={{ listStyle: 'none', flexShrink: 0 }}>
                  <ProductCard item={product} hasButton={hasButton} />
                </Box>
              </Box>
            </SwiperSlide>
          ))}

          {/* Custom navigation – icons are correct for RTL */}
          <IconButton aria-label="اسلاید بعدی" className="swiper-button-next" sx={styles.swiperNext}>
            <ArrowSquareLeft variant="Bulk" color={theme.palette.primary.light} size={32} />
          </IconButton>

          <IconButton aria-label="اسلاید قبلی" className="swiper-button-prev" sx={styles.swiperPrev}>
            <ArrowSquareRight variant="Bulk" color={theme.palette.primary.light} size={32} />
          </IconButton>
        </Swiper>
      </Box>
    </Box>
  );
}
