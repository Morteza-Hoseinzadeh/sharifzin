'use client';

import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';

export default function HowToSubmitOrderSection() {
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <CardsTitle color={theme.palette.secondary.main} en_title={'HOW TO SUBMIT ORDER IN SHARIFZIN'} fa_title={'نحوه ثبت سفارش، در شریف‌زین'} desc={'برای ثبت سفارش در شریف‌زین می‌توانید از طریق ویدیوی زیر، آموزش را مشاهده کنید'} />
      </Grid>
      <Grid size={12}>
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden' }}>
          <iframe src="https://www.instagram.com/sharifzin_/reel/Da8XmBuxk3k/" title="آموزش نحوه ثبت سفارش در شریف‌زین" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} />
        </Box>
      </Grid>
    </Grid>
  );
}
