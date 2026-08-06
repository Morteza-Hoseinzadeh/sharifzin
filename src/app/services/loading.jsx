'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export default function Loading() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl', backgroundColor: 'background.default' }}>
      <Typography variant="h6">درحال بارگذاری</Typography>
    </Box>
  );
}
