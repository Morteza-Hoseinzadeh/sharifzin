'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, alpha, useMediaQuery } from '@mui/material';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { ArrowRight2, CloseSquare, ShoppingCart, HamburgerMenu, UserOctagon, Receipt1 } from 'iconsax-reactjs';

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
      width: { xs: 42, sm: 48, md: 52 },
      height: { xs: 42, sm: 48, md: 52 },
      transition: 'all ease-in-out 0.2s',
      '&:hover': {
        bgcolor: alpha(theme.palette.secondary.main, 0.16),
      },
    },

    drawerPaper: {
      width: { xs: '84vw', sm: 350, md: 380 },
      maxWidth: 380,
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

    listItemText: {
      '& .MuiTypography-root': {
        fontWeight: 600,
        fontSize: { xs: '0.92rem', sm: '0.98rem' },
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
      width: { xs: 40, sm: 45, md: 48 },
      height: { xs: 40, sm: 45, md: 48 },
      borderRadius: '10px',
      cursor: 'pointer',
      transition: '0.2s',
      color: theme.palette.primary.contrastText,
    },
  };

  return (
    <Box m={'0 auto'} width={'100%'} maxWidth={1200} p={{ xs: 1.5, sm: 2 }}>
      {/* TOP BAR */}
      {isMobile && (
        <Box width="100%" display="flex" flexDirection={'column'} alignItems={'stretch'} justifyContent={'space-between'} gap={{ xs: 1.5, sm: 2 }}>
          {/* Contact info: stacked on phones, side-by-side once there's room at sm/md */}
          <Box width="100%" display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'center', sm: 'flex-start' }} justifyContent={{ xs: 'center', sm: 'space-between' }} gap={{ xs: 1.5, sm: 2 }}>
            <Box display={'flex'} alignItems={'center'} gap={{ xs: 1, sm: 1.5 }}>
              <Typography variant="body1" sx={{ fontSize: { xs: 14, sm: 15, md: 16 }, fontWeight: 600 }}>
                <a href="tel:02199887766" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>
                  {ConvertToPersianDigit('021-99887766')}
                </a>
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: { xs: 11, sm: 12 } }}>
                آماده پاسخ گویی 24 ساعته
              </Typography>
            </Box>

            <Box textAlign={{ xs: 'center', sm: 'right' }} display={'flex'} flexDirection={'column'}>
              <Typography variant="body2" color="secondary.main" sx={{ fontSize: { xs: 12, sm: 13, md: 14 } }}>
                ایران، تهران، میدان رازی (کمرگ)، خیابان مولوی،
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ fontSize: { xs: 11, sm: 12 } }}>
                روبه روی پاساژ بهمن، کوچه خسجته، پلاک 6 ، طبقه بالا
              </Typography>
            </Box>
          </Box>

          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <IconButton onClick={() => setDrawerOpen(true)} sx={styles.triggerButton} aria-label="open menu">
              <HamburgerMenu size={28} variant="Bulk" color={theme.palette.secondary.main} />
            </IconButton>

            <Box display={'flex'} alignItems={'center'} gap={{ xs: 0.75, sm: 1 }}>
              <Box sx={{ ...styles.iconBtn, backgroundColor: theme.palette.primary.main }} component={'a'} href="https://example.com">
                <Receipt1 size={21} variant="Bulk" />
              </Box>
              <Box sx={{ ...styles.iconBtn, backgroundColor: theme.palette.secondary.main }} component={'a'} href="/cart">
                <ShoppingCart size={21} variant="Bulk" />
              </Box>
              <Box sx={{ ...styles.iconBtn, backgroundColor: theme.palette.text.primary }} component={'a'} href="/auth/sign-up">
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
