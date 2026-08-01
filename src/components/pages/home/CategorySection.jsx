'use client';

import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import CategoryCard from '@/components/UI/Category/CategoryCard';
import { categories } from '@/utils/data/productsMock';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';

export default function CategorySection() {
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <CardsTitle color={theme.palette.secondary.main} en_title={'SMART CATEGORY, EASY SELECTION'} fa_title={'دسته بندی های تخصصی و متنوع، انتخاب آسان'} desc={'عرضه انواع زین های با کیفیت با بهترین قیمت'} />
      </Grid>

      {categories?.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CategoryCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
}
