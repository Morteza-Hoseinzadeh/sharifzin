'use client';

import { Box } from '@mui/material';
import React, { useState } from 'react';

// Components
import ChildrenLayout from '@/components/ChildrenLayout';
import CustomSnackbar from '@/components/custom/CustomSnackbar';

export default function page() {
  const [snackbar, setSnackbar] = useState({ variant: '', open: false, message: '' });

  return (
    <ChildrenLayout>
      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} variant={snackbar.variant}>
        <span>{snackbar.message}</span>
      </CustomSnackbar>
    </ChildrenLayout>
  );
}
