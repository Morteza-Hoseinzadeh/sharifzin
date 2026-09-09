'use client';

import React, { useEffect, useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, Avatar, IconButton, useMediaQuery, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Category, Bag2, Profile2User, Chart, Setting2, Logout, Home2, TicketDiscount, Box1, Menu } from 'iconsax-reactjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';

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
];

const DRAWER_WIDTH = 280;

export default function AdminLayout({ children }) {
  const { isAdmin, loading } = useCheckUserRole();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: SURFACE, p: 3, borderRadius: { xs: 0, md: '20px' }, boxShadow: `6px 6px 20px ${SHADOW_DARK}, -6px -6px 20px ${SHADOW_LIGHT}` }}>
      {/* Logo */}
      <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 5 }}>
        <Box sx={{ width: 50, height: 50, borderRadius: '16px', bgcolor: alpha(ACCENT_ORANGE, 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT_ORANGE, fontWeight: 900, fontSize: 22 }}>ش</Box>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 20, color: INK }}>شریف‌زین</Typography>
          <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>پنل مدیریت</Typography>
        </Box>
      </Stack>

      {/* Menu */}
      <List sx={{ flex: 1, p: 0 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <ListItemButton key={item.href} component={Link} href={item.href} onClick={() => isMobile && setMobileOpen(false)} sx={{ borderRadius: '14px', mb: 1, py: 1.4, px: 2, bgcolor: isActive ? alpha(ACCENT_ORANGE, 0.12) : 'transparent', color: isActive ? ACCENT_ORANGE : INK, '&:hover': { bgcolor: isActive ? alpha(ACCENT_ORANGE, 0.18) : alpha(INK, 0.04) }, transition: 'all 0.2s ease' }}>
              <ListItemIcon sx={{ minWidth: 44 }}>
                <Icon size={22} variant={isActive ? 'Bold' : 'Linear'} />
              </ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: 15 }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100vh">
        <Typography variant="h6">در حال احراز هویت...</Typography>
      </Box>
    );
  }

  return (
    !loading && (
      <Box sx={{ width: '100%', display: 'flex', minHeight: '100vh', bgcolor: BG }}>
        <Box component="main" sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
          {/* Desktop Sidebar */}
          {!isMobile && <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0, borderRight: `1px solid ${alpha(INK, 0.06)}`, position: 'sticky', top: 0, height: '100vh', zIndex: 1200 }}>{drawerContent}</Box>}

          {/* Mobile Drawer */}
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: SURFACE } }}>
            {drawerContent}
          </Drawer>

          {/* Mobile Header */}
          {isMobile && (
            <Box sx={{ ...neoSoft, width: '100%', m: 2, p: 1.8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconButton onClick={() => setMobileOpen(true)}>
                <Menu size={26} color={INK} />
              </IconButton>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>پنل مدیریت</Typography>
              <Box sx={{ width: 44 }} />
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2.5, md: 4 } }}>{children}</Box>
        </Box>
      </Box>
    )
  );
}
