'use client';

import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { ArrowDown2 } from 'iconsax-reactjs';

export default function CategoryCard({ item }) {
  const theme = useTheme();

  const { slug, name_fa, src, description_fa } = item;
  const href = `/products?category=${slug}`;

  return (
    <Box component="a" href={href} sx={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: '48px', textDecoration: 'none' }}>
      {/* Image */}
      <Box position="relative">
        <img src={src} alt={name_fa} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />

        <Box width={'100%'} height={125} position={'absolute'} bottom={0} sx={{ background: `linear-gradient(0deg, #000 20%, transparent 70%, transparent 100%)` }}>
          <Box m={4}>
            <Typography variant="h6" fontWeight={600} color="primary.contrastText">
              {name_fa}
            </Typography>
            <Typography variant="body1" color="text.disabled" sx={{ maxWidth: '80%' }}>
              {description_fa}
            </Typography>
          </Box>
        </Box>

        {/* Overlay */}
        <Box sx={{ position: 'absolute', left: -15, bottom: 22, width: 140, height: 90 }}>
          <IconButton sx={{ position: 'absolute', top: 60, left: 65, p: 1.5, borderRadius: '16px', transform: 'translate(-50%, -50%)', bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>
            <ArrowDown2 size={36} variant="Bulk" color={theme.palette.primary.contrastText} style={{ transform: 'rotate(45deg)' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
