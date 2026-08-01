import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from '@/utils/theme/theme';
import AnimatedMotion from './UI/AnimatedMotion/AnimatedMotion';

export default function ClientThemeLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <AnimatedMotion>
        <main style={{ position: 'relative', zIndex: 1, backgroundColor: theme.palette.background.paper }}>{children}</main>
      </AnimatedMotion>
    </ThemeProvider>
  );
}
