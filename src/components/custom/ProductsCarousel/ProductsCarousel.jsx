'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';
import ProductsSwiper from '../ProductsSwiper.jsx/ProductsSwiper';

export default function ProductsCarousel({ categories = null, data = [], id, title, subTitle, url, hasButton = false, bgColor }) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedCategory, setSelectedCategory] = useState('مشاهده همه');

  // 🧠 Use `useMemo` to automatically recalculate when dependencies change
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (selectedCategory === 'مشاهده همه') return data;
    return data.filter((item) => item?.category?.trim() === selectedCategory?.trim());
  }, [data, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const styles = {
    button: {
      backgroundColor: 'secondary.light',
      color: 'primary.light',
      fontWeight: 700,
      borderRadius: '18px',
      padding: '12px 24px',
      textTransform: 'none',
      textAlign: 'center',
      transition: 'all 0.25s ease',
      minWidth: { md: 140 },
      whiteSpace: 'nowrap',
      flexShrink: 0,
      '&:hover': {
        color: 'primary.dark',
        boxShadow: 'none',
      },
    },
    activeButton: {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      '&:hover': {
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      },
    },
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} mb={8}>
      <CardsTitle id={id} title={title} subTitle={subTitle} url={url} />

      {/* Category Buttons */}
      {categories && (
        <Box sx={{ direction: 'rtl', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Box role="tablist" aria-label="دسته‌بندی محصولات" sx={{ display: 'flex', alignItems: 'center', py: 1, px: { xs: 0.5, sm: 1 }, gap: 2, minWidth: 'min-content' }}>
            <Button onClick={() => handleCategoryClick('مشاهده همه')} sx={{ ...styles.button, ...(selectedCategory === 'مشاهده همه' && styles.activeButton) }}>
              مشاهده همه
            </Button>

            {categories.slice(0, 8).map((cate, index) => (
              <Button key={index} onClick={() => handleCategoryClick(cate)} sx={{ ...styles.button, ...(selectedCategory === cate && styles.activeButton) }}>
                {cate}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Products (filtered dynamically) */}
      <ProductsSwiper data={filteredData} loading={false} hasButton={hasButton} bgColor={bgColor} />
    </Box>
  );
}
