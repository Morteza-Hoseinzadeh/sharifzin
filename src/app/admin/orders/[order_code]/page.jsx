'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Stack, Button, Chip, Divider, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, IconButton, InputBase } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight2, TickCircle, TruckFast, Clock, CloseCircle, Location, Call, User, CloseSquare, Shop } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '14px', boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}` };

// Full status list from the backend.
const statusMap = {
  pending_payment: { color: '#F59E0B', title: 'در انتظار پرداخت' },
  paid: { color: '#38A169', title: 'پرداخت شده' },
  pickup_dispatched: { color: ACCENT_ORANGE, title: 'در حال برداشتن زین' },
  picked_up: { color: ACCENT_ORANGE, title: 'برداشته شده' },
  at_shop: { color: ACCENT_ORANGE, title: 'در مغازه' },
  inspecting: { color: ACCENT_ORANGE, title: 'در حال بررسی' },
  ready_to_ship: { color: ACCENT_ORANGE, title: 'آماده ارسال' },
  return_dispatched: { color: ACCENT_ORANGE, title: 'در حال ارسال بازگشت' },
  delivered: { color: ACCENT_ORANGE, title: 'تحویل شده' },
  cancelled: { color: '#EF4444', title: 'لغو شده' },
};

// Linear order used to decide which steps are "done" (cancelled is a separate terminal branch).
const STATUS_ORDER = ['pending_payment', 'paid', 'pickup_dispatched', 'picked_up', 'at_shop', 'inspecting', 'ready_to_ship', 'return_dispatched', 'delivered'];

// ✅ new: عنوان روش‌های تحویل (مقادیر pickup_method / return_method)
const METHOD_LABELS = {
  in_person: 'تحویل حضوری',
  snapp: 'اسنپ / پیک',
  tipax: 'تیپاکس',
  post: 'پست',
  other: 'سایر روش‌ها',
};

// ✅ new: سفارشی که روش تحویل زین داره = سفارش نیازمند تحویل کالای فیزیکی
// (pickup_method / return_method فقط برای محصولات requires_physical_item = 1 ذخیره میشن)
function isPhysicalOrder(order) {
  return Boolean(order?.pickupMethod || order?.returnMethod);
}

// ✅ new: مراحل مرتبط با هر سفارش. سفارش عادی وارد چرخه‌ی زین نمیشه؛ و اگه مشتری
// خودش زین رو میاره/میبره، مراحل پیک مربوط حذف میشن.
function getFlow(order) {
  if (!isPhysicalOrder(order)) return ['pending_payment', 'paid', 'delivered'];

  const flow = ['pending_payment', 'paid'];
  if (order.pickupMethod !== 'in_person') flow.push('pickup_dispatched', 'picked_up');
  flow.push('at_shop', 'inspecting', 'ready_to_ship');
  if (order.returnMethod !== 'in_person') flow.push('return_dispatched');
  flow.push('delivered');
  return flow;
}

// زمان واقعی هر مرحله (از ستون‌های جدید orders)
function dateForStatus(key, order) {
  switch (key) {
    case 'pending_payment':
      return order.createdAt;
    case 'pickup_dispatched':
      return order.pickupRequestedAt;
    case 'picked_up':
      return order.pickedUpAt;
    case 'at_shop':
      return order.receivedAtShopAt;
    case 'ready_to_ship':
      return order.inspectedAt;
    case 'return_dispatched':
      return order.returnShippedAt;
    case 'delivered':
      return order.deliveredAt;
    default:
      return '';
  }
}

function getStatusIcon(key) {
  if (key === 'cancelled') return CloseCircle;
  if (key === 'delivered') return TickCircle;
  if (key === 'pickup_dispatched' || key === 'return_dispatched') return TruckFast;
  return Clock;
}

function buildTimeline(order) {
  if (order.status === 'cancelled') {
    return [
      { status: statusMap.pending_payment.title, date: order.createdAt, done: true },
      { status: statusMap.cancelled.title, date: order.updatedAt, done: true },
    ];
  }

  const currentOrderIdx = STATUS_ORDER.indexOf(order.status);

  return getFlow(order).map((key) => {
    const done = currentOrderIdx >= 0 && STATUS_ORDER.indexOf(key) <= currentOrderIdx;
    // اگه زمان اختصاصی مرحله ثبت نشده ولی مرحله‌ی فعلیه، آخرین به‌روزرسانی رو نشون بده
    const date = dateForStatus(key, order) || (key === order.status ? order.updatedAt : '');
    return { status: statusMap[key].title, date: done ? date : '', done };
  });
}

// گزینه‌های مودال تغییر وضعیت: فقط مراحل مرتبط + لغو (+ وضعیت فعلی اگه توی مسیر نبود)
function getStatusOptions(order) {
  const keys = [...getFlow(order), 'cancelled'];
  if (order.status && !keys.includes(order.status) && statusMap[order.status]) keys.push(order.status);
  return keys;
}

function formatToman(value) {
  const n = Number(value) || 0;
  return ConvertToPersianDigit(n.toLocaleString());
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ✅ new: ردیف کوچک «عنوان: مقدار»
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
      <Typography sx={{ fontSize: 12.5, color: INK_SOFT, flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, textAlign: 'left', wordBreak: 'break-word' }}>{value}</Typography>
    </Stack>
  );
}

// ✅ new: فیلد نئومورفیک کوچک برای مودال
function ModalField({ label, value, onChange, placeholder }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: INK_SOFT, mb: 0.6 }}>{label}</Typography>
      <Box sx={{ ...neoInset, px: 1.5, minHeight: 42, display: 'flex', alignItems: 'center' }}>
        <InputBase fullWidth value={value} onChange={onChange} placeholder={placeholder} sx={{ fontSize: 13.5, color: INK, fontFamily: 'inherit' }} />
      </Box>
    </Box>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const code = params?.order_code;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- status change modal state ---
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState(null);

  // ✅ new: اطلاعات رهگیری که ادمین موقع تغییر وضعیت وارد می‌کنه
  const [pickupDriver, setPickupDriver] = useState('');
  const [pickupTracking, setPickupTracking] = useState('');
  const [returnDriver, setReturnDriver] = useState('');
  const [returnTracking, setReturnTracking] = useState('');

  // silent = true: بدون نمایش اسپینر تمام‌صفحه (برای رفرش بعد از تغییر وضعیت)
  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!code) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/v1/orders/${code}`);
        const data = res.data;

        setOrder(data.order);
        setItems(data.items || []);
      } catch (err) {
        setError(err.message || 'خطا در دریافت سفارش');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleOpenStatusModal = () => {
    setSelectedStatus(order.status);
    setStatusError(null);
    setPickupDriver(order.pickupDriverName || '');
    setPickupTracking(order.pickupTrackingCode || '');
    setReturnDriver(order.returnDriverName || '');
    setReturnTracking(order.returnTrackingCode || '');
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    if (statusUpdating) return;
    setStatusModalOpen(false);
  };

  const handleConfirmStatusChange = async () => {
    const trackingChanged = pickupDriver !== (order.pickupDriverName || '') || pickupTracking !== (order.pickupTrackingCode || '') || returnDriver !== (order.returnDriverName || '') || returnTracking !== (order.returnTrackingCode || '');

    if (!selectedStatus || (selectedStatus === order.status && !trackingChanged)) {
      setStatusModalOpen(false);
      return;
    }
    setStatusUpdating(true);
    setStatusError(null);
    try {
      await axiosInstance.patch(`/api/v1/admin/orders/${order.id}/status`, {
        status: selectedStatus,
        // ✅ new: فقط برای سفارش‌های زین‌دار فرستاده میشن؛ بک‌اند مقدار خالی رو نادیده می‌گیره
        ...(isPhysicalOrder(order) && {
          pickupDriverName: pickupDriver.trim() || null,
          pickupTrackingCode: pickupTracking.trim() || null,
          returnDriverName: returnDriver.trim() || null,
          returnTrackingCode: returnTracking.trim() || null,
        }),
      });

      // بعد از موفقیت، سفارش دوباره خونده میشه تا زمان مراحل و کدهای رهگیری هم به‌روز بشن
      await fetchOrder(true);
      setStatusModalOpen(false);
    } catch (err) {
      setStatusError(err?.response?.data?.message || err.message || 'خطا در تغییر وضعیت سفارش');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Stack alignItems="center" justifyContent="center" sx={{ height: '60vh' }}>
          <CircularProgress sx={{ color: ACCENT_ORANGE }} />
        </Stack>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <Stack alignItems="center" justifyContent="center" gap={2} sx={{ height: '60vh' }}>
          <Typography sx={{ color: INK_SOFT, fontWeight: 600 }}>{error || 'سفارش یافت نشد'}</Typography>
          <Button component={Link} href="/admin/orders" sx={{ ...neoSoft, px: 2, py: 1, borderRadius: '12px', color: INK, fontWeight: 600 }}>
            بازگشت به لیست سفارش‌ها
          </Button>
        </Stack>
      </AdminLayout>
    );
  }

  const st = statusMap[order.status] || statusMap.pending_payment;
  const StatusIcon = getStatusIcon(order.status);
  const timeline = buildTimeline(order);
  const physical = isPhysicalOrder(order);
  const statusOptions = getStatusOptions(order);

  const needsPickup = order.pickupMethod && order.pickupMethod !== 'in_person';
  const needsReturn = order.returnMethod && order.returnMethod !== 'in_person';

  return (
    <AdminLayout>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3.5 }}>
        <Button component={Link} href="/admin/orders" startIcon={<ArrowRight2 size={16} style={{ marginLeft: 4 }} />} sx={{ color: INK, fontWeight: 600, ...neoSoft, px: 2, py: 1, borderRadius: '12px' }}>
          بازگشت
        </Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: INK }}>جزئیات سفارش {order.orderCode}</Typography>
        {/* ✅ new */}
        {physical && <Chip size="small" icon={<TruckFast size={14} color={ACCENT_ORANGE} />} label="نیاز به تحویل زین" sx={{ fontWeight: 700, color: ACCENT_ORANGE, bgcolor: alpha(ACCENT_ORANGE, 0.12), borderRadius: '8px', '& .MuiChip-icon': { mr: 0.5, ml: -0.3 } }} />}
      </Stack>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ ...neoRaised, p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>اقلام سفارش</Typography>
              <Chip icon={<StatusIcon size={14} variant="Bold" color={st.color} style={{ marginRight: 6 }} />} label={st.title} sx={{ bgcolor: alpha(st.color, 0.1), color: st.color, fontWeight: 600, borderRadius: '8px' }} />
            </Stack>

            {items.map((item) => (
              <Box key={item.id} sx={{ ...neoSoft, p: 2, mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1.5}>
                  <Stack direction="row" gap={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                    {item.thumbnail && <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 48, height: 48, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</Typography>
                      <Stack direction="row" gap={1} sx={{ mt: 0.5 }}>
                        {item.color && <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>رنگ: {item.color}</Typography>}
                        <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>تعداد: {ConvertToPersianDigit(item.quantity)}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK, flexShrink: 0 }}>{formatToman(item.unit_price * item.quantity)} تومان</Typography>
                </Stack>
              </Box>
            ))}

            <Divider sx={{ my: 2.5, borderColor: alpha(INK, 0.08) }} />

            <Stack gap={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: INK_SOFT, fontSize: 13.5 }}>جمع اقلام</Typography>
                <Typography sx={{ fontWeight: 600, color: INK }}>{formatToman(order.subtotal)} تومان</Typography>
              </Stack>
              {order.discountAmount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: INK_SOFT, fontSize: 13.5 }}>تخفیف{order.discountCode ? ` (${order.discountCode})` : ''}</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#38A169' }}>-{formatToman(order.discountAmount)} تومان</Typography>
                </Stack>
              )}
              {/* ✅ new */}
              {order.shippingCost > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: INK_SOFT, fontSize: 13.5 }}>هزینه ارسال</Typography>
                  <Typography sx={{ fontWeight: 600, color: INK }}>{formatToman(order.shippingCost)} تومان</Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>مبلغ نهایی</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 16, color: ACCENT_ORANGE }}>{formatToman(order.payableAmount)} تومان</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Timeline */}
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>وضعیت سفارش</Typography>
            <Stack gap={2}>
              {timeline.map((t, i) => (
                <Stack key={i} direction="row" gap={2} alignItems="flex-start">
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: t.done ? alpha('#38A169', 0.15) : alpha(INK, 0.08), color: t.done ? '#38A169' : INK_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.done ? <TickCircle size={16} variant="Bold" /> : <Clock size={16} />}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: t.done ? INK : INK_SOFT }}>{t.status}</Typography>
                    {t.date && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 0.3 }}>{formatDate(t.date)}</Typography>}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Sidebar Info */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ ...neoRaised, p: 3, mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 2 }}>اطلاعات مشتری</Typography>
            <Stack gap={1.5}>
              <Stack direction="row" gap={1.5} alignItems="center">
                <User size={18} color={INK_SOFT} />
                <Typography sx={{ fontSize: 14, color: INK }}>{order.fullName}</Typography>
              </Stack>
              <Stack direction="row" gap={1.5} alignItems="center">
                <Call size={18} color={INK_SOFT} />
                <Typography sx={{ fontSize: 14, color: INK }}>{ConvertToPersianDigit(order.phone)}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ ...neoRaised, p: 3, mb: physical ? 3 : 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 2 }}>آدرس ارسال</Typography>
            <Stack direction="row" gap={1.5} alignItems="flex-start">
              <Location size={18} color={INK_SOFT} style={{ marginTop: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK, mb: 0.5 }}>{order.city}</Typography>
                <Typography sx={{ fontSize: 13, color: INK_SOFT, lineHeight: 1.7 }}>{order.address}</Typography>
                {order.addressNote && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 0.5 }}>توضیحات: {order.addressNote}</Typography>}
                {order.postalCode && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 1 }}>کد پستی: {ConvertToPersianDigit(order.postalCode)}</Typography>}
              </Box>
            </Stack>
          </Box>

          {/* ✅ new: کارت تحویل و دریافت زین - فقط برای سفارش‌های نیازمند تحویل کالا */}
          {physical && (
            <Box sx={{ ...neoRaised, p: 3 }}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <TruckFast size={20} color={ACCENT_ORANGE} variant="Bold" />
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>تحویل و دریافت زین</Typography>
              </Stack>

              {/* مرحله ۱: مشتری -> مغازه */}
              <Box sx={{ ...neoInset, p: 2, mb: 2 }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.2 }}>
                  {order.pickupMethod === 'in_person' ? <Shop size={16} color={INK_SOFT} /> : <TruckFast size={16} color={INK_SOFT} />}
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK }}>۱. رساندن زین به مغازه</Typography>
                </Stack>
                <Stack gap={0.8}>
                  <InfoRow label="روش" value={METHOD_LABELS[order.pickupMethod] || order.pickupMethod} />
                  {needsPickup && <InfoRow label="آدرس مبدا" value={order.pickupAddress || order.address} />}
                  {needsPickup && <InfoRow label="راننده / پیک" value={order.pickupDriverName} />}
                  {needsPickup && <InfoRow label="کد رهگیری" value={order.pickupTrackingCode ? ConvertToPersianDigit(order.pickupTrackingCode) : ''} />}
                  <InfoRow label="دریافت در مغازه" value={formatDate(order.receivedAtShopAt)} />
                </Stack>
                {order.pickupMethod === 'in_person' && <Typography sx={{ fontSize: 12, color: INK_SOFT, mt: 1 }}>مشتری خودش زین را به مغازه می‌آورد.</Typography>}
              </Box>

              {/* مرحله ۲: مغازه -> مشتری */}
              <Box sx={{ ...neoInset, p: 2 }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.2 }}>
                  {order.returnMethod === 'in_person' ? <Shop size={16} color={INK_SOFT} /> : <TruckFast size={16} color={INK_SOFT} />}
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK }}>۲. دریافت زین بعد از بررسی</Typography>
                </Stack>
                <Stack gap={0.8}>
                  <InfoRow label="روش" value={METHOD_LABELS[order.returnMethod] || order.returnMethod} />
                  {needsReturn && <InfoRow label="آدرس مقصد" value={order.address} />}
                  {needsReturn && <InfoRow label="راننده / پیک" value={order.returnDriverName} />}
                  {needsReturn && <InfoRow label="کد رهگیری" value={order.returnTrackingCode ? ConvertToPersianDigit(order.returnTrackingCode) : ''} />}
                  <InfoRow label="ارسال مجدد" value={formatDate(order.returnShippedAt)} />
                  <InfoRow label="تحویل نهایی" value={formatDate(order.deliveredAt)} />
                </Stack>
                {order.returnMethod === 'in_person' && <Typography sx={{ fontSize: 12, color: INK_SOFT, mt: 1 }}>مشتری زین را حضوری از مغازه تحویل می‌گیرد.</Typography>}
              </Box>
            </Box>
          )}

          <Stack gap={1.5} sx={{ mt: 3 }}>
            <Button fullWidth onClick={handleOpenStatusModal} sx={{ py: 1.3, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' } }}>
              تغییر وضعیت سفارش
            </Button>
            <Button fullWidth sx={{ py: 1.3, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: INK, ...neoSoft }}>
              چاپ فاکتور
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* --- Status change modal --- */}
      <Dialog open={statusModalOpen} onClose={handleCloseStatusModal} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '20px', background: SURFACE } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: INK, pb: 1 }}>
          تغییر وضعیت سفارش
          <IconButton size="small" onClick={handleCloseStatusModal} disabled={statusUpdating}>
            <CloseSquare size={18} color={INK_SOFT} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 13, color: INK_SOFT, mb: 2 }}>وضعیت جدید سفارش {order.orderCode} را انتخاب کنید.</Typography>

          <RadioGroup value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <Stack gap={1}>
              {statusOptions.map((key) => {
                const val = statusMap[key];
                return (
                  <Box key={key} sx={{ ...(selectedStatus === key ? neoInset : neoSoft), px: 1.5, py: 0.5, cursor: 'pointer', mb: 1 }} onClick={() => setSelectedStatus(key)}>
                    <FormControlLabel
                      value={key}
                      control={<Radio size="small" sx={{ color: alpha(val.color, 0.5), '&.Mui-checked': { color: val.color } }} />}
                      label={
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: val.color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{val.title}</Typography>
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%', justifyContent: 'flex-start' }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>

          {/* ✅ new: اطلاعات پیک موقع برداشتن زین از مشتری */}
          {physical && needsPickup && selectedStatus === 'pickup_dispatched' && (
            <Stack gap={1.5} sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK }}>اطلاعات دریافت زین از مشتری</Typography>
              <ModalField label="نام راننده / پیک" value={pickupDriver} onChange={(e) => setPickupDriver(e.target.value)} placeholder="مثلاً: علی رضایی" />
              <ModalField label="کد رهگیری" value={pickupTracking} onChange={(e) => setPickupTracking(e.target.value)} placeholder="اختیاری" />
            </Stack>
          )}

          {/* ✅ new: اطلاعات پیک/تیپاکس موقع ارسال مجدد زین */}
          {physical && needsReturn && selectedStatus === 'return_dispatched' && (
            <Stack gap={1.5} sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK }}>اطلاعات ارسال زین به مشتری</Typography>
              <ModalField label="نام راننده / پیک" value={returnDriver} onChange={(e) => setReturnDriver(e.target.value)} placeholder="مثلاً: علی رضایی" />
              <ModalField label="کد رهگیری" value={returnTracking} onChange={(e) => setReturnTracking(e.target.value)} placeholder="اختیاری" />
            </Stack>
          )}

          {statusError && <Typography sx={{ fontSize: 12.5, color: '#E53E3E', mt: 1.5 }}>{statusError}</Typography>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleCloseStatusModal} disabled={statusUpdating} sx={{ ...neoSoft, color: INK, fontWeight: 600, px: 2.5, py: 1, borderRadius: '12px' }}>
            انصراف
          </Button>
          <Button onClick={handleConfirmStatusChange} disabled={statusUpdating || !selectedStatus} sx={{ px: 2.5, py: 1, borderRadius: '12px', fontWeight: 600, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' }, '&.Mui-disabled': { bgcolor: alpha(ACCENT_ORANGE, 0.4), color: '#fff' } }}>
            {statusUpdating ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'ثبت تغییر'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
