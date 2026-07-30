'use client';

import React from 'react';
import Link from 'next/link';
import { alpha, Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ArrowLeft3 } from 'iconsax-reactjs';

export default function CardsTitle({ id, title, subTitle, url }) {
  const theme = useTheme();

  return (
    <Box component="header" role="banner" aria-labelledby={id} sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: { xs: 3, md: 0 } }}>
      {/* Title + Subtitle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexDirection: 'row', textAlign: 'right' }}>
        <Box sx={{ display: 'block', width: '4px', height: '52px', backgroundColor: 'primary.main', borderRadius: '12px' }} />
        <Box>
          <Typography id={id} variant="h5" component="h2" color="text.primary">
            <span style={{ color: theme.palette.primary.main }}>{title.split(' ')[0] + ' '}</span>
            {title.split(' ')[1]}
          </Typography>

          <Typography variant="body1" color="text.disabled">
            {subTitle || ''}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', lg: 'flex' }, width: { xs: 0, md: '68%' }, height: '1px', backgroundColor: alpha(theme.palette.primary.main, 0.2) }} />

      {/* Button - SEO: internal link with next/link */}
      <Box>
        <Button component={Link} href={url || ''} endIcon={<ArrowLeft3 size={22} variant="Bulk" />} sx={{ ...styles.showAllButton, '& svg:first-of-type': { marginRight: '8px' }, minWidth: { md: 160 } }} aria-label={subTitle || ''}>
          مشاهده همه
        </Button>
      </Box>
    </Box>
  );
}

const styles = {
  showAllButton: {
    display: { xs: 'none', md: 'flex' },
    color: 'primary.main',
    fontSize: 17,
    borderRadius: '18px',
    padding: '12px 24px',
    textTransform: 'none',
    textAlign: 'center',
    transition: 'all 0.25s ease',
    '&:hover': {
      color: 'primary.dark',
      boxShadow: 'none',
    },
  },
};
