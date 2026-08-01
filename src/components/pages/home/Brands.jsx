'use client';

import React from 'react';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';
import { Box, useTheme } from '@mui/material';
import Image from 'next/image';
import { BrandsMock } from '@/utils/data/productsMock';

export default function Brands() {
  const theme = useTheme();

  const track = [...BrandsMock, ...BrandsMock];

  return (
    <Box component="section" sx={{ py: 6, overflow: 'hidden' }}>
      <CardsTitle en_title={'TRUSTED BRANDS, UNMATCHED QUALITY'} fa_title={'برند‌های معتبر، کیفیتی بی‌رقیب'} desc={'نمایندگی رسمی بهترین برندهای تولید زین'} />

      <Box
        role="region"
        aria-label="برندهای همکار"
        sx={{
          position: 'relative',
          mt: 2,
          overflow: 'hidden',
          '&::before, &::after': { content: '""', position: 'absolute', top: 0, bottom: 0, width: { xs: 32, md: 100 }, zIndex: 2, pointerEvents: 'none' },
        }}
      >
        <Box sx={{ display: 'flex', width: 'max-content', gap: { xs: 6, md: 8 }, animation: 'brandsScroll 28s linear infinite', willChange: 'transform', '@keyframes brandsScroll': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } }, '&:hover': { animationPlayState: 'paused' }, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
          {track.map((brand, index) => {
            const isDuplicate = index >= BrandsMock.length;

            return (
              <Box key={index} aria-hidden={isDuplicate || undefined} sx={{ flexShrink: 0, width: { xs: 120, md: 160 }, height: { xs: 80, md: 100 }, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 2px 10px rgba(0,0,0,.06)', filter: 'grayscale(1)', opacity: 0.65, transition: 'filter .3s, opacity .3s', '&:hover': { filter: 'grayscale(0)', opacity: 1 } }}>
                <Image src={brand.src} alt={isDuplicate ? '' : brand.alt} width={100} height={64} style={{ objectFit: 'contain', width: '100%', height: '75%' }} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

function alpha(hex, opacity) {
  if (hex.startsWith('rgb')) return hex;
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
