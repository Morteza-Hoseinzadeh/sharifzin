'use client';

import React, { useState, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import CustomSnackbar from './custom/CustomSnackbar';
import Footer from './UI/Footer/Footer';
import Navbar from './UI/Navbar/Navbar';

// Memoized Snackbar wrapper (prevents re-render overhead)
const MemoSnackbar = memo(CustomSnackbar);

export default function ChildrenLayout({ children }) {
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: 'warning' });

  const closeSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ margin: '8px 16px' }}>
          <Navbar />
          {children}
          <Footer />
        </Box>
      </Box>

      <MemoSnackbar open={snackbarState.open} onClose={closeSnackbar} autoHideDuration={5000} variant={snackbarState.variant}>
        {snackbarState.message}
      </MemoSnackbar>
    </>
  );
}
