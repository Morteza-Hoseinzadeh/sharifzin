'use client';

import { alpha, Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

export default function CategoryCard({ item }) {
  const theme = useTheme();
  const overlay = '/assets/svg-overlays/hero-section-left.svg';

  const { title, src, href } = item;

  const styles = {
    container: {
      display: 'block',
      cursor: 'pointer',
      textDecoration: 'none',

      '& .cards-container': {
        transition: 'all .35s ease',
      },

      '& .category-image': {
        transition: 'transform .45s ease',
      },

      '&:hover .cards-container': {
        backgroundColor: alpha(theme.palette.primary.dark, 0.15),
        transform: 'translateY(-8px)',
      },

      '&:hover .category-image': {
        transform: 'translate(-20%, -35%) scale(1.08)',
      },
    },
  };

  return (
    <Box component={'a'} href={href} sx={styles.container}>
      <Box className="cards-container" sx={{ position: 'relative', backgroundColor: alpha(theme.palette.primary.dark, 0.2), p: 2, borderRadius: '64px', mt: 8, height: 220, boxShadow: '0 -20px 30px #00000015' }}>
        <Box position={'absolute'} sx={{ transform: 'translate(-20%, -30%)' }} className="category-image">
          <Image src={src} alt={title} width={175} height={175} priority />
        </Box>
        <Box position={'absolute'} bottom={-10} left={0}>
          <img src={overlay} alt="" width={250} />
          <Box sx={{ position: 'absolute', bottom: 20, right: 65, display: 'flex', alignItems: 'center', gap: 2, pointerEvents: 'auto' }}>
            <Typography variant="body1" color="primary.main">
              محصولات {title}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
