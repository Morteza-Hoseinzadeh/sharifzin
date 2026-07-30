'use client';

import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import ChildrenLayout from '@/components/ChildrenLayout';

export default function NotFound() {
  const theme = useTheme();

  return (
    <ChildrenLayout>
      <Box component="main" sx={{ minHeight: 'fit-content', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default', direction: 'rtl', textAlign: 'right' }}>
        <Container maxWidth="xl">
          <Typography variant="h6">صفحه مورد نظر یافت نشد</Typography>
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
