'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useMediaQuery, useTheme } from '@mui/material';

const MobileNavbar = dynamic(() => import('./MobileNavbar'), { ssr: false });
const DesktopNavbar = dynamic(() => import('./DesktopNavbar'), { ssr: false });

// Lazy load Navbar (good)
export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
