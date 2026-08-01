'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, alpha, useMediaQuery, Button, Collapse } from '@mui/material';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { ArrowRight2, CloseSquare, LoginCurve, ShoppingCart, HamburgerMenu, UserOctagon, Receipt1, LocationDiscover, Mobile } from 'iconsax-reactjs';

import { links } from '@/utils/data/links';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

export default function MobileNavbar() {
  const { isLoggedIn } = useCheckUserRole();

  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const styles = {
    triggerButton: {
      color: 'secondary.main',
      bgcolor: alpha(theme.palette.secondary.main, 0.08),
      borderRadius: '12px',
      width: 48,
      height: 48,
      transition: 'all ease-in-out 0.2s',
      '&:hover': {
        bgcolor: alpha(theme.palette.secondary.main, 0.16),
      },
    },

    drawerPaper: {
      width: 350,
      backgroundColor: theme.palette.background.paper,
      backdropFilter: 'blur(12px)',
      borderTopLeftRadius: '16px',
      minHeight: '100vh',
    },

    listItem: (isActive, isHovered) => ({
      borderRadius: '12px',
      margin: '4px 8px',
      backgroundColor: isActive ? alpha(theme.palette.secondary.main, 0.12) : isHovered ? alpha(theme.palette.secondary.main, 0.06) : 'transparent',
      color: isActive || isHovered ? theme.palette.secondary.main : theme.palette.text.disabled,
      transition: 'all 0.22s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, 0.08),
      },
    }),

    listItemIcon: {
      minWidth: 'auto',
      mr: 2,
      color: 'inherit',
    },

    listItemText: {
      '& .MuiTypography-root': {
        fontWeight: 600,
        fontSize: '0.98rem',
      },
    },

    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    },

    iconBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 45,
      height: 45,
      borderRadius: '10px',
      cursor: 'pointer',
      transition: '0.2s',
      color: theme.palette.primary.contrastText,
    },

    categoryBtn: {
      borderRadius: '14px',
      background: `linear-gradient(135deg,${theme.palette.primary.light},${theme.palette.primary.main},${theme.palette.primary.dark})`,
      color: theme.palette.primary.contrastText,
      boxShadow: 'none',
      fontWeight: '600',

      px: 2,
      py: 1,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },

    submenu: {
      pl: 7,
      pr: 2,
      py: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      marginLeft: 2,
    },
  };

  return (
    <Box m={'0 auto'} width={'100%'} maxWidth={1200} p={2}>
      {/* TOP BAR */}
      {isMobile && (
        <Box width="100%" flexDirection={'column-reverse'} alignItems={'center'} justifyContent={'space-between'} gap={2}>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={2}>
            <Box display={'flex'} alignItems={'center'} flexDirection={'row-reverse'} gap={2}>
              <Box>
                <LocationDiscover variant="Bulk" size={32} color={theme.palette.primary.main} />
              </Box>
              <Box>
                <Box sx={{ width: '1px', height: 30, backgroundColor: alpha(theme.palette.text.disabled, 0.1), display: 'inline-block' }} />
              </Box>
              <Box display={'flex'} flexDirection={'column'}>
                <Typography variant="body2" color="secondary.main">
                  ایران، تهران، میدان رازی (کمرگ)، خیابان مولوی،
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  روبه روی پاساژ بهمن، کوچه خسجته، پلاک 6 ، طبقه بالا
                </Typography>
              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} flexDirection={'row-reverse'} gap={2}>
              <Box>
                <Mobile variant="Bulk" size={32} color={theme.palette.primary.main} />
              </Box>
              <Box>
                <Box sx={{ width: '1px', height: 30, backgroundColor: alpha(theme.palette.text.disabled, 0.1), display: 'inline-block' }} />
              </Box>
              <Box>
                <Typography variant="body1">
                  <a href="tel:02199887766" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>
                    {ConvertToPersianDigit('021-99887766')}
                  </a>
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  آماده پاسخ گویی 24 ساعته
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <IconButton onClick={() => setDrawerOpen(true)} sx={styles.triggerButton} aria-label="open menu">
              <HamburgerMenu size={28} variant="Bulk" color={theme.palette.secondary.main} />
            </IconButton>

            <Box display={'flex'} alignItems={'center'} gap={1}>
              <Box sx={{ ...styles.iconBtn, backgroundColor: theme.palette.primary.main }} component={'a'} href="https://example.com">
                <Receipt1 size={21} variant="Bulk" />
              </Box>
              <Box sx={{ ...styles.iconBtn, backgroundColor: theme.palette.secondary.main }} component={'a'} href="/cart">
                <ShoppingCart size={21} variant="Bulk" />
              </Box>
              <Box sx={{ ...styles.iconBtn, backgroundColor: theme.palette.text.primary }} component={'a'} href="/auth/account">
                <UserOctagon size={26} variant="Bulk" />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: styles.drawerPaper }}>
        {/* HEADER */}
        <Box sx={styles.header}>
          <Typography variant="h6" fontWeight={700} color="secondary.main">
            منو
          </Typography>

          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseSquare size={28} variant="Bulk" color={theme.palette.secondary.main} />
          </IconButton>
        </Box>

        {/* MENU */}
        <List disablePadding>
          {links.map((link, index) => {
            const isActive = pathname === link.href || (link.href && pathname.startsWith(link.href));

            const isHovered = hoveredIndex === index;
            const isOpen = openIndex === index;
            const hasDropdown = link.hasDropdown;

            const handleClick = () => {
              if (hasDropdown) {
                setOpenIndex(isOpen ? null : index);
                return;
              }
            };

            return (
              <Box key={link.title}>
                <ListItem disablePadding onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                  <ListItemButton component={link.href ? Link : 'div'} href={link.href || undefined} onClick={handleClick} sx={styles.listItem(isActive, isHovered)}>
                    <ListItemText primary={link.title} primaryTypographyProps={{ fontWeight: isActive ? 700 : 600 }} sx={styles.listItemText} />

                    {hasDropdown && <ArrowRight2 size={20} variant="Bulk" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', marginRight: '8px', transition: '0.25s ease', color: theme.palette.text.secondary }} />}
                  </ListItemButton>
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}
