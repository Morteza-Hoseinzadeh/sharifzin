'use client';

import React, { useRef, useState, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import CustomSnackbar from './custom/CustomSnackbar';
import useScrollAnimation from '@/utils/hooks/animation/useScrollAnimation';
import Footer from './UI/Footer/Footer';

// Lazy load Navbar (good)
const Navbar = dynamic(() => import('@/components/UI/Navbar/Navbar'), {
  ssr: false,
});

// Memoized Snackbar wrapper (prevents re-render overhead)
const MemoSnackbar = memo(CustomSnackbar);

export default function ChildrenLayout({ children }) {
  const animatedRef = useRef(null);

  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: 'warning' });

  const closeSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  useScrollAnimation(animatedRef, { from: { y: 0, opacity: 0 }, to: { y: 0, opacity: 1, duration: 1.5, ease: 'back.out(1.2)' }, delay: 0.5 });

  return (
    <>
      <Box ref={animatedRef} sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ margin: 2 }}>{children}</Box>
        {/* <Footer /> */}
      </Box>

      <MemoSnackbar open={snackbarState.open} onClose={closeSnackbar} autoHideDuration={5000} variant={snackbarState.variant}>
        {snackbarState.message}
      </MemoSnackbar>
    </>
  );
}
