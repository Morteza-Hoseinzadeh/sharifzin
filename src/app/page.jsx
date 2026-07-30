'use client';

import { Box } from '@mui/material';
import React, { useState } from 'react';

// Components
import ChildrenLayout from '@/components/ChildrenLayout';
import CustomSnackbar from '@/components/custom/CustomSnackbar';

export default function page() {
  const [snackbar, setSnackbar] = useState({ variant: '', open: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <ChildrenLayout>
        <Box py={10} textAlign="center">
          در حال بارگذاری محتوای صفحه اصلی...
        </Box>
      </ChildrenLayout>
    );
  }

  return (
    <ChildrenLayout>
      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} variant={snackbar.variant}>
        <span>{snackbar.message}</span>
      </CustomSnackbar>
    </ChildrenLayout>
  );
}
