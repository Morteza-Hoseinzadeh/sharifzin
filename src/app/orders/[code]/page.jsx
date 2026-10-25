'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, CircularProgress, Stepper, Step, StepLabel, Divider, Button, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TruckFast, Shop, Location, Call, ArrowRight2 } from 'iconsax-reactjs';
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

const neoRaised = {
  bgcolor: SURFACE,
  borderRadius: '22px',
  boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
};

const neoInset = {
  bgcolor: SURFACE,
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// ✅ new: عنوان روش‌های تحویل (مقادیر pickup_method / return_method)
const METHOD_LABELS = {
  in_person: 'تحویل حضوری',
  snapp: 'اسنپ / پیک',
  tipax: 'تیپاکس',
  post: 'پست',
  other: 'سایر روش‌ها',
};

// ترتیب خطی وضعیت‌ها؛ برای تعیین اینکه کدوم مرحله‌ها انجام شده
const STATUS_RANK = ['pending_payment', 'paid', 'pickup_dispatched', 'picked_up', 'at_shop', 'inspecting', 'ready_to_ship', 'return_dispatched', 'delivered'];

// ✅ new: سفارشی که روش تحویل زین داره = محصولش requires_physical_item = 1 بوده
function isPhysicalOrder(order) {
  return Boolean(order?.pickupMethod || order?.returnMethod);
}

// ✅ was: یک مسیر ثابت برای همه‌ی سفارش‌ها (حتی سفارش‌هایی که اصلاً زین نمی‌خواستن).
// حالا مراحل بر اساس نوع سفارش و روش‌های انتخابی مشتری ساخته میشه.
function buildSteps(order) {
  if (!isPhysicalOrder(order)) {
    return [
      { key: 'paid', label: 'ثبت سفارش' },
      { key: 'delivered', label: 'تحویل داده شد' },
    ];
  }

  const steps = [{ key: 'paid', label: 'ثبت سفارش' }];

  if (order.pickupMethod !== 'in_person') {
    steps.push({ key: 'pickup_dispatched', label: 'پیک برای برداشتن زین' }, { key: 'picked_up', label: 'زین تحویل گرفته شد' });
  }

  steps.push({ key: 'at_shop', label: order.pickupMethod === 'in_person' ? 'تحویل زین به مغازه' : 'رسیدن به مغازه' }, { key: 'inspecting', label: 'در حال بررسی' }, { key: 'ready_to_ship', label: order.returnMethod === 'in_person' ? 'آماده تحویل حضوری' : 'آماده ارسال برگشت' });

  if (order.returnMethod !== 'in_person') {
    steps.push({ key: 'return_dispatched', label: 'ارسال زین به شما' });
  }

  steps.push({ key: 'delivered', label: 'تحویل داده شد' });

  return steps;
}

function getActiveStep(order, steps) {
  if (order.status === 'delivered') return steps.length; // همه‌ی مراحل کامل
  const rank = STATUS_RANK.indexOf(order.status);
  if (rank < 0) return 0;

  let active = 0;
  steps.forEach((s, i) => {
    if (STATUS_RANK.indexOf(s.key) <= rank) active = i;
  });
  return active;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

// ✅ new: ردیف «عنوان: مقدار»
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
      <Typography sx={{ fontSize: 13, color: INK_SOFT, flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK, textAlign: 'left', wordBreak: 'break-word' }}>{value}</Typography>
    </Stack>
  );
}

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
  const isCancelled = order.status === 'cancelled';
  const physical = isPhysicalOrder(order);
  const steps = buildSteps(order);
  const activeStep = getActiveStep(order, steps);

  const needsPickup = order.pickupMethod && order.pickupMethod !== 'in_person';
  const needsReturn = order.returnMethod && order.returnMethod !== 'in_person';

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

          {/* ✅ new: پرداخت ناتمام */}
          {order.status === 'pending_payment' && (
            <Alert severity="info" sx={{ mb: 3 }}>
              پرداخت این سفارش هنوز تکمیل نشده است.
            </Alert>
          )}

          {/* ✅ new: راهنمای مرحله‌ی فعلی برای سفارش‌های زین‌دار */}
          {physical && order.status === 'paid' && (
            <Alert severity="info" icon={order.pickupMethod === 'in_person' ? <Shop size={20} /> : <TruckFast size={20} />} sx={{ mb: 3 }}>
              {order.pickupMethod === 'in_person' ? 'پرداخت شما ثبت شد. لطفاً زین خود را به مغازه شریف‌زین تحویل دهید.' : 'پرداخت شما ثبت شد. هماهنگی دریافت زین از آدرس شما به‌زودی انجام می‌شود.'}
            </Alert>
          )}

          {physical && order.status === 'ready_to_ship' && order.returnMethod === 'in_person' && (
            <Alert severity="success" sx={{ mb: 3 }}>
              بررسی زین شما تمام شد و آماده تحویل حضوری در مغازه است.
            </Alert>
          )}

          {/* Stepper */}
          {!isCancelled && (
            <Box sx={{ ...neoRaised, p: { xs: 2, md: 3 }, mb: 3, overflowX: 'auto' }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: steps.length > 4 ? 640 : 'auto' }}>
                {steps.map((s) => (
                  <Step key={s.key}>
                    <StepLabel sx={{ '& .MuiStepLabel-label.Mui-active': { color: ACCENT, fontWeight: 700 } }}>{s.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          <Stack spacing={3}>
            {/* ✅ new: تحویل و دریافت زین - فقط برای سفارش‌های زین‌دار */}
            {physical && (
              <Box sx={{ ...neoRaised, p: 3 }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                  <TruckFast size={20} color={ACCENT} variant="Bold" />
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>تحویل و دریافت زین</Typography>
                </Stack>

                <Stack spacing={2}>
                  <Box sx={{ ...neoInset, p: 2 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: INK, mb: 1.2 }}>۱. رساندن زین به مغازه</Typography>
                    <Stack spacing={0.9}>
                      <InfoRow label="روش" value={METHOD_LABELS[order.pickupMethod] || order.pickupMethod} />
                      {needsPickup && <InfoRow label="آدرس دریافت" value={order.pickupAddress || order.address} />}
                      {needsPickup && <InfoRow label="پیک" value={order.pickupDriverName} />}
                      {needsPickup && <InfoRow label="کد رهگیری" value={order.pickupTrackingCode ? ConvertToPersianDigit(order.pickupTrackingCode) : ''} />}
                      <InfoRow label="رسیدن به مغازه" value={formatDate(order.receivedAtShopAt)} />
                    </Stack>
                    {order.pickupMethod === 'in_person' && !order.receivedAtShopAt && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 1 }}>زین را خودتان به مغازه می‌رسانید.</Typography>}
                  </Box>

                  <Box sx={{ ...neoInset, p: 2 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: INK, mb: 1.2 }}>۲. دریافت زین بعد از بررسی</Typography>
                    <Stack spacing={0.9}>
                      <InfoRow label="روش" value={METHOD_LABELS[order.returnMethod] || order.returnMethod} />
                      {needsReturn && <InfoRow label="آدرس ارسال" value={order.address} />}
                      {needsReturn && <InfoRow label="پیک" value={order.returnDriverName} />}
                      {needsReturn && <InfoRow label="کد رهگیری" value={order.returnTrackingCode ? ConvertToPersianDigit(order.returnTrackingCode) : ''} />}
                      <InfoRow label="زمان ارسال" value={formatDate(order.returnShippedAt)} />
                      <InfoRow label="تحویل نهایی" value={formatDate(order.deliveredAt)} />
                    </Stack>
                    {order.returnMethod === 'in_person' && !order.deliveredAt && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 1 }}>بعد از آماده‌شدن، زین را حضوری از مغازه تحویل می‌گیرید.</Typography>}
                  </Box>
                </Stack>
              </Box>
            )}

            {/* آدرس */}
            <Box sx={{ ...neoRaised, p: 3 }}>
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
            <Box sx={{ ...neoRaised, p: 3 }}>
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
                {/* ✅ new */}
                {order.shippingCost > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>هزینه ارسال</Typography>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{ConvertToPersianDigit(Number(order.shippingCost).toLocaleString())} تومان</Typography>
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
