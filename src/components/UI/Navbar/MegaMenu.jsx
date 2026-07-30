'use client';

import React, { useState } from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

export default function MegaMenu({ data, open }) {
  const theme = useTheme();

  const [activeMenu, setActiveMenu] = useState(data.sidebar?.[0]?.key);

  if (!open) return null;

  const styles = {
    container: {
      position: 'absolute',
      top: '100%',
      right: 0,
      width: 1100,
      maxWidth: '95vw',
      minHeight: 'fit-content',
      background: theme.palette.background.paper,
      zIndex: 9999,
      borderRadius: '32px 0px 32px 32px',
      p: 2,
      boxShadow: '0px 0px 50px 0px #00000040',
    },

    sidebar: {
      width: 'fit-content',
      height: 'fit-content',
      borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      p: 2,
      borderRadius: '16px',
      boxShadow: '0px 0px 50px 0px #00000015',
    },

    sidebarItem: {
      p: 1.2,
      mb: 2,
      borderRadius: 2,
      cursor: 'pointer',
      fontSize: 14,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
    },

    columnTitle: {
      fontWeight: 700,
      fontSize: 14,
      mb: 1,
      color: theme.palette.secondary.main,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },

    item: {
      textDecoration: 'none',
      fontSize: 15,
      color: theme.palette.text.disabled,
      cursor: 'pointer',
      transition: '0.2s',
    },
  };

  const columns = data.content?.[activeMenu] || data.columns || [];

  return (
    <Box sx={styles.container}>
      <Box display="flex" gap={3}>
        {/* SIDEBAR */}
        {data.sidebar?.length > 0 && (
          <Box sx={styles.sidebar}>
            {data.sidebar.map((item) => {
              const Icon = item.icon;

              return (
                <Box key={item.key} onMouseEnter={() => setActiveMenu(item.key)} sx={{ ...styles.sidebarItem, bgcolor: activeMenu === item.key ? alpha(theme.palette.primary.main, 0.08) : 'transparent', color: activeMenu === item.key ? 'primary.main' : 'text.primary' }}>
                  <Icon size={22} variant="Bulk" />
                  <Typography component="span">{item.title}</Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* CONTENT */}
        <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,minmax(220px,1fr))', gap: 4, p: 3 }}>
          {columns.map((col) => (
            <Box key={col.title}>
              <Typography component="div" sx={styles.columnTitle}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                {col.title}
              </Typography>

              <Box display="flex" flexDirection="column" gap={1} mt={2}>
                {col.items.map((item) => (
                  <a key={item.title} href={item.href} style={styles.item}>
                    {item.title}
                  </a>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
