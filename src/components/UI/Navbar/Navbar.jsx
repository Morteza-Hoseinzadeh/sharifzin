'use client';

import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

// Lazy load Navbar (good)
export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
