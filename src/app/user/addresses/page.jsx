'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, InputBase, CircularProgress, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Location, ArrowLeft2, Add, Edit2, Trash, TickCircle, Home2, Building } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import axiosInstance from '@/utils/API/axiosInstance';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
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

const neoInset = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// ==================== NeoField با InputBase ====================
function NeoField({ label, value, onChange, placeholder, multiline = false, minRows = 1, required = false }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK_SOFT, mb: 1, pr: 0.5 }}>
        {label}
        {required && (
          <Box component="span" sx={{ color: ACCENT_ORANGE, mr: 0.3 }}>
            *
          </Box>
        )}
      </Typography>

      <Box
        sx={{
          ...neoInset,
          px: 2,
          py: multiline ? 1.5 : 0,
          minHeight: multiline ? 'auto' : 48,
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
        }}
      >
        <InputBase
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          multiline={multiline}
          minRows={minRows}
          fullWidth
          sx={{
            fontSize: 14,
            color: INK,
            fontFamily: 'inherit',
            '& input::placeholder, & textarea::placeholder': {
              color: INK_SOFT,
              opacity: 0.85,
            },
          }}
        />
      </Box>
    </Box>
  );
}

// ==================== Address Card ====================
function AddressCard({ address, onSetDefault, onEdit, onDelete }) {
  return (
    <Box
      sx={{
        ...neoSoft,
        p: 2.5,
        position: 'relative',
        border: address.is_default ? `2px solid ${alpha(ACCENT_ORANGE, 0.4)}` : '2px solid transparent',
      }}
    >
      {address.is_default === 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            px: 1.5,
            py: 0.4,
            borderRadius: '8px',
            bgcolor: alpha(ACCENT_ORANGE, 0.12),
            color: ACCENT_ORANGE,
            fontSize: 11.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <TickCircle size={14} variant="Bold" />
          پیش‌فرض
        </Box>
      )}

      <Stack direction="row" alignItems="flex-start" gap={1.8} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha('#38A169', 0.12),
            color: '#38A169',
            flexShrink: 0,
          }}
        >
          {address.title === 'منزل' ? <Home2 size={20} variant="Bold" /> : <Building size={20} variant="Bold" />}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>{address.title}</Typography>
          <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.3 }}>
            {address.receiver} • {address.phone}
          </Typography>
        </Box>
      </Stack>

      <Typography sx={{ fontSize: 13.5, color: INK, lineHeight: 1.7, mb: 1.5 }}>
        {address.province}، {address.city}، {address.address}
      </Typography>

      {address.postal_code && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 2 }}>کد پستی: {ConvertToPersianDigit(address.postal_code)}</Typography>}

      <Stack direction="row" gap={1} flexWrap="wrap">
        {!address.is_default && (
          <Button
            size="small"
            onClick={() => onSetDefault(address.id)}
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              color: ACCENT_ORANGE,
              px: 1.5,
              borderRadius: '10px',
              '&:hover': { bgcolor: alpha(ACCENT_ORANGE, 0.08) },
            }}
          >
            تنظیم به عنوان پیش‌فرض
          </Button>
        )}
        <Button
          size="small"
          startIcon={<Edit2 size={14} style={{ marginLeft: '8px' }} />}
          onClick={() => onEdit(address)}
          sx={{
            fontSize: 12.5,
            fontWeight: 600,
            color: INK,
            px: 1.5,
            borderRadius: '10px',
            ...neoSoft,
          }}
        >
          ویرایش
        </Button>
        <IconButton size="small" onClick={() => onDelete(address.id)} sx={{ color: '#E53E3E', borderRadius: '10px', ...neoSoft }}>
          <Trash size={16} />
        </IconButton>
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: 'منزل',
    receiver: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    address: '',
    postalCode: '',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/v1/user/addresses');
      setAddresses(data.data || []);
    } catch (err) {
      setError('خطا در دریافت آدرس‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetDefault = async (id) => {
    try {
      await axiosInstance.patch(`/api/v1/user/addresses/${id}/default`);
      fetchAddresses();
    } catch (err) {
      alert('خطا در تنظیم آدرس پیش‌فرض');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این آدرس مطمئن هستید؟')) return;
    try {
      await axiosInstance.delete(`/api/v1/user/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      alert('خطا در حذف آدرس');
    }
  };

  const handleEdit = (address) => {
    setEditing(address);
    setForm({
      title: address.title || 'منزل',
      receiver: address.receiver || '',
      phone: address.phone || '',
      province: address.province || 'تهران',
      city: address.city || 'تهران',
      address: address.address || '',
      postalCode: address.postal_code || '',
      isDefault: !!address.is_default,
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({
      title: 'منزل',
      receiver: '',
      phone: '',
      province: 'تهران',
      city: 'تهران',
      address: '',
      postalCode: '',
      isDefault: false,
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!form.receiver.trim() || !form.phone.trim() || !form.address.trim()) {
      alert('نام گیرنده، شماره تماس و آدرس الزامی است');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await axiosInstance.put(`/api/v1/user/addresses/${editing.id}`, form);
      } else {
        await axiosInstance.post('/api/v1/user/addresses', form);
      }
      setOpenDialog(false);
      fetchAddresses();
    } catch (err) {
      alert(err?.response?.data?.message || 'خطا در ذخیره آدرس');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Box width="100%">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box sx={{ width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#38A169', 0.12), color: '#38A169' }}>
                  <Location size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>آدرس‌های من</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>{loading ? '...' : `${ConvertToPersianDigit(addresses.length)} آدرس ثبت‌شده`}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" gap={1.5}>
                <Button component={Link} href="/user/dashboard" endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />} sx={{ px: 2, py: 1, borderRadius: '12px', fontWeight: 600, fontSize: 13, color: INK, ...neoSoft }}>
                  بازگشت
                </Button>
                <Button startIcon={<Add size={18} style={{ marginLeft: '8px' }} />} onClick={handleAdd} sx={{ px: 2.5, py: 1.1, borderRadius: '12px', fontWeight: 600, fontSize: 13.5, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' } }}>
                  آدرس جدید
                </Button>
              </Stack>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Address List */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : addresses.length === 0 ? (
            <Box sx={{ ...neoRaised, p: 6, textAlign: 'center' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(INK_SOFT, 0.1), color: INK_SOFT, mx: 'auto', mb: 2.5 }}>
                <Location size={36} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>آدرسی ثبت نشده</Typography>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 1, mb: 3 }}>برای ثبت سفارش، حداقل یک آدرس اضافه کنید</Typography>
              <Button startIcon={<Add size={18} style={{ marginLeft: '8px' }} />} onClick={handleAdd} sx={{ px: 3, py: 1.3, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: '#fff', bgcolor: ACCENT_ORANGE }}>
                افزودن آدرس
              </Button>
            </Box>
          ) : (
            <Stack gap={2}>
              {addresses.map((addr) => (
                <AddressCard key={addr.id} address={addr} onSetDefault={handleSetDefault} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Dialog افزودن / ویرایش */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { ...neoRaised, borderRadius: '22px', bgcolor: SURFACE } }}>
        <DialogTitle sx={{ fontWeight: 800, color: INK }}>{editing ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</DialogTitle>
        <DialogContent>
          <Stack gap={2.2} sx={{ mt: 1 }}>
            <NeoField label="عنوان آدرس (مثلاً منزل یا محل کار)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="منزل" />
            <NeoField label="نام گیرنده" value={form.receiver} onChange={(e) => setForm({ ...form, receiver: e.target.value })} placeholder="مرتضی حسین زاده" required />
            <NeoField label="شماره تماس" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0912xxxxxxx" required />
            <Stack direction="row" gap={2}>
              <Box sx={{ flex: 1 }}>
                <NeoField label="استان" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} placeholder="تهران" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <NeoField label="شهر" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="تهران" />
              </Box>
            </Stack>
            <NeoField label="آدرس کامل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="خیابان، کوچه، پلاک، واحد..." multiline minRows={3} required />
            <NeoField label="کد پستی" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="۱۰ رقم" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: INK_SOFT, fontWeight: 600 }}>
            انصراف
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: ACCENT_ORANGE, borderRadius: '12px', fontWeight: 600, px: 3, boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' } }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
    </ChildrenLayout>
  );
}
