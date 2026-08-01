'use client';

import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { ArrowRight2 } from 'iconsax-reactjs';

export default function CategoryCard({ item }) {
  const theme = useTheme();

  const overlay = '/assets/svg-overlays/hero-section-center.svg';

  const { title, alt, src, href = '/' } = item;

  return (
    <Box component="a" href={href} sx={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: '48px', textDecoration: 'none' }}>
      {/* Image */}
      <Box position="relative">
        <img src={src} alt={alt} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />

        <Box width={'100%'} height={125} position={'absolute'} bottom={0} sx={{ background: `linear-gradient(0deg, #000 20%, transparent 70%, transparent 100%)` }}>
          <Box mx={3} my={5}>
            <Typography variant="h6" fontWeight={600} color="primary.contrastText">
              {title}
            </Typography>
            <Typography variant="body1" color="text.disabled">
              {alt}
            </Typography>
          </Box>
        </Box>

        {/* Overlay */}
        <Box sx={{ position: 'absolute', left: -15, bottom: 22, width: 140, height: 90 }}>
          <img src={overlay} alt="" style={{ width: 125, display: 'block' }} />

          <IconButton sx={{ position: 'absolute', top: 60, left: 65, borderRadius: '16px', transform: 'translate(-50%, -50%)', width: 64, height: 64, bgcolor: 'common.white', color: 'secondary.main', '&:hover': { bgcolor: 'grey.100' } }}>
            <ArrowRight2 size={36} variant="Bulk" color={theme.palette.secondary.main} style={{ transform: 'rotate(-225deg)' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
