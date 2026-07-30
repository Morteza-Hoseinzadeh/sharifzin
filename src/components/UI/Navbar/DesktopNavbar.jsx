import { Box, useTheme } from '@mui/material';
import React from 'react';

function SubHeader() {
  const theme = useTheme();
  return (
    <Box>
      <Box>
        <Image />
      </Box>
    </Box>
  );
}

function Navbar() {
  return (
    <Box>
      <Box></Box>
    </Box>
  );
}

export default function DesktopNavbar() {
  return (
    <Box sx={styles?.container}>
      <SubHeader />
      <Navbar />
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
