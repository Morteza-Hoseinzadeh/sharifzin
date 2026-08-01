'use client';

import { Box } from '@mui/material';
import React, { useState } from 'react';

// Components
import ChildrenLayout from '@/components/ChildrenLayout';
import CustomSnackbar from '@/components/custom/CustomSnackbar';
import HeroSection from '@/components/pages/home/HeroSection';
import Brands from '@/components/pages/home/Brands';
import CategorySection from '@/components/pages/home/CategorySection';

export default function page() {
  const [snackbar, setSnackbar] = useState({ variant: '', open: false, message: '' });

  return (
    <ChildrenLayout>
      <Box py={2}>
        <HeroSection />
      </Box>

      <Box py={2}>
        <Brands />
      </Box>

      <Box py={2}>
        <CategorySection />
      </Box>

      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} variant={snackbar.variant}>
        <span>{snackbar.message}</span>
      </CustomSnackbar>
    </ChildrenLayout>
  );
}
