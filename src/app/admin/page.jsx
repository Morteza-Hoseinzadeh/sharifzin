'use client';

import React from 'react';
import { Box, Typography, Stack, Grid, Button, Chip, LinearProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Bag2, Profile2User, MoneyRecive, Box1, ArrowUp, ArrowDown, TickCircle, TruckFast, Clock, Eye } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

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
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

const stats = [
  {
    title: 'فروش امروز',
    value: '۱۲,۸۵۰,۰۰۰',
    suffix: 'تومان',
    change: '+۱۸٪',
    up: true,
    icon: MoneyRecive,
    color: '#38A169',
  },
  {
    title: 'سفارش‌های جدید',
    value: '۲۴',
    change: '+۱۲٪',
    up: true,
    icon: Bag2,
    color: ACCENT_ORANGE,
  },
  {
    title: 'کاربران فعال',
    value: '۱,۸۴۲',
    change: '+۵٪',
    up: true,
    icon: Profile2User,
    color: ACCENT_BLUE,
  },
  {
    title: 'محصولات',
    value: '۱۵۶',
    change: '-۲٪',
    up: false,
    icon: Box1,
    color: '#805AD5',
  },
];

const recentOrders = [
  { id: 'SZ-1042', user: 'علی رضایی', total: 2850000, status: 'delivered', date: '۲ مرداد' },
  { id: 'SZ-1041', user: 'مریم احمدی', total: 4200000, status: 'shipping', date: '۲ مرداد' },
  { id: 'SZ-1040', user: 'حسین محمدی', total: 980000, status: 'processing', date: '۱ مرداد' },
  { id: 'SZ-1039', user: 'سارا کریمی', total: 3650000, status: 'delivered', date: '۱ مرداد' },
  { id: 'SZ-1038', user: 'رضا نوری', total: 1500000, status: 'processing', date: '۳۱ تیر' },
];

const statusMap = {
  delivered: { label: 'تحویل شده', color: '#38A169', icon: TickCircle },
  shipping: { label: 'در حال ارسال', color: ACCENT_BLUE, icon: TruckFast },
  processing: { label: 'در حال پردازش', color: ACCENT_ORANGE, icon: Clock },
};

const topProducts = [
  { name: 'زین کلاسیک', sold: 48, stock: 12 },
  { name: 'زین اسپرت لوزی', sold: 36, stock: 8 },
  { name: 'رویه چرم طبیعی', sold: 29, stock: 45 },
  { name: 'زین آفرود', sold: 22, stock: 5 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>داشبورد مدیریت</Typography>
        <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>خلاصه وضعیت فروشگاه شریف‌زین</Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
              <Box sx={{ ...neoRaised, p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT, mb: 1 }}>{item.title}</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>
                      {ConvertToPersianDigit(item.value)}
                      {item.suffix && (
                        <Typography component="span" sx={{ fontSize: 12, color: INK_SOFT, mr: 0.5 }}>
                          {item.suffix}
                        </Typography>
                      )}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                      {item.up ? <ArrowUp size={14} color="#38A169" /> : <ArrowDown size={14} color="#E53E3E" />}
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: item.up ? '#38A169' : '#E53E3E',
                        }}
                      >
                        {item.change}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: INK_SOFT }}>نسبت به دیروز</Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      bgcolor: alpha(item.color, 0.12),
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} variant="Bold" />
                  </Box>
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>سفارش‌های اخیر</Typography>
              <Button component={Link} href="/admin/orders" sx={{ fontSize: 13, fontWeight: 600, color: ACCENT_ORANGE, px: 0 }}>
                مشاهده همه
              </Button>
            </Stack>

            <Stack gap={1.5}>
              {recentOrders.map((order) => {
                const st = statusMap[order.status];
                const StatusIcon = st.icon;
                return (
                  <Box
                    key={order.id}
                    sx={{
                      ...neoSoft,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK }}>{order.id}</Typography>
                      <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>
                        {order.user} • {order.date}
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Chip
                        icon={<StatusIcon size={14} variant="Bold" color={st.color} style={{ marginRight: 6 }} />}
                        label={st.label}
                        size="small"
                        sx={{
                          bgcolor: alpha(st.color, 0.1),
                          color: st.color,
                          fontWeight: 600,
                          fontSize: 11.5,
                          height: 28,
                          borderRadius: '8px',
                        }}
                      />
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK, minWidth: 110, textAlign: 'left' }}>
                        {ConvertToPersianDigit(order.total.toLocaleString())}
                        <Typography component="span" sx={{ fontSize: 11, color: INK_SOFT, mr: 0.3 }}>
                          ت
                        </Typography>
                      </Typography>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* Top Products */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ ...neoRaised, p: 3, height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>پرفروش‌ترین محصولات</Typography>
            <Stack gap={2.5}>
              {topProducts.map((p, i) => (
                <Box key={i}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{p.name}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{ConvertToPersianDigit(p.sold)} فروش</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(p.sold / 50) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(ACCENT_ORANGE, 0.12),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: ACCENT_ORANGE,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: 11.5, color: INK_SOFT, mt: 0.5 }}>موجودی: {ConvertToPersianDigit(p.stock)} عدد</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
