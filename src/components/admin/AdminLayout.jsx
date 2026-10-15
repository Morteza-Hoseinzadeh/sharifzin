'use client';

import React, { useEffect, useState } from 'react';

import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, Avatar, IconButton, useMediaQuery, Divider, Button, CircularProgress } from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';

import { Category, Bag2, Profile2User, Setting2, Logout, Home2, TicketDiscount, Box1, Menu, CloseCircle, ArrowLeft2, LoginCurve } from 'iconsax-reactjs';

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

const DRAWER_WIDTH = 285;

const menuItems = [
  {
    title: 'داشبورد',
    href: '/admin',
    icon: Home2,
    description: 'نمای کلی مدیریت',
  },
  {
    title: 'محصولات',
    href: '/admin/products',
    icon: Box1,
    description: 'مدیریت محصولات',
  },
  {
    title: 'سفارش‌ها',
    href: '/admin/orders',
    icon: Bag2,
    description: 'پیگیری سفارش‌ها',
  },
  {
    title: 'کاربران',
    href: '/admin/users',
    icon: Profile2User,
    description: 'مدیریت کاربران',
  },
  {
    title: 'دسته‌بندی‌ها',
    href: '/admin/categories',
    icon: Category,
    description: 'دسته‌بندی محصولات',
  },
  {
    title: 'کد تخفیف',
    href: '/admin/coupons',
    icon: TicketDiscount,
    description: 'مدیریت تخفیف‌ها',
  },
];

const neoSoft = {
  background: SURFACE,
  boxShadow: `
    6px 6px 14px ${SHADOW_DARK},
    -6px -6px 14px ${SHADOW_LIGHT}
  `,
};

export default function AdminLayout({ children }) {
  const { isAdmin, loading } = useCheckUserRole();

  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, loading, router]);

  // Close the mobile drawer when the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scrolling while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen || !isMobile) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, isMobile]);

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    closeDrawer();
    router.push('/');
  };

  const drawerContent = (
    <Box
      dir="rtl"
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: SURFACE,
        overflow: 'hidden',
      }}>
      {/* Brand header */}
      <Box
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2.5,
          flexShrink: 0,
          background: `
            radial-gradient(
              circle at top right,
              ${alpha(ACCENT_ORANGE, 0.14)},
              transparent 65%
            )
          `,
        }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '16px',
                background: `linear-gradient(145deg, #FF9A43, ${ACCENT_ORANGE})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 25,
                fontWeight: 900,
                boxShadow: `0 7px 18px ${alpha(ACCENT_ORANGE, 0.28)}`,
                flexShrink: 0,
              }}>
              ش
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: INK,
                  lineHeight: 1.7,
                }}>
                شریف‌زین
              </Typography>

              <Typography
                sx={{
                  fontSize: 11.5,
                  color: INK_SOFT,
                }}>
                پنل مدیریت فروشگاه
              </Typography>
            </Box>
          </Stack>

          {isMobile && (
            <IconButton
              onClick={closeDrawer}
              aria-label="بستن منو"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '13px',
                color: INK_SOFT,
                backgroundColor: SURFACE,
                boxShadow: `
                  4px 4px 8px ${SHADOW_DARK},
                  -4px -4px 8px ${SHADOW_LIGHT}
                `,
                '&:hover': {
                  color: ACCENT_ORANGE,
                  backgroundColor: SURFACE,
                },
              }}>
              <CloseCircle size={22} />
            </IconButton>
          )}
        </Stack>

        {/* Admin profile */}
        <Box
          sx={{
            mt: 3,
            p: 1.5,
            borderRadius: '17px',
            backgroundColor: alpha('#FFFFFF', 0.48),
            border: `1px solid ${alpha('#FFFFFF', 0.7)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: alpha(ACCENT_ORANGE, 0.15),
              color: ACCENT_ORANGE,
              fontWeight: 800,
            }}>
            م
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                color: INK,
                fontWeight: 800,
                fontSize: 13.5,
              }}>
              مدیر فروشگاه
            </Typography>

            <Stack direction="row" alignItems="center" gap={0.7} mt={0.4}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: '#22A06B',
                }}
              />

              <Typography
                sx={{
                  fontSize: 11,
                  color: INK_SOFT,
                }}>
                دسترسی مدیریت
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Divider
        sx={{
          mx: 2.5,
          borderColor: alpha(INK, 0.07),
          flexShrink: 0,
        }}
      />

      {/* Navigation title */}
      <Box sx={{ px: 3, pt: 2.5, pb: 1, flexShrink: 0 }}>
        <Typography
          sx={{
            color: INK_SOFT,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.4,
          }}>
          منوی اصلی
        </Typography>
      </Box>

      {/* Navigation list */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 1.8,
          pb: 2,
          overscrollBehavior: 'contain',
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(INK_SOFT, 0.3)} transparent`,
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: alpha(INK_SOFT, 0.25),
          },
        }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                onClick={closeDrawer}
                selected={isActive}
                sx={{
                  position: 'relative',
                  borderRadius: '15px',
                  mb: 1,
                  py: 1.35,
                  px: 1.6,
                  minHeight: 61,
                  color: isActive ? ACCENT_ORANGE : INK,
                  backgroundColor: isActive ? alpha(ACCENT_ORANGE, 0.09) : 'transparent',
                  border: `1px solid ${isActive ? alpha(ACCENT_ORANGE, 0.13) : 'transparent'}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive ? alpha(ACCENT_ORANGE, 0.12) : alpha('#FFFFFF', 0.65),
                    transform: 'translateX(-2px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: alpha(ACCENT_ORANGE, 0.09),
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: alpha(ACCENT_ORANGE, 0.13),
                  },
                  '&::before': isActive
                    ? {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '20%',
                        bottom: '20%',
                        width: 3,
                        borderRadius: '5px 0 0 5px',
                        bgcolor: ACCENT_ORANGE,
                      }
                    : {},
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 43,
                    color: 'inherit',
                    justifyContent: 'center',
                  }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isActive ? alpha(ACCENT_ORANGE, 0.13) : alpha('#FFFFFF', 0.58),
                      boxShadow: isActive ? `inset 2px 2px 5px ${alpha(ACCENT_ORANGE, 0.08)}` : 'none',
                      transition: 'all 0.2s ease',
                    }}>
                    <Icon size={21} variant={isActive ? 'Bold' : 'Linear'} />
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontSize: 13.5,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? ACCENT_ORANGE : INK,
                  }}
                  secondaryTypographyProps={{
                    fontSize: 10.5,
                    color: INK_SOFT,
                    sx: { mt: 0.3 },
                  }}
                />

                {isActive && <ArrowLeft2 size={17} color={ACCENT_ORANGE} variant="Linear" />}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Footer actions */}
      <Box
        sx={{
          p: 2.2,
          pt: 1.5,
          flexShrink: 0,
          borderTop: `1px solid ${alpha(INK, 0.07)}`,
          backgroundColor: alpha('#FFFFFF', 0.2),
        }}>
        <Button
          component={Link}
          href="/"
          fullWidth
          onClick={closeDrawer}
          startIcon={<Home2 size={19} />}
          sx={{
            mb: 1,
            py: 1.2,
            borderRadius: '13px',
            color: INK,
            fontSize: 12.5,
            fontWeight: 700,
            backgroundColor: SURFACE,
            boxShadow: `
              4px 4px 8px ${SHADOW_DARK},
              -4px -4px 8px ${SHADOW_LIGHT}
            `,
            '&:hover': {
              backgroundColor: '#fff',
            },
          }}>
          مشاهده فروشگاه
        </Button>

        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<Logout size={19} />}
          sx={{
            py: 1.2,
            borderRadius: '13px',
            color: '#D94841',
            fontSize: 12.5,
            fontWeight: 700,
            '&:hover': {
              backgroundColor: alpha('#D94841', 0.08),
            },
          }}>
          خروج از پنل
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box
        dir="rtl"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          bgcolor: BG,
        }}>
        <CircularProgress size={34} sx={{ color: ACCENT_ORANGE }} />

        <Typography
          sx={{
            color: INK_SOFT,
            fontSize: 13,
          }}>
          در حال بررسی دسترسی...
        </Typography>
      </Box>
    );
  }

  // Do not render admin content for unauthorized users.
  if (!isAdmin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: BG,
        }}
      />
    );
  }

  return (
    <Box
      dir="rtl"
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: BG,
        display: 'flex',
      }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            height: '100vh',
            position: 'sticky',
            top: 0,
            p: 1.5,
            pr: 1.5,
          }}>
          <Box
            sx={{
              height: '100%',
              overflow: 'hidden',
              borderRadius: '22px',
              ...neoSoft,
            }}>
            {drawerContent}
          </Box>
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={isMobile && mobileOpen}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          dir: 'rtl',
          elevation: 0,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          zIndex: (muiTheme) => muiTheme.zIndex.drawer + 2,
          '& .MuiDrawer-paper': {
            width: {
              xs: 'min(86vw, 320px)',
              sm: DRAWER_WIDTH,
            },
            maxWidth: '100%',
            height: '100dvh',
            boxSizing: 'border-box',
            overflow: 'hidden',
            bgcolor: SURFACE,
            borderRadius: '20px 0 0 20px',
            border: 'none',
            boxShadow: '-16px 0 45px rgba(45, 55, 72, 0.16)',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#1B2430', 0.42),
            backdropFilter: 'blur(3px)',
          },
        }}>
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {/* Mobile header */}
        {isMobile && (
          <Box
            component="header"
            sx={{
              mx: 2,
              mt: 2,
              mb: 1,
              px: 1.8,
              py: 1.4,
              borderRadius: '18px',
              ...neoSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              position: 'sticky',
              top: 8,
              zIndex: 1100,
            }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="باز کردن منوی مدیریت"
              sx={{
                width: 43,
                height: 43,
                borderRadius: '13px',
                color: ACCENT_ORANGE,
                backgroundColor: SURFACE,
                boxShadow: `
                  4px 4px 8px ${SHADOW_DARK},
                  -4px -4px 8px ${SHADOW_LIGHT}
                `,
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}>
              <Menu size={23} variant="Bold" />
            </IconButton>

            <Box sx={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <Typography
                sx={{
                  color: INK,
                  fontWeight: 900,
                  fontSize: 14,
                }}>
                پنل مدیریت
              </Typography>

              <Typography
                sx={{
                  color: INK_SOFT,
                  fontSize: 10.5,
                  mt: 0.25,
                }}>
                شریف‌زین
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: alpha(ACCENT_ORANGE, 0.15),
                color: ACCENT_ORANGE,
                fontWeight: 800,
                fontSize: 16,
              }}>
              ش
            </Avatar>
          </Box>
        )}

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            p: {
              xs: 1.5,
              sm: 2.5,
              md: 4,
            },
            pt: {
              xs: 1.5,
              md: 4,
            },
          }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
