'use client';

import { Box } from '@mui/material';
import React, { useState } from 'react';

// Components
import ChildrenLayout from '@/components/ChildrenLayout';
import CustomSnackbar from '@/components/custom/CustomSnackbar';
import HeroSection from '@/components/pages/home/HeroSection';
import Brands from '@/components/pages/home/Brands';
import CategorySection from '@/components/pages/home/CategorySection';
import ProductsCardContianer from '@/components/pages/home/ProductsCardContianer';
import HowToSubmitOrderSection from '@/components/pages/home/HowToSubmitOrderSection';
import About from '@/components/pages/home/About';

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

      <Box py={6}>
        <ProductsCardContianer />
      </Box>

      <Box py={2}>
        <HowToSubmitOrderSection />
      </Box>

      <Box py={2}>
        <About />
      </Box>

      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} variant={snackbar.variant}>
        <span>{snackbar.message}</span>
      </CustomSnackbar>
    </ChildrenLayout>
  );
}
