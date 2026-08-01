'use client';

import React from 'react';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';
import { Box, Grid } from '@mui/material';
import { products } from '@/utils/data/productsMock';
import ProductCard from '@/components/custom/Product-Card/ProductCard';

export default function ProductsCardContianer() {
  return (
    <Box>
      <CardsTitle fa_title={'محصولات پرفروش زین موتور، شریف زین'} en_title={"MOST SALE PRODUCT'S IN SHARIFZIN"} desc={'تضمین قیمت، تضمین کیفیت به همراه ماندگاری بالا'} />
      <Grid container spacing={4} mt={4}>
        {products?.map((item) => (
          <Grid key={item?.id} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <ProductCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
