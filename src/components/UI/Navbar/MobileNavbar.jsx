'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { alpha, Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Typography, useMediaQuery, useTheme, Divider, Stack } from '@mui/material';

import { ArrowDown2, ArrowLeft2, CloseSquare, HamburgerMenu, Call, Location, Clock, User } from 'iconsax-reactjs';

import { actions, links } from '@/utils/data/links';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

export default function MobileNavbar() {
  const { isLoggedIn } = useCheckUserRole();

  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const brandColor = '#F97516';
  const darkColor = '#171717';

  const closeDrawer = () => {
    setDrawerOpen(false);
    setOpenIndex(null);
  };

  const isActiveLink = (href) => {
    if (!href) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const styles = {
    triggerButton: {
      width: 46,
      height: 46,
      borderRadius: '15px',
      color: brandColor,
      backgroundColor: alpha(brandColor, 0.09),
      border: `1px solid ${alpha(brandColor, 0.18)}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(brandColor, 0.16),
        transform: 'translateY(-2px)',
      },
    },

    drawerPaper: {
      width: '100%',
      maxHeight: '86dvh',
      overflow: 'hidden',
      borderRadius: '26px 26px 0 0',
      backgroundColor: theme.palette.background.paper,
      backgroundImage: 'none',
      borderTop: `1px solid ${alpha(brandColor, 0.25)}`,
      boxShadow: '0 -12px 50px rgba(0, 0, 0, 0.16)',
    },

    menuItem: (active, expanded) => ({
      minHeight: 54,
      px: 2,
      py: 1,
      mx: 1,
      my: 0.5,
      borderRadius: '15px',
      color: active ? brandColor : theme.palette.text.primary,
      backgroundColor: active || expanded ? alpha(brandColor, 0.09) : 'transparent',
      border: `1px solid ${active ? alpha(brandColor, 0.16) : 'transparent'}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(brandColor, 0.07),
      },
      '& .MuiListItemText-primary': {
        fontSize: '0.94rem',
        fontWeight: active ? 800 : 600,
      },
    }),
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 2 },
      }}>
      {isMobile && (
        <Stack gap={2}>
          {/* Contact information */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
              p: 1.5,
              borderRadius: '18px',
              backgroundColor: alpha(brandColor, 0.045),
              border: `1px solid ${alpha(brandColor, 0.1)}`,
            }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
              }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '13px',
                  color: brandColor,
                  backgroundColor: alpha(brandColor, 0.12),
                }}>
                <Call size={21} variant="Bold" />
              </Box>

              <Box>
                <Typography
                  component="a"
                  href="tel:09101941231"
                  sx={{
                    display: 'block',
                    color: 'text.primary',
                    fontSize: { xs: 14, sm: 15 },
                    fontWeight: 800,
                    textDecoration: 'none',
                    direction: 'ltr',
                    textAlign: 'right',
                  }}>
                  {ConvertToPersianDigit('09101941231')}
                </Typography>

                <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.3 }}>آماده پاسخ‌گویی به شما</Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                display: { xs: 'block', sm: 'none' },
                borderColor: alpha(brandColor, 0.12),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
              }}>
              <Location size={20} color={brandColor} variant="Bold" style={{ flexShrink: 0, marginTop: 2 }} />

              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: 11.5,
                  lineHeight: 1.9,
                }}>
                تهران، میدان رازی، خیابان مولوی، روبه‌روی پاساژ بهمن، کوچه خجسته، پلاک ۶، طبقه بالا
              </Typography>
            </Box>
          </Box>

          {/* Main mobile navigation */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}>
            <Button
              onClick={() => setDrawerOpen(true)}
              startIcon={null}
              aria-label="باز کردن منوی سایت"
              sx={{
                minWidth: 0,
                height: 48,
                px: 1.8,
                gap: 1,
                borderRadius: '15px',
                color: '#fff',
                backgroundColor: darkColor,
                '&:hover': {
                  backgroundColor: '#303030',
                },
              }}>
              <HamburgerMenu size={23} color="#fff" variant="Linear" />

              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>منوی سایت</Typography>
            </Button>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
              {actions.map((action, index) => {
                const hasTitle = Boolean(action.title);
                const href = !hasTitle ? (isLoggedIn ? '/user/dashboard' : '/auth/sign-up') : action.href;

                const ActionIcon = action.icon;

                return (
                  <Button
                    key={action.title || index}
                    component={Link}
                    href={href}
                    aria-label={action.title || 'حساب کاربری'}
                    title={action.title || 'حساب کاربری'}
                    sx={{
                      minWidth: 46,
                      width: 46,
                      height: 46,
                      p: 0,
                      borderRadius: '15px',
                      color: '#fff',
                      backgroundColor: action.backgroundColor || brandColor,
                      boxShadow: `0 5px 16px ${alpha(action.backgroundColor || brandColor, 0.22)}`,
                      '&:hover': {
                        backgroundColor: alpha(action.backgroundColor || brandColor, 0.85),
                        transform: 'translateY(-2px)',
                      },
                    }}>
                    {ActionIcon && <ActionIcon size={22} color="#fff" variant="Bold" />}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Stack>
      )}

      {/* Bottom drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: styles.drawerPaper,
        }}
        sx={{
          zIndex: theme.zIndex.modal,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.52)',
            backdropFilter: 'blur(4px)',
          },
        }}>
        {/* Drag indicator + header */}
        <Box
          sx={{
            pt: 1.2,
            px: 2,
            pb: 1.5,
          }}>
          <Box
            sx={{
              width: 42,
              height: 5,
              mx: 'auto',
              mb: 2,
              borderRadius: 10,
              backgroundColor: alpha(theme.palette.text.primary, 0.2),
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 19,
                  color: 'text.primary',
                }}>
                منوی سایت
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: 'text.secondary',
                  fontSize: 12,
                }}>
                سریع به بخش موردنظرت برو
              </Typography>
            </Box>

            <IconButton
              onClick={closeDrawer}
              aria-label="بستن منو"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '14px',
                color: brandColor,
                backgroundColor: alpha(brandColor, 0.09),
                '&:hover': {
                  backgroundColor: alpha(brandColor, 0.16),
                },
              }}>
              <CloseSquare size={24} variant="Bold" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ borderColor: alpha(brandColor, 0.1) }} />

        {/* Scrollable menu */}
        <Box
          sx={{
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            px: 1,
            py: 1.5,
            pb: 2,
            flex: 1,
          }}>
          <List disablePadding>
            {links.map((link, index) => {
              const active = isActiveLink(link.href);
              const expanded = openIndex === index;
              const hasDropdown = Boolean(link.hasDropdown);

              // پشتیبانی از چند نام رایج برای آرایه زیرمنو
              const subLinks = link.children || link.items || link.dropdownItems || link.subLinks || [];

              const handleClick = (event) => {
                if (hasDropdown && subLinks.length > 0) {
                  event.preventDefault();
                  setOpenIndex(expanded ? null : index);
                  return;
                }

                closeDrawer();
              };

              return (
                <React.Fragment key={link.href || link.title || index}>
                  <ListItem disablePadding>
                    <ListItemButton component={link.href ? Link : 'button'} href={link.href || undefined} onClick={handleClick} sx={styles.menuItem(active, expanded)}>
                      <ListItemText primary={link.title} sx={{ textAlign: 'right', m: 0 }} />

                      {hasDropdown && subLinks.length > 0 ? (
                        <ArrowDown2
                          size={20}
                          color={brandColor}
                          variant="Linear"
                          style={{
                            flexShrink: 0,
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      ) : (
                        <ArrowLeft2 size={18} color={active ? brandColor : theme.palette.text.disabled} variant="Linear" />
                      )}
                    </ListItemButton>
                  </ListItem>

                  {/* Submenu */}
                  {hasDropdown && subLinks.length > 0 && expanded && (
                    <Box
                      sx={{
                        mr: 3,
                        ml: 1,
                        mb: 1,
                        py: 0.5,
                        borderRight: `2px solid ${alpha(brandColor, 0.3)}`,
                      }}>
                      {subLinks.map((subLink, subIndex) => {
                        const subHref = subLink.href || subLink.path;
                        const subActive = isActiveLink(subHref);

                        return (
                          <ListItem key={subHref || subLink.title || subIndex} disablePadding>
                            <ListItemButton
                              component={subHref ? Link : 'div'}
                              href={subHref || undefined}
                              onClick={closeDrawer}
                              sx={{
                                minHeight: 44,
                                px: 2,
                                borderRadius: '12px',
                                color: subActive ? brandColor : 'text.secondary',
                                '&:hover': {
                                  backgroundColor: alpha(brandColor, 0.06),
                                },
                              }}>
                              <ListItemText
                                primary={subLink.title || subLink.label}
                                sx={{
                                  textAlign: 'right',
                                  '& .MuiTypography-root': {
                                    fontSize: 13,
                                    fontWeight: subActive ? 700 : 500,
                                  },
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </List>

          {/* Bottom contact section */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: '18px',
              background: `linear-gradient(135deg, ${alpha(brandColor, 0.13)}, ${alpha(brandColor, 0.035)})`,
              border: `1px solid ${alpha(brandColor, 0.15)}`,
            }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}>
              <Clock size={19} color={brandColor} variant="Bold" />

              <Typography sx={{ fontSize: 13, fontWeight: 800, color: 'text.primary' }}>برای مشاوره و ثبت سفارش</Typography>
            </Box>

            <Typography
              component="a"
              href="tel:09101941231"
              onClick={closeDrawer}
              sx={{
                display: 'block',
                textAlign: 'center',
                py: 1.4,
                px: 2,
                borderRadius: '13px',
                backgroundColor: brandColor,
                color: '#fff',
                fontSize: 15,
                fontWeight: 900,
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: '#EA580C',
                },
              }}>
              تماس با شریف زین
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
