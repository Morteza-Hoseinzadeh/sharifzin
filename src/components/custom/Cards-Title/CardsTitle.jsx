'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export default function CardsTitle({ en_title, fa_title, desc, color }) {
  const theme = useTheme();

  const txt1 = fa_title?.split('،')[0];
  const txt2 = fa_title?.split('،')[1];

  return (
    <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={{ xs: 0.5, md: 1 }} px={{ xs: 2, sm: 0 }}>
      <Box textAlign={'center'}>
        <Typography variant="body1" color="text.disabled" sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, letterSpacing: { xs: 0.5, md: 1 } }}>
          {en_title}
        </Typography>
      </Box>

      <Box textAlign={'center'}>
        <Typography variant="h4" color="text.primary" sx={{ fontSize: { xs: 22, sm: 28, md: 34 }, lineHeight: { xs: 1.4, md: 1.3 } }}>
          {txt1}
          {txt2 && '، '}
          {txt2 && (
            <Box component="span" sx={{ color: color || theme.palette.primary.main, fontWeight: 600 }}>
              {txt2}
            </Box>
          )}
        </Typography>
      </Box>

      <Box textAlign={'center'} maxWidth={{ xs: '100%', sm: 480, md: 560 }}>
        <Typography variant="body1" color="text.disabled" sx={{ fontSize: { xs: 13, sm: 15, md: 16 }, lineHeight: { xs: 1.7, md: 1.8 } }}>
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}
