'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, TextField, Switch, Divider, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Setting2, Shop, Truck, Card, Notification } from 'iconsax-reactjs';
import AdminLayout from '@/components/admin/AdminLayout';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '12px', boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    shopName: 'شریف‌زین',
    phone: '۰۲۱-۸۸۷۷۶۶۵۵',
    email: 'info@sharifzin.ir',
    address: 'تهران، خیابان انقلاب',
    shippingCost: '۸۵۰۰۰',
    freeShippingFrom: '۵۰۰۰۰۰۰',
    smsNotification: true,
    emailNotification: true,
  });

  const handleChange = (field) => (e) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>تنظیمات فروشگاه</Typography>
        <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>مدیریت اطلاعات کلی و پیکربندی</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Shop Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: alpha(ACCENT_ORANGE, 0.12), color: ACCENT_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shop size={20} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>اطلاعات فروشگاه</Typography>
            </Stack>

            <Stack gap={2}>
              <TextField label="نام فروشگاه" value={settings.shopName} onChange={handleChange('shopName')} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }} />
              <TextField label="شماره تماس" value={settings.phone} onChange={handleChange('phone')} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }} />
              <TextField label="ایمیل" value={settings.email} onChange={handleChange('email')} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }} />
              <TextField label="آدرس" value={settings.address} onChange={handleChange('address')} size="small" multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }} />
            </Stack>
          </Box>
        </Grid>

        {/* Shipping */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: alpha('#3B82F6', 0.12), color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>تنظیمات ارسال</Typography>
            </Stack>

            <Stack gap={2}>
              <TextField label="هزینه ارسال (تومان)" value={settings.shippingCost} onChange={handleChange('shippingCost')} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }} />
              <TextField label="ارسال رایگان از مبلغ (تومان)" value={settings.freeShippingFrom} onChange={handleChange('freeShippingFrom')} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }} />
            </Stack>
          </Box>
        </Grid>

        {/* Notifications */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: alpha('#805AD5', 0.12), color: '#805AD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Notification size={20} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>اعلان‌ها</Typography>
            </Stack>

            <Stack gap={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK }}>اعلان پیامکی</Typography>
                  <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>ارسال پیامک هنگام ثبت و تغییر وضعیت سفارش</Typography>
                </Box>
                <Switch checked={settings.smsNotification} onChange={(e) => setSettings((p) => ({ ...p, smsNotification: e.target.checked }))} color="warning" />
              </Stack>
              <Divider sx={{ borderColor: alpha(INK, 0.08) }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK }}>اعلان ایمیلی</Typography>
                  <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>ارسال ایمیل به مشتری و ادمین</Typography>
                </Box>
                <Switch checked={settings.emailNotification} onChange={(e) => setSettings((p) => ({ ...p, emailNotification: e.target.checked }))} color="warning" />
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          sx={{
            px: 4,
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
          ذخیره تنظیمات
        </Button>
      </Stack>
    </AdminLayout>
  );
}
