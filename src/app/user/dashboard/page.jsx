'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Grid, Button, Avatar, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Bag2, WalletMoney, Location, Heart, User, ArrowLeft2, Box1, Clock, TickCircle, TruckFast } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '22px',
  boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
  border: 'none',
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

const neoInset = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// ==================== Mock Data ====================
const user = {
  name: 'علی رضایی',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  joinDate: '۱۴۰۳/۰۸/۱۲',
};

const stats = [
  { icon: Bag2, label: 'سفارش‌ها', value: '۸', color: ACCENT_ORANGE },
  { icon: WalletMoney, label: 'کیف پول', value: '۱,۲۵۰,۰۰۰', color: ACCENT_BLUE, suffix: 'تومان' },
  { icon: Heart, label: 'علاقه‌مندی‌ها', value: '۵', color: '#E53E3E' },
  { icon: Location, label: 'آدرس‌ها', value: '۲', color: '#38A169' },
];

const recentOrders = [
  {
    id: 'SZ-1042',
    title: 'زین موتورسیکلت مدل کلاسیک',
    date: '۲ مرداد ۱۴۰۴',
    price: 2850000,
    status: 'delivered',
    statusLabel: 'تحویل شده',
  },
  {
    id: 'SZ-1038',
    title: 'زین اسپرت دوخت لوزی',
    date: '۲۵ تیر ۱۴۰۴',
    price: 3200000,
    status: 'shipping',
    statusLabel: 'در حال ارسال',
  },
  {
    id: 'SZ-1029',
    title: 'رویه زین چرم طبیعی',
    date: '۱۲ تیر ۱۴۰۴',
    price: 980000,
    status: 'processing',
    statusLabel: 'در حال پردازش',
  },
];

const quickLinks = [
  { icon: Bag2, title: 'سفارش‌های من', href: '/user/orders', color: ACCENT_ORANGE },
  { icon: Location, title: 'آدرس‌ها', href: '/user/addresses', color: '#38A169' },
  { icon: Heart, title: 'علاقه‌مندی‌ها', href: '/user/wishlist', color: '#E53E3E' },
  { icon: User, title: 'اطلاعات حساب', href: '/user/profile', color: ACCENT_BLUE },
];

const statusColor = {
  delivered: '#38A169',
  shipping: ACCENT_BLUE,
  processing: ACCENT_ORANGE,
};

const statusIcon = {
  delivered: TickCircle,
  shipping: TruckFast,
  processing: Clock,
};

// ==================== Components ====================
function StatCard({ icon: Icon, label, value, color, suffix }) {
  return (
    <Box sx={{ ...neoSoft, p: 2.5, height: '100%' }}>
      <Stack direction="row" alignItems="center" gap={1.8}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(color, 0.12),
            color: color,
            flexShrink: 0,
          }}
        >
          <Icon size={22} variant="Bold" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 0.3 }}>{label}</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 17, color: INK }}>
            {ConvertToPersianDigit(value)}
            {suffix && (
              <Typography component="span" sx={{ fontSize: 11, color: INK_SOFT, fontWeight: 500, mr: 0.5 }}>
                {suffix}
              </Typography>
            )}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function OrderItem({ order }) {
  const StatusIcon = statusIcon[order.status];

  return (
    <Box sx={{ ...neoSoft, p: 2.2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={1.5}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.8 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK }}>{order.title}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography sx={{ fontSize: 12, color: INK_SOFT }}>کد: {order.id}</Typography>
            <Typography sx={{ fontSize: 12, color: INK_SOFT }}>{order.date}</Typography>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" gap={2}>
          <Chip
            icon={<StatusIcon size={14} variant="Bold" color={statusColor[order.status]} style={{ marginRight: '8px' }} />}
            label={order.statusLabel}
            size="small"
            sx={{
              bgcolor: alpha(statusColor[order.status], 0.1),
              color: statusColor[order.status],
              fontWeight: 600,
              fontSize: 11.5,
              height: 28,
              borderRadius: '8px',
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK, whiteSpace: 'nowrap' }}>
            {ConvertToPersianDigit(order.price.toLocaleString())}
            <Typography component="span" sx={{ fontSize: 11, color: INK_SOFT, mr: 0.4 }}>
              تومان
            </Typography>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function DashboardPage() {
  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Box width="100%">
          {/* ========== Welcome Header ========== */}
          <Box sx={{ ...neoRaised, p: { xs: 3, md: 3.5 }, mb: 3.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: alpha(ACCENT_ORANGE, 0.15),
                    color: ACCENT_ORANGE,
                    fontWeight: 800,
                    fontSize: 20,
                    boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>سلام، {user.name} 👋</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.3 }}>به پنل کاربری شریف‌زین خوش آمدید</Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                href="/user/profile"
                endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: 13,
                  color: INK,
                  ...neoSoft,
                  '&:hover': {
                    boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                  },
                }}
              >
                ویرایش پروفایل
              </Button>
            </Stack>
          </Box>

          {/* ========== Stats ========== */}
          <Grid container spacing={2} sx={{ mb: 3.5 }}>
            {stats.map((item, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <StatCard {...item} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* ========== Recent Orders ========== */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>سفارش‌های اخیر</Typography>
                  <Button
                    component={Link}
                    href="/user/orders"
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: ACCENT_ORANGE,
                      px: 0,
                      minWidth: 'auto',
                      '&:hover': { bgcolor: 'transparent', color: '#E06B10' },
                    }}
                  >
                    مشاهده همه
                  </Button>
                </Stack>

                <Stack gap={1.5}>
                  {recentOrders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* ========== Quick Links ========== */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, height: '100%' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>دسترسی سریع</Typography>

                <Stack gap={1.5}>
                  {quickLinks.map((item, index) => (
                    <Box
                      key={index}
                      component={Link}
                      href={item.href}
                      sx={{
                        ...neoSoft,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.8,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(-3px)',
                          boxShadow: `6px 6px 14px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(item.color, 0.12),
                          color: item.color,
                          flexShrink: 0,
                        }}
                      >
                        <item.icon size={20} variant="Bold" />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK, flex: 1 }}>{item.title}</Typography>
                      <ArrowLeft2 size={16} color={INK_SOFT} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
