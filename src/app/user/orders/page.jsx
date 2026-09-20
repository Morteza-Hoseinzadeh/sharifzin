'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Grid, Button, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Bag2, ArrowLeft2, Clock, TickCircle, TruckFast, CloseCircle } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import axiosInstance from '@/utils/API/axiosInstance';

const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };

const statusLables = {
  pending_payment: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  pickup_dispatched: 'در حال برداشتن زین',
  picked_up: 'برداشته شده',
  at_shop: 'در مغازه',
  inspecting: 'در حال بررسی',
  ready_to_ship: 'آماده ارسال',
  return_dispatched: 'در حال ارسال بازگشت',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

const statusColor = {
  pending_payment: '#F57C1F',
  paid: '#2F9E44',
  pickup_dispatched: '#3B82F6',
  picked_up: '#9C27B0',
  at_shop: '#FF9800',
  inspecting: '#2196F3',
  ready_to_ship: '#795548',
  return_dispatched: '#9C27B0',
  delivered: '#4CAF50',
  cancelled: '#F44336',
};

const statusIcon = {
  pending_payment: Clock,
  paid: TickCircle,
  pickup_dispatched: TruckFast,
  picked_up: TruckFast,
  at_shop: TickCircle,
  inspecting: TickCircle,
  ready_to_ship: TruckFast,
  return_dispatched: TruckFast,
  delivered: TickCircle,
  cancelled: CloseCircle,
};

function OrderCard({ order }) {
  const statusInfo = statusColor[order.status] ? { label: order.status, color: statusColor[order.status], icon: statusIcon[order.status] } : { label: order.status, color: '#9E9E9E', icon: Clock };

  return (
    <Box sx={{ ...neoSoft, p: 2.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 0.8 }}>{order.full_name}</Typography>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>کد: {order.order_code}</Typography>
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{new Date(order.created_at).toLocaleDateString('fa-IR')}</Typography>
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>{order.items_count} کالا</Typography>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" gap={2} flexShrink={0}>
          <Chip icon={<statusInfo.icon size={14} color={statusInfo.color} style={{ marginRight: '8px' }} />} label={statusLables[order?.status]} size="small" sx={{ bgcolor: alpha(statusInfo.color, 0.1), color: statusInfo.color, fontWeight: 600, fontSize: 12, height: 30, borderRadius: '8px' }} />
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>{ConvertToPersianDigit(order.payable_amount)} تومان</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${alpha(INK, 0.06)}` }}>
        <Button
          component={Link}
          href={`/user/orders/${order.order_code}`}
          size="small"
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: ACCENT_ORANGE,
            px: 1.5,
            borderRadius: '10px',
            '&:hover': { bgcolor: alpha(ACCENT_ORANGE, 0.08) },
          }}>
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
              '&:hover': { boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}` },
            }}>
            خرید مجدد
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getCartToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cartToken');
  };

  const getUserOrders = async (cartToken) => {
    const { data } = await axiosInstance.get(`/api/v1/orders/${cartToken}/my-orders`, {
      headers: { 'x-cart-token': cartToken },
    });
    return data;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getCartToken();
      const { data } = await getUserOrders(token);
      setOrders(data || data.orders || []);
    } catch (err) {
      setError('خطا در دریافت سفارش‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box sx={{ width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ACCENT_ORANGE, 0.12), color: ACCENT_ORANGE }}>
                  <Bag2 size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>سفارش‌های من</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>{loading ? '...' : `${orders.length} سفارش`}</Typography>
                </Box>
              </Stack>

              <Button component={Link} href="/user/dashboard" endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />} sx={{ px: 2, py: 1, borderRadius: '12px', fontWeight: 600, fontSize: 13, color: INK, ...neoSoft }}>
                بازگشت
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : orders.length === 0 ? (
            <Box sx={{ ...neoRaised, p: 6, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>هیچ سفارشی ثبت نشده است</Typography>
              <Button component={Link} href="/" sx={{ mt: 2, px: 3, py: 1.3, borderRadius: '12px', bgcolor: ACCENT_ORANGE, color: '#fff' }}>
                مشاهده محصولات
              </Button>
            </Box>
          ) : (
            <Stack gap={2}>
              {orders.map((order) => (
                <OrderCard key={order.order_code} order={order} />
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
