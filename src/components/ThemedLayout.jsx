import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from '@/utils/theme/theme';

export default function ClientThemeLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <main style={{ position: 'relative', zIndex: 1, backgroundColor: theme.palette.background.paper }}>{children}</main>
    </ThemeProvider>
  );
}
