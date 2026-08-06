'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Grid, Button, Chip, Tabs, Tab } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Bag2, ArrowLeft2, Clock, TickCircle, TruckFast, CloseCircle, SearchNormal1 } from 'iconsax-reactjs';
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
const orders = [
  {
    id: 'SZ-1042',
    title: 'زین موتورسیکلت مدل کلاسیک',
    date: '۲ مرداد ۱۴۰۴',
    price: 2850000,
    status: 'delivered',
    statusLabel: 'تحویل شده',
    items: 1,
  },
  {
    id: 'SZ-1038',
    title: 'زین اسپرت دوخت لوزی',
    date: '۲۵ تیر ۱۴۰۴',
    price: 3200000,
    status: 'shipping',
    statusLabel: 'در حال ارسال',
    items: 1,
  },
  {
    id: 'SZ-1029',
    title: 'رویه زین چرم طبیعی',
    date: '۱۲ تیر ۱۴۰۴',
    price: 980000,
    status: 'processing',
    statusLabel: 'در حال پردازش',
    items: 1,
  },
  {
    id: 'SZ-1015',
    title: 'زین آفرود تقویت‌شده',
    date: '۲۸ خرداد ۱۴۰۴',
    price: 4100000,
    status: 'delivered',
    statusLabel: 'تحویل شده',
    items: 2,
  },
  {
    id: 'SZ-1008',
    title: 'کاور زین ضد آب',
    date: '۱۵ خرداد ۱۴۰۴',
    price: 450000,
    status: 'cancelled',
    statusLabel: 'لغو شده',
    items: 1,
  },
  {
    id: 'SZ-0992',
    title: 'زین اسپرت مدل ریسینگ',
    date: '۳ خرداد ۱۴۰۴',
    price: 3650000,
    status: 'delivered',
    statusLabel: 'تحویل شده',
    items: 1,
  },
];

const statusColor = {
  delivered: '#38A169',
  shipping: ACCENT_BLUE,
  processing: ACCENT_ORANGE,
  cancelled: '#E53E3E',
};

const statusIcon = {
  delivered: TickCircle,
  shipping: TruckFast,
  processing: Clock,
  cancelled: CloseCircle,
};

const filters = [
  { key: 'all', label: 'همه' },
  { key: 'processing', label: 'در حال پردازش' },
  { key: 'shipping', label: 'در حال ارسال' },
  { key: 'delivered', label: 'تحویل شده' },
  { key: 'cancelled', label: 'لغو شده' },
];

// ==================== Components ====================
function OrderCard({ order }) {
  const StatusIcon = statusIcon[order.status];

  return (
    <Box sx={{ ...neoSoft, p: 2.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 0.8 }}>{order.title}</Typography>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>کد: {order.id}</Typography>
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{order.date}</Typography>
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{ConvertToPersianDigit(order.items)} کالا</Typography>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" gap={2} flexShrink={0}>
          <Chip
            icon={<StatusIcon size={14} variant="Bold" color={statusColor[order.status]} style={{ marginRight: '8px' }} />}
            label={order.statusLabel}
            size="small"
            sx={{
              bgcolor: alpha(statusColor[order.status], 0.1),
              color: statusColor[order.status],
              fontWeight: 600,
              fontSize: 12,
              height: 30,
              borderRadius: '8px',
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
              color: INK,
              whiteSpace: 'nowrap',
            }}
          >
            {ConvertToPersianDigit(order.price.toLocaleString())}
            <Typography component="span" sx={{ fontSize: 11.5, color: INK_SOFT, mr: 0.4 }}>
              تومان
            </Typography>
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${alpha(INK, 0.06)}` }}>
        <Button
          component={Link}
          href={`/user/orders/${order.id}`}
          size="small"
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: ACCENT_ORANGE,
            px: 1.5,
            borderRadius: '10px',
            '&:hover': { bgcolor: alpha(ACCENT_ORANGE, 0.08) },
          }}
        >
          جزئیات سفارش
        </Button>
        {order.status === 'delivered' && (
          <Button
            size="small"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: INK,
              px: 1.5,
              borderRadius: '10px',
              ...neoSoft,
              boxShadow: `3px 3px 8px ${SHADOW_DARK}, -3px -3px 8px ${SHADOW_LIGHT}`,
              '&:hover': {
                boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
              },
            }}
          >
            خرید مجدد
          </Button>
        )}
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredOrders = activeFilter === 'all' ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Box width="100%">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(ACCENT_ORANGE, 0.12),
                    color: ACCENT_ORANGE,
                  }}
                >
                  <Bag2 size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>سفارش‌های من</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>{ConvertToPersianDigit(orders.length)} سفارش ثبت‌شده</Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                href="/user/dashboard"
                endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />}
                sx={{
                  px: 2,
                  py: 1,
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
                بازگشت
              </Button>
            </Stack>
          </Box>

          {/* Filters */}
          <Box sx={{ ...neoSoft, p: 1.5, mb: 3, overflowX: 'auto' }}>
            <Stack direction="row" gap={1} sx={{ minWidth: 'max-content' }}>
              {filters.map((f) => (
                <Button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  sx={{
                    px: 2.2,
                    py: 1,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: 13,
                    color: activeFilter === f.key ? '#fff' : INK,
                    bgcolor: activeFilter === f.key ? ACCENT_ORANGE : 'transparent',
                    boxShadow: activeFilter === f.key ? `4px 4px 10px ${SHADOW_DARK}` : 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: activeFilter === f.key ? '#E06B10' : alpha(ACCENT_ORANGE, 0.08),
                    },
                  }}
                >
                  {f.label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Box
              sx={{
                ...neoRaised,
                p: 6,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(INK_SOFT, 0.1),
                  color: INK_SOFT,
                  mx: 'auto',
                  mb: 2.5,
                }}
              >
                <Bag2 size={36} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>سفارشی یافت نشد</Typography>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 1, mb: 3 }}>هنوز سفارشی با این وضعیت ثبت نکرده‌اید</Typography>
              <Button
                component={Link}
                href="/"
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#fff',
                  bgcolor: ACCENT_ORANGE,
                  boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
                  '&:hover': { bgcolor: '#E06B10' },
                }}
              >
                مشاهده محصولات
              </Button>
            </Box>
          ) : (
            <Stack gap={2}>
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
