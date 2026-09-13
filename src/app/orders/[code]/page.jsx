'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, CircularProgress, Stepper, Step, StepLabel, Divider, Button, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Box1, TruckFast, Shop, TickCircle, Location, Call, ArrowRight2 } from 'iconsax-reactjs';
import { useParams, useRouter } from 'next/navigation';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import axiosInstance from '@/utils/API/axiosInstance';

const ACCENT = '#F57C1F';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const SURFACE = '#F0F4F8';
const BG = '#E8ECF1';
const GREEN = '#2F9E44';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';

const STATUS_FLOW = [
  { key: 'paid', label: 'ثبت سفارش', icon: Box1 },
  { key: 'pickup_dispatched', label: 'پیک برای برداشتن زین', icon: TruckFast },
  { key: 'picked_up', label: 'زین تحویل گرفته شد', icon: TruckFast },
  { key: 'at_shop', label: 'رسیدن به مغازه', icon: Shop },
  { key: 'inspecting', label: 'در حال بررسی', icon: Shop },
  { key: 'ready_to_ship', label: 'آماده ارسال برگشت', icon: Box1 },
  { key: 'return_dispatched', label: 'پیک برگشت به شما', icon: TruckFast },
  { key: 'delivered', label: 'تحویل داده شد', icon: TickCircle },
];

const STATUS_INDEX = {
  pending_payment: 0,
  paid: 0,
  pickup_dispatched: 1,
  picked_up: 2,
  at_shop: 3,
  inspecting: 4,
  ready_to_ship: 5,
  return_dispatched: 6,
  delivered: 7,
  cancelled: -1,
};

export default function OrderTrackingPage() {
  const { code } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data: res } = await axiosInstance.get(`/api/v1/orders/${code}`);
        setData(res);
      } catch (err) {
        setError(err?.response?.data?.message || 'سفارش یافت نشد');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [code]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: ACCENT }} />
      </Box>
    );
  }

  if (error || !data?.order) {
    return (
      <ChildrenLayout>
        <Box sx={{ bgcolor: BG, minHeight: '100vh', py: 8 }}>
          <Container maxWidth="xl">
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'سفارش یافت نشد'}
            </Alert>
            <Button onClick={() => router.push('/products')} sx={{ color: ACCENT }}>
              بازگشت به فروشگاه
            </Button>
          </Container>
        </Box>
      </ChildrenLayout>
    );
  }

  const { order, items } = data;
  const activeStep = STATUS_INDEX[order.status] ?? 0;
  const isCancelled = order.status === 'cancelled';

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 24 }, color: INK }}>پیگیری سفارش</Typography>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 0.5 }}>کد: {order.orderCode}</Typography>
            </Box>
            <Button startIcon={<ArrowRight2 size={16} />} onClick={() => router.push('/products')} sx={{ color: INK_SOFT, fontSize: 13 }}>
              فروشگاه
            </Button>
          </Stack>

          {isCancelled && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              این سفارش لغو شده است.
            </Alert>
          )}

          {/* Stepper */}
          {!isCancelled && (
            <Box sx={{ bgcolor: SURFACE, borderRadius: '22px', p: { xs: 2, md: 3 }, mb: 3, boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`, overflowX: 'auto' }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {STATUS_FLOW.map((s) => (
                  <Step key={s.key}>
                    <StepLabel>{s.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {(order.pickupTrackingCode || order.returnTrackingCode) && (
                <Stack spacing={1} sx={{ mt: 3 }}>
                  {order.pickupTrackingCode && (
                    <Typography sx={{ fontSize: 13, color: INK_SOFT }}>
                      کد رهگیری پیک رفت: <b style={{ color: INK }}>{order.pickupTrackingCode}</b>
                    </Typography>
                  )}
                  {order.returnTrackingCode && (
                    <Typography sx={{ fontSize: 13, color: INK_SOFT }}>
                      کد رهگیری پیک برگشت: <b style={{ color: INK }}>{order.returnTrackingCode}</b>
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          )}

          <Stack spacing={3}>
            {/* آدرس */}
            <Box sx={{ bgcolor: SURFACE, borderRadius: '22px', p: 3, boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 2 }}>اطلاعات تحویل</Typography>
              <Stack spacing={1.2}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography sx={{ fontSize: 13.5, color: INK }}>{order.fullName}</Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <Call size={16} color={INK_SOFT} />
                  <Typography sx={{ fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(order.phone)}</Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="flex-start">
                  <Location size={16} color={INK_SOFT} style={{ marginTop: 2 }} />
                  <Typography sx={{ fontSize: 13.5, color: INK, lineHeight: 1.7 }}>
                    {order.city} — {order.address}
                    {order.addressNote ? ` (${order.addressNote})` : ''}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* آیتم‌ها */}
            <Box sx={{ bgcolor: SURFACE, borderRadius: '22px', p: 3, boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 2 }}>اقلام سفارش</Typography>
              <Stack spacing={2}>
                {items?.map((item) => (
                  <Stack key={item.id} direction="row" gap={2} alignItems="center">
                    <Box sx={{ width: 64, height: 64, borderRadius: '12px', overflow: 'hidden', bgcolor: alpha(ACCENT, 0.08), flexShrink: 0 }}>{item.thumbnail ? <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK }}>{item.title}</Typography>
                      {item.color && <Typography sx={{ fontSize: 12, color: INK_SOFT }}>رنگ: {item.color}</Typography>}
                      <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>
                        {ConvertToPersianDigit(item.quantity)} × {ConvertToPersianDigit(Number(item.unit_price).toLocaleString())} تومان
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2.5, borderColor: alpha(INK, 0.08) }} />

              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>جمع کالاها</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{ConvertToPersianDigit(Number(order.subtotal).toLocaleString())} تومان</Typography>
                </Stack>
                {order.discountAmount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>تخفیف {order.discountCode ? `(${order.discountCode})` : ''}</Typography>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: GREEN }}>{ConvertToPersianDigit(Number(order.discountAmount).toLocaleString())}- تومان</Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: INK }}>مبلغ نهایی</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: INK }}>{ConvertToPersianDigit(Number(order.payableAmount).toLocaleString())} تومان</Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
