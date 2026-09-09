'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Stack, Button, Chip, Divider, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight2, TickCircle, TruckFast, Clock, CloseCircle, Location, Call, User, CloseSquare } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '14px', boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}` };

// Full status list from the backend. Order here also defines the linear timeline order.
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

// Linear order (everything except cancelled, which is a terminal branch shown separately).
const STATUS_ORDER = ['pending_payment', 'paid', 'pickup_dispatched', 'picked_up', 'at_shop', 'inspecting', 'ready_to_ship', 'return_dispatched', 'delivered'];

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
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  return STATUS_ORDER.map((key, i) => ({
    status: statusMap[key].title,
    date: i === 0 ? order.createdAt : i <= currentIdx ? order.updatedAt : '',
    done: currentIdx >= 0 && i <= currentIdx,
  }));
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

  const fetchOrder = useCallback(async () => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      // NOTE: adjust base URL / auth headers to match your API setup
      const res = await axiosInstance.get(`/api/v1/orders/${code}`);
      const data = res.data;

      setOrder(data.order);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'خطا در دریافت سفارش');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleOpenStatusModal = () => {
    setSelectedStatus(order.status);
    setStatusError(null);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    if (statusUpdating) return; // don't allow closing mid-request
    setStatusModalOpen(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedStatus || selectedStatus === order.status) {
      setStatusModalOpen(false);
      return;
    }
    setStatusUpdating(true);
    setStatusError(null);
    try {
      // NOTE: adjust endpoint/method/payload shape to match your real API
      const res = await axiosInstance.patch(`/api/v1/admin/orders/${order.id}/status`, {
        status: selectedStatus,
      });
      const updatedOrder = res.data?.order;

      setOrder((prev) => ({
        ...prev,
        status: selectedStatus,
        updatedAt: updatedOrder?.updatedAt || new Date().toISOString(),
      }));
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

  return (
    <AdminLayout>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3.5 }}>
        <Button component={Link} href="/admin/orders" startIcon={<ArrowRight2 size={16} style={{ marginLeft: 4 }} />} sx={{ color: INK, fontWeight: 600, ...neoSoft, px: 2, py: 1, borderRadius: '12px' }}>
          بازگشت
        </Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: INK }}>جزئیات سفارش {order.orderCode}</Typography>
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

          <Box sx={{ ...neoRaised, p: 3 }}>
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
              {Object.entries(statusMap).map(([key, val]) => (
                <Box key={key} sx={{ ...(selectedStatus === key ? neoInset : neoSoft), px: 1.5, py: 0.5, cursor: 'pointer', mb: 2 }} onClick={() => setSelectedStatus(key)}>
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
              ))}
            </Stack>
          </RadioGroup>

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
