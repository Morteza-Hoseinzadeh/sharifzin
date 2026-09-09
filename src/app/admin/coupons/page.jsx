'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Box, Typography, Stack, Button, Chip, IconButton, Grid, TextField, Switch, FormControlLabel, MenuItem, CircularProgress, Alert } from '@mui/material';

import { alpha } from '@mui/material/styles';

import { Add, Edit2, Trash, TicketDiscount, CloseCircle, TickCircle, Danger } from 'iconsax-reactjs';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

import AdminLayout from '@/components/admin/AdminLayout';
import Customdialog from '@/components/custom/CustomDialog';

import axiosInstance from '@/utils/API/axiosInstance';

/* =========================================================
   DESIGN SYSTEM
========================================================= */

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const RED = '#E53E3E';
const GREEN = '#38A169';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '22px',
  boxShadow: `8px 8px 18px ${SHADOW_DARK},-8px -8px 18px ${SHADOW_LIGHT}`,
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK},-5px -5px 12px ${SHADOW_LIGHT}`,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: SURFACE,
    color: INK,
    fontSize: 14,
    '& fieldset': { border: 'none' },
    boxShadow: `inset 3px 3px 7px ${SHADOW_DARK},inset -3px -3px 7px ${SHADOW_LIGHT}`,
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: `1px solid ${alpha(ACCENT_ORANGE, 0.35)}` },
  },

  '& .MuiInputLabel-root': { color: INK_SOFT, fontSize: 14 },
  '& .MuiInputLabel-root.Mui-focused': { color: ACCENT_ORANGE },
};

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value) {
  return ConvertToPersianDigit(Number(value || 0).toLocaleString('en-US'));
}

function formatDate(date) {
  if (!date) return 'بدون انقضا';

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return 'نامشخص';
  }

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

function toDateTimeLocal(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (number) => String(number).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/* =========================================================
   MODAL HEADER
========================================================= */

function ModalHeader({ icon, title, subtitle, onClose }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
      <Stack direction="row" gap={1.5} alignItems="center">
        <Box sx={{ width: 48, height: 48, borderRadius: '15px', bgcolor: alpha(ACCENT_ORANGE, 0.1), color: ACCENT_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>{title}</Typography>

          <Typography sx={{ mt: 0.4, fontSize: 13, color: INK_SOFT }}>{subtitle}</Typography>
        </Box>
      </Stack>

      <IconButton onClick={onClose} sx={{ color: INK_SOFT, '&:hover': { color: INK, bgcolor: alpha(INK, 0.04) } }}>
        <CloseCircle size={22} />
      </IconButton>
    </Stack>
  );
}

/* =========================================================
   FORM
========================================================= */

function CouponForm({ mode, coupon, onSubmit, onClose }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    code: coupon?.code || '',
    type: coupon?.type || 'percent',
    value: coupon?.value ?? '',
    min_order_amount: coupon?.min_order_amount ?? '',
    max_uses: coupon?.max_uses ?? '',
    is_active: coupon?.is_active === undefined ? true : Boolean(coupon.is_active),
    expires_at: toDateTimeLocal(coupon?.expires_at),
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!form.code.trim()) {
      setError('لطفاً کد تخفیف را وارد کنید.');
      return;
    }

    if (form.value === '' || Number(form.value) <= 0) {
      setError('مقدار تخفیف باید بیشتر از صفر باشد.');
      return;
    }

    if (form.type === 'percent' && Number(form.value) > 100) {
      setError('درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.');
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        min_order_amount: Number(form.min_order_amount) || 0,
        max_uses: form.max_uses === '' ? null : Number(form.max_uses),
        is_active: form.is_active,
        expires_at: form.expires_at || null,
      });
    } catch (error) {
      setError(error?.response?.data?.message || 'خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} dir="rtl" sx={{ p: { xs: 1, sm: 1.5 } }}>
      <ModalHeader icon={isEdit ? <Edit2 size={22} variant="Bold" /> : <TicketDiscount size={23} variant="Bold" />} title={isEdit ? 'ویرایش کد تخفیف' : 'ساخت کد تخفیف'} subtitle={isEdit ? 'اطلاعات کد تخفیف را ویرایش کنید' : 'یک کد تخفیف جدید ایجاد کنید'} onClose={onClose} />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: 13 }}>
          {error}
        </Alert>
      )}

      <Stack gap={2}>
        {/* CODE */}

        <TextField fullWidth label="کد تخفیف" name="code" value={form.code} onChange={handleChange} placeholder="مثلاً SUMMER1404" required inputProps={{ style: { textTransform: 'uppercase', direction: 'ltr', textAlign: 'left' } }} sx={inputSx} />

        {/* TYPE + VALUE */}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField select fullWidth label="نوع تخفیف" name="type" value={form.type} onChange={handleChange} sx={inputSx}>
              <MenuItem value="percent">درصدی</MenuItem>

              <MenuItem value="flat">مبلغ ثابت</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField fullWidth type="number" label={form.type === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف'} name="value" value={form.value} onChange={handleChange} required inputProps={{ min: 1, max: form.type === 'percent' ? 100 : undefined }} sx={inputSx} />
          </Grid>
        </Grid>

        {/* MIN ORDER */}
        <TextField fullWidth type="number" label="حداقل مبلغ سفارش" name="min_order_amount" value={form.min_order_amount} onChange={handleChange} placeholder="۰ = بدون محدودیت" inputProps={{ min: 0 }} sx={inputSx} />

        {/* MAX USE */}
        <TextField fullWidth type="number" label="حداکثر تعداد استفاده" name="max_uses" value={form.max_uses} onChange={handleChange} placeholder="خالی = نامحدود" inputProps={{ min: 1 }} sx={inputSx} />

        {/* ACTIVE */}
        <Box sx={{ ...neoSoft, p: 1.5 }}>
          <FormControlLabel
            sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
            label={
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: INK }}>فعال بودن کد</Typography>
                <Typography sx={{ fontSize: 11.5, color: INK_SOFT, mt: 0.3 }}>کد در فروشگاه قابل استفاده باشد</Typography>
              </Box>
            }
            labelPlacement="start"
            control={<Switch checked={form.is_active} onChange={handleChange} name="is_active" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: ACCENT_ORANGE }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ACCENT_ORANGE } }} />}
          />
        </Box>
      </Stack>

      {/* ACTIONS */}

      <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: 100, borderRadius: '12px', color: INK_SOFT, fontWeight: 600 }}>
          انصراف
        </Button>

        <Button type="submit" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <TickCircle size={17} />} sx={{ minWidth: 140, px: 2.2, py: 1.1, borderRadius: '12px', color: '#fff', bgcolor: ACCENT_ORANGE, fontWeight: 700, boxShadow: `4px 4px 12px${alpha(ACCENT_ORANGE, 0.28)}`, '&:hover': { bgcolor: '#E06B10' } }}>
          {loading ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ساخت کد تخفیف'}
        </Button>
      </Stack>
    </Box>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteCouponForm({ coupon, onDelete, onClose }) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  async function handleDelete() {
    try {
      setLoading(true);

      setError('');

      await onDelete();
    } catch (error) {
      setError(error?.response?.data?.message || 'خطا در حذف کد تخفیف');

      setLoading(false);
    }
  }

  return (
    <Box dir="rtl" sx={{ p: { xs: 1, sm: 1.5 } }}>
      <ModalHeader icon={<Danger size={23} variant="Bold" />} title="حذف کد تخفیف" subtitle="این عملیات قابل بازگشت نیست" onClose={onClose} />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: 13 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ ...neoSoft, p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ width: 46, height: 46, borderRadius: '13px', bgcolor: alpha(ACCENT_ORANGE, 0.1), color: ACCENT_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TicketDiscount size={22} variant="Bold" />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: INK, direction: 'ltr', textAlign: 'right' }}>{coupon?.code}</Typography>

            <Typography sx={{ mt: 0.3, fontSize: 12, color: INK_SOFT }}>{coupon?.type === 'percent' ? `${formatNumber(coupon.value)}٪ تخفیف` : `${formatNumber(coupon.value)} تومان تخفیف`}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderRadius: '14px', bgcolor: alpha(RED, 0.07), border: `1px solid ${alpha(RED, 0.12)}` }}>
        <Typography sx={{ fontSize: 13, lineHeight: 1.9, color: INK }}>
          آیا از حذف این کد تخفیف مطمئن هستید؟
          <br />
          <strong>این عملیات قابل بازگشت نیست.</strong>
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: 100, borderRadius: '12px', color: INK_SOFT, fontWeight: 600 }}>
          انصراف
        </Button>

        <Button onClick={handleDelete} disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Trash size={17} />} sx={{ minWidth: 125, px: 2.2, py: 1.1, borderRadius: '12px', color: '#fff', bgcolor: RED, fontWeight: 700, boxShadow: `4px 4px 12px${alpha(RED, 0.25)}`, '&:hover': { bgcolor: '#C53030' } }}>
          {loading ? 'در حال حذف...' : 'حذف کد تخفیف'}
        </Button>
      </Stack>
    </Box>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState('');

  const [modal, setModal] = useState({ open: false, mode: null, couponId: null });

  /* =======================================================
     FETCH
  ======================================================= */

  async function fetchCoupons() {
    try {
      setLoading(true);

      setPageError('');

      const res = await axiosInstance.get('/api/v1/admin/discount-codes');

      setCoupons(res.data?.data || []);
    } catch (error) {
      console.error('FETCH COUPONS ERROR:', error);

      setPageError(error?.response?.data?.message || 'خطا در دریافت کدهای تخفیف');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* =======================================================
     SELECTED COUPON
  ======================================================= */

  const selectedCoupon = useMemo(() => {
    return coupons.find((coupon) => coupon.id === modal.couponId);
  }, [coupons, modal.couponId]);

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeModal() {
    setModal({ open: false, mode: null, couponId: null });
  }

  /* =======================================================
     CREATE
  ======================================================= */

  async function handleCreate(payload) {
    await axiosInstance.post('/api/v1/admin/discount-codes', payload);

    await fetchCoupons();

    closeModal();
  }

  /* =======================================================
     EDIT
  ======================================================= */

  async function handleEdit(payload) {
    await axiosInstance.patch(`/api/v1/admin/discount-codes/${selectedCoupon.id}`, payload);

    await fetchCoupons();

    closeModal();
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete() {
    await axiosInstance.delete(`/api/v1/admin/discount-codes/${selectedCoupon.id}`);

    await fetchCoupons();

    closeModal();
  }

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  function openCreate() {
    setModal({ open: true, mode: 'create', couponId: null });
  }

  function openEdit(id) {
    setModal({ open: true, mode: 'edit', couponId: id });
  }

  function openDelete(id) {
    setModal({ open: true, mode: 'delete', couponId: id });
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AdminLayout>
      {/* HEADER */}

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>کدهای تخفیف</Typography>

          <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{formatNumber(coupons.length)} کد تخفیف</Typography>
        </Box>

        <Button onClick={openCreate} startIcon={<Add size={18} style={{ marginLeft: 4 }} />} sx={{ px: 2.5, py: 1.2, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' } }}>
          ساخت کد تخفیف
        </Button>
      </Stack>

      {/* ERROR */}

      {pageError && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: '14px' }}>
          {pageError}
        </Alert>
      )}

      {/* LOADING */}

      {loading ? (
        <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={32} sx={{ color: ACCENT_ORANGE }} />
        </Box>
      ) : coupons.length === 0 ? (
        /* EMPTY */

        <Box sx={{ ...neoRaised, p: 6, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '18px', bgcolor: alpha(ACCENT_ORANGE, 0.1), color: ACCENT_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TicketDiscount size={30} variant="Bold" />
          </Box>

          <Typography sx={{ fontWeight: 800, color: INK, fontSize: 17 }}>هنوز کد تخفیفی ایجاد نشده</Typography>

          <Typography sx={{ mt: 0.7, color: INK_SOFT, fontSize: 13 }}>اولین کد تخفیف خود را ایجاد کنید.</Typography>
        </Box>
      ) : (
        /* GRID */

        <Grid container spacing={2.5}>
          {coupons.map((coupon) => {
            const active = Boolean(coupon.is_active);

            const expired = coupon.expires_at && new Date(coupon.expires_at) < new Date();

            const status = !active ? 'inactive' : expired ? 'expired' : 'active';

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={coupon.id}>
                <Box sx={{ ...neoRaised, p: 2.5 }}>
                  {/* TOP */}

                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha(ACCENT_ORANGE, 0.12), color: ACCENT_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TicketDiscount size={22} variant="Bold" />
                    </Box>

                    <Chip label={status === 'active' ? 'فعال' : status === 'expired' ? 'منقضی' : 'غیرفعال'} size="small" sx={{ bgcolor: alpha(status === 'active' ? GREEN : RED, 0.1), color: status === 'active' ? GREEN : RED, fontWeight: 600, fontSize: 11.5, height: 26, borderRadius: '8px' }} />
                  </Stack>

                  {/* CODE */}

                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK, letterSpacing: 1, direction: 'ltr', textAlign: 'right' }}>{coupon.code}</Typography>

                  {/* VALUE */}

                  <Typography sx={{ fontSize: 14, color: ACCENT_ORANGE, fontWeight: 700, mt: 0.5 }}>{coupon.type === 'percent' ? `${formatNumber(coupon.value)}٪ تخفیف` : `${formatNumber(coupon.value)} تومان تخفیف`}</Typography>

                  {/* INFO */}

                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>
                      استفاده: {formatNumber(coupon.used_count)} / {coupon.max_uses ? formatNumber(coupon.max_uses) : '∞'}
                    </Typography>

                    <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>انقضا: {formatDate(coupon.expires_at)}</Typography>
                  </Stack>

                  {/* MIN ORDER */}

                  {Number(coupon.min_order_amount) > 0 && <Typography sx={{ mt: 1, fontSize: 11.5, color: INK_SOFT }}>حداقل سفارش: {formatNumber(coupon.min_order_amount)} تومان</Typography>}

                  {/* ACTIONS */}

                  <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                    <IconButton size="small" onClick={() => openEdit(coupon.id)} sx={{ width: 36, height: 36 }}>
                      <Edit2 size={16} color={ACCENT_ORANGE} />
                    </IconButton>

                    <IconButton size="small" onClick={() => openDelete(coupon.id)} sx={{ width: 36, height: 36 }}>
                      <Trash size={16} color={RED} />
                    </IconButton>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* =====================================================
          MODAL
      ====================================================== */}

      <Customdialog open={modal.open} onClose={closeModal}>
        {modal.mode === 'create' && <CouponForm mode="create" onSubmit={handleCreate} onClose={closeModal} />}

        {modal.mode === 'edit' && selectedCoupon && <CouponForm mode="edit" coupon={selectedCoupon} onSubmit={handleEdit} onClose={closeModal} />}

        {modal.mode === 'delete' && selectedCoupon && <DeleteCouponForm coupon={selectedCoupon} onDelete={handleDelete} onClose={closeModal} />}
      </Customdialog>
    </AdminLayout>
  );
}
