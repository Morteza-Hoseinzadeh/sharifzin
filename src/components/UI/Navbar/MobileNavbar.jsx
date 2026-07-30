'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, alpha, useMediaQuery, Button, Collapse } from '@mui/material';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { ArrowRight2, CloseSquare, LoginCurve, ShoppingCart, HamburgerMenu, UserOctagon } from 'iconsax-reactjs';

import { links } from '@/utils/data/links';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';

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
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
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
    <Box m={2}>
      {/* TOP BAR */}
      {isMobile && (
        <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
          <IconButton onClick={() => setDrawerOpen(true)} sx={styles.triggerButton} aria-label="open menu">
            <HamburgerMenu size={28} variant="Bulk" color={theme.palette.secondary.main} />
          </IconButton>

          <a href="/">
            <Image src="/assets/logo/sharifzin-typo.webp" alt="شریف زین" width={160} height={45} priority fetchPriority="high" />
          </a>

          <Box sx={styles.iconBtn} component={'a'} href="/cart">
            <ShoppingCart size={21} variant="Bulk" color={theme.palette.secondary.main} />
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
                    <ListItemIcon sx={styles.listItemIcon}>
                      {React.cloneElement(link.icon, {
                        color: isActive || isHovered ? theme.palette.primary.main : theme.palette.text.secondary,
                      })}
                    </ListItemIcon>

                    <ListItemText primary={link.title} primaryTypographyProps={{ fontWeight: isActive ? 700 : 600 }} sx={styles.listItemText} />

                    {hasDropdown && <ArrowRight2 size={20} variant="Bulk" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', marginRight: '8px', transition: '0.25s ease', color: theme.palette.text.secondary }} />}
                  </ListItemButton>
                </ListItem>

                {/* ACCORDION (FIXED - REAL UNDER ITEM) */}
                {hasDropdown && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Box sx={styles.submenu}>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        زیرمنو 1
                      </Typography>

                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        زیرمنو 2
                      </Typography>

                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        زیرمنو 3
                      </Typography>
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          })}

          {/* LOGIN BUTTON */}
          <Box mx={2} mt={2}>
            {isLoggedIn ? (
              <Button fullWidth href="/account/dashboard" variant="contained" size="large" startIcon={<UserOctagon size={22} variant="Bulk" color={theme.palette.primary.contrastText} style={{ marginLeft: 12 }} />} sx={styles.categoryBtn}>
                پنل کاربری
              </Button>
            ) : (
              <Button fullWidth href="/auth/account" variant="contained" size="large" startIcon={<LoginCurve size={22} variant="Bulk" color={theme.palette.primary.contrastText} style={{ marginLeft: 12 }} />} sx={styles.categoryBtn}>
                ورود / ثبت نام
              </Button>
            )}
          </Box>
        </List>
      </Drawer>
    </Box>
  );
}
