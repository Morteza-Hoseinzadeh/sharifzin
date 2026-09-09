'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Grid, Button, Chip, LinearProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Bag2, Profile2User, MoneyRecive, Box1, ArrowUp, ArrowDown, TickCircle, TruckFast, Clock, Convert } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';

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

const statusMap = {
  pending_payment: { color: '#F59E0B', icon: TickCircle, label: 'در انتظار پرداخت' },
  paid: { color: '#38A169', icon: TickCircle, label: 'پرداخت شده' },
  pickup_dispatched: { color: ACCENT_ORANGE, icon: TickCircle, label: 'در حال برداشتن زین' },
  picked_up: { color: ACCENT_ORANGE, icon: TickCircle, label: 'برداشته شده' },
  at_shop: { color: ACCENT_ORANGE, icon: TickCircle, label: 'در مغازه' },
  inspecting: { color: ACCENT_ORANGE, icon: TickCircle, label: 'در حال بررسی' },
  ready_to_ship: { color: ACCENT_ORANGE, icon: TickCircle, label: 'آماده ارسال' },
  return_dispatched: { color: ACCENT_ORANGE, icon: TickCircle, label: 'در حال ارسال بازگشت' },
  delivered: { color: ACCENT_ORANGE, icon: TickCircle, label: 'تحویل شده' },
  cancelled: { color: '#EF4444', icon: TickCircle, label: 'لغو شده' },
};

const statusIcons = {
  paid: TickCircle,
  pending: Clock,
  processing: Clock,
  shipping: TruckFast,
  pickup_dispatched: TruckFast,
  delivered: TickCircle,
  returned: ArrowDown,
  cancelled: ArrowDown,
};

const statusColor = {
  paid: '#38A169',
  pending: '#F59E0B',
  processing: '#F59E0B',
  shipping: ACCENT_BLUE,
  pickup_dispatched: ACCENT_BLUE,
  delivered: '#38A169',
  returned: '#EF4444',
  cancelled: '#EF4444',
};

function OrderCard({ order }) {
  const Icon = statusIcons[order?.status];
  const statusInfo = statusMap[order?.status] || {
    label: statusLables[order?.status] || order?.status,
    color: statusColor[order?.status] || '#9E9E9E',
    icon: Icon,
  };

  return (
    <Box sx={{ ...neoSoft, p: 2.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 0.8 }}>{order?.full_name}</Typography>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>کد: {order?.order_code}</Typography>
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{new Date(order?.created_at).toLocaleDateString('fa-IR')}</Typography>
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{order?.items_count || 1} کالا</Typography>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" gap={2} flexShrink={0}>
          <Chip icon={<statusInfo.icon size={14} color={statusInfo.color} style={{ marginRight: '8px' }} />} label={statusInfo.label} size="small" sx={{ bgcolor: alpha(statusInfo.color, 0.1), color: statusInfo.color, fontWeight: 600, fontSize: 12, height: 30, borderRadius: '8px' }} />
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>{ConvertToPersianDigit(order?.payable_amount)} تومان</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${alpha(INK, 0.06)}` }}>
        <Button component={Link} href={`/orders/${order?.order_code}`} size="small" sx={{ fontSize: 13, fontWeight: 600, color: ACCENT_ORANGE, px: 1.5, borderRadius: '10px', '&:hover': { bgcolor: alpha(ACCENT_ORANGE, 0.08) } }}>
          جزئیات سفارش
        </Button>
        {order?.status === 'delivered' && (
          <Button size="small" sx={{ fontSize: 13, fontWeight: 600, color: INK, px: 1.5, borderRadius: '10px', ...neoSoft, boxShadow: `3px 3px 8px ${SHADOW_DARK}, -3px -3px 8px ${SHADOW_LIGHT}`, '&:hover': { boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}` } }}>
            خرید مجدد
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getAdminDashboard = async () => {
      try {
        const { data } = await axiosInstance.get('/api/v1/admin/dashboard');
        setData(data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const getAllOrders = async () => {
      try {
        const { data } = await axiosInstance.get('/api/v1/admin/orders');
        setOrders(data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAdminDashboard();
    getAllOrders();
  }, []);

  const stats = [
    { title: 'فروش امروز', value: data?.todaySales?.toLocaleString('fa-IR'), suffix: 'تومان', change: '', up: true, icon: MoneyRecive, color: '#38A169' },
    { title: 'سفارش‌های جدید', value: ConvertToPersianDigit(data?.newOrders), change: '', up: true, icon: Bag2, color: ACCENT_ORANGE },
    { title: 'کاربران فعال', value: ConvertToPersianDigit(data?.activeUsers), change: '', up: true, icon: Profile2User, color: ACCENT_BLUE },
    { title: 'محصولات', value: ConvertToPersianDigit(data?.totalProducts), change: '', up: true, icon: Box1, color: '#805AD5' },
  ];

  return (
    <AdminLayout>
      <Box width={'100%'}>
        {/* Header */}
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} sx={{ mb: 3.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>داشبورد مدیریت</Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>خلاصه وضعیت فروشگاه شریف‌زین</Typography>
          </Box>
          <Box>
            <Button component={Link} href="/" sx={{ fontSize: 15, fontWeight: 600, color: ACCENT_ORANGE, px: 2 }}>
              بازگشت به خانه
            </Button>
          </Box>
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
                    </Box>
                    <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: alpha(item.color, 0.12), color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Grid size={12}>
            <Box sx={{ ...neoRaised, p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>سفارش‌های اخیر</Typography>
                <Button component={Link} href="/admin/orders" sx={{ fontSize: 13, fontWeight: 600, color: ACCENT_ORANGE, px: 0 }}>
                  مشاهده همه
                </Button>
              </Stack>

              <Stack gap={1.5}>
                {orders.map((order) => (
                  <OrderCard key={order?.id} order={order} />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
