'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Radio } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Location, ArrowLeft2, Add, Edit2, Trash, TickCircle, Home2, Building } from 'iconsax-reactjs';
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
const initialAddresses = [
  {
    id: 1,
    title: 'منزل',
    receiver: 'علی رضایی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    province: 'تهران',
    city: 'تهران',
    address: 'خیابان ولیعصر، بالاتر از پارک ساعی، کوچه آفتاب، پلاک ۱۲، واحد ۳',
    postalCode: '۱۹۶۵۶۴۳۲۱۰',
    isDefault: true,
  },
  {
    id: 2,
    title: 'محل کار',
    receiver: 'علی رضایی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    province: 'تهران',
    city: 'تهران',
    address: 'خیابان شریعتی، نرسیده به میرداماد، برج آسمان، طبقه ۸، واحد ۸۰۲',
    postalCode: '۱۵۴۶۷۸۹۰۱۲',
    isDefault: false,
  },
];

// ==================== Components ====================
function AddressCard({ address, onSetDefault, onEdit, onDelete }) {
  return (
    <Box
      sx={{
        ...neoSoft,
        p: 2.5,
        position: 'relative',
        border: address.isDefault ? `2px solid ${alpha(ACCENT_ORANGE, 0.4)}` : '2px solid transparent',
      }}
    >
      {address.isDefault && (
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

      <Typography
        sx={{
          fontSize: 13.5,
          color: INK,
          lineHeight: 1.7,
          mb: 1.5,
        }}
      >
        {address.province}، {address.city}، {address.address}
      </Typography>

      <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 2 }}>کد پستی: {ConvertToPersianDigit(address.postalCode)}</Typography>

      <Stack direction="row" gap={1} flexWrap="wrap">
        {!address.isDefault && (
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
            boxShadow: `3px 3px 8px ${SHADOW_DARK}, -3px -3px 8px ${SHADOW_LIGHT}`,
          }}
        >
          ویرایش
        </Button>
        <IconButton
          size="small"
          onClick={() => onDelete(address.id)}
          sx={{
            color: '#E53E3E',
            borderRadius: '10px',
            ...neoSoft,
            boxShadow: `3px 3px 8px ${SHADOW_DARK}, -3px -3px 8px ${SHADOW_LIGHT}`,
          }}
        >
          <Trash size={16} />
        </IconButton>
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (address) => {
    setEditing(address);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Box width="100%">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha('#38A169', 0.12),
                    color: '#38A169',
                  }}
                >
                  <Location size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>آدرس‌های من</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>{ConvertToPersianDigit(addresses.length)} آدرس ثبت‌شده</Typography>
                </Box>
              </Stack>

              <Stack direction="row" gap={1.5}>
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
                  }}
                >
                  بازگشت
                </Button>
                <Button
                  startIcon={<Add size={18} style={{ marginLeft: '8px' }} />}
                  onClick={handleAdd}
                  sx={{
                    px: 2.5,
                    py: 1.1,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: 13.5,
                    color: '#fff',
                    bgcolor: ACCENT_ORANGE,
                    boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
                    '&:hover': { bgcolor: '#E06B10' },
                  }}
                >
                  آدرس جدید
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Address List */}
          {addresses.length === 0 ? (
            <Box sx={{ ...neoRaised, p: 6, textAlign: 'center' }}>
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
                <Location size={36} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>آدرسی ثبت نشده</Typography>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 1, mb: 3 }}>برای ثبت سفارش، حداقل یک آدرس اضافه کنید</Typography>
              <Button
                startIcon={<Add size={18} style={{ marginLeft: '8px' }} />}
                onClick={handleAdd}
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

      {/* Add / Edit Dialog (simplified) */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            ...neoRaised,
            borderRadius: '22px',
            bgcolor: SURFACE,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: INK }}>{editing ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ mt: 1 }}>
            <TextField
              label="عنوان آدرس"
              defaultValue={editing?.title || ''}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  ...neoInset,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              label="نام گیرنده"
              defaultValue={editing?.receiver || ''}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  ...neoInset,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              label="شماره تماس"
              defaultValue={editing?.phone || ''}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  ...neoInset,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              label="آدرس کامل"
              defaultValue={editing?.address || ''}
              fullWidth
              multiline
              rows={3}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  ...neoInset,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <TextField
              label="کد پستی"
              defaultValue={editing?.postalCode || ''}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  ...neoInset,
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: INK_SOFT, fontWeight: 600 }}>
            انصراف
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(false)}
            sx={{
              bgcolor: ACCENT_ORANGE,
              borderRadius: '12px',
              fontWeight: 600,
              px: 3,
              boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
              '&:hover': { bgcolor: '#E06B10' },
            }}
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </ChildrenLayout>
  );
}
