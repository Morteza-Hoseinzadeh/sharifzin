'use client';

import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, Avatar, IconButton, useMediaQuery, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Category, Bag2, Profile2User, Chart, Setting2, Logout, Home2, TicketDiscount, MessageText, Box1, Menu } from 'iconsax-reactjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

const menuItems = [
  { title: 'داشبورد', href: '/admin', icon: Home2 },
  { title: 'محصولات', href: '/admin/products', icon: Box1 },
  { title: 'سفارش‌ها', href: '/admin/orders', icon: Bag2 },
  { title: 'کاربران', href: '/admin/users', icon: Profile2User },
  { title: 'دسته‌بندی‌ها', href: '/admin/categories', icon: Category },
  { title: 'کد تخفیف', href: '/admin/coupons', icon: TicketDiscount },
  { title: 'گزارش‌ها', href: '/admin/reports', icon: Chart },
  { title: 'تنظیمات', href: '/admin/settings', icon: Setting2 },
];

const DRAWER_WIDTH = 280;

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: SURFACE, p: 2.5, borderRadius: { xs: 0, md: '16px' }, boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` }}>
      {/* Logo */}
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 4, px: 1 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: '14px', bgcolor: alpha(ACCENT_ORANGE, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT_ORANGE, fontWeight: 800, fontSize: 18 }}>ش</Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: INK }}>شریف‌زین</Typography>
          <Typography sx={{ fontSize: 11.5, color: INK_SOFT }}>پنل مدیریت</Typography>
        </Box>
      </Stack>

      {/* Menu */}
      <List sx={{ flex: 1, p: 0 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <ListItemButton key={item.href} component={Link} href={item.href} onClick={() => isMobile && setMobileOpen(false)} sx={{ borderRadius: '14px', mb: 0.8, py: 1.3, px: 1.8, bgcolor: isActive ? alpha(ACCENT_ORANGE, 0.12) : 'transparent', color: isActive ? ACCENT_ORANGE : INK, '&:hover': { bgcolor: isActive ? alpha(ACCENT_ORANGE, 0.18) : alpha(INK, 0.04) } }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Icon size={20} variant={isActive ? 'Bold' : 'Linear'} />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 2, borderColor: alpha(INK, 0.08) }} />

      {/* Admin Info */}
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ px: 1 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(ACCENT_ORANGE, 0.15), color: ACCENT_ORANGE, fontWeight: 700, fontSize: 15 }}>ا</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: INK }}>ادمین اصلی</Typography>
          <Typography sx={{ fontSize: 11.5, color: INK_SOFT }}>admin@sharifzin.ir</Typography>
        </Box>
        <IconButton size="small" sx={{ color: INK_SOFT }}>
          <Logout size={18} />
        </IconButton>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BG }}>
      {/* Main Content */}
      <Box component="main" sx={{ width: { md: `100%` }, ml: { md: `${DRAWER_WIDTH}px` }, display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
        {/* Sidebar Desktop */}
        {!isMobile && <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0, borderRight: `1px solid ${alpha(INK, 0.06)}`, height: '100vh', zIndex: 1200 }}>{drawerContent}</Box>}

        {/* Mobile Drawer */}
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: SURFACE } }}>
          {drawerContent}
        </Drawer>

        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{ ...neoSoft, width: '100%', m: 2, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={() => setMobileOpen(true)}>
              <Menu size={22} color={INK} />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>پنل مدیریت</Typography>
            <Box sx={{ width: 40 }} />
          </Box>
        )}

        <Box minWidth={'100%'} sx={{ p: { xs: 2, md: 3.5 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
