'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, Chip, IconButton, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, Edit2, Trash, TicketDiscount } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };

const coupons = [
  { id: 1, code: 'SUMMER1404', type: 'percent', value: 15, used: 42, limit: 100, expire: '۳۱ شهریور ۱۴۰۴', status: 'active' },
  { id: 2, code: 'WELCOME50', type: 'fixed', value: 500000, used: 18, limit: 50, expire: '۱۵ مرداد ۱۴۰۴', status: 'active' },
  { id: 3, code: 'OFF20', type: 'percent', value: 20, used: 95, limit: 100, expire: '۱۰ تیر ۱۴۰۴', status: 'expired' },
];

export default function AdminCouponsPage() {
  return (
    <AdminLayout>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>کدهای تخفیف</Typography>
          <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(coupons.length)} کد فعال و منقضی</Typography>
        </Box>
        <Button
          startIcon={<Add size={18} style={{ marginLeft: 4 }} />}
          sx={{
            px: 2.5,
            py: 1.2,
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: 14,
            color: '#fff',
            bgcolor: ACCENT_ORANGE,
            boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
            '&:hover': { bgcolor: '#E06B10' },
          }}
        >
          ساخت کد تخفیف
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {coupons.map((c) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={c.id}>
            <Box sx={{ ...neoRaised, p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: alpha(ACCENT_ORANGE, 0.12),
                    color: ACCENT_ORANGE,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TicketDiscount size={22} variant="Bold" />
                </Box>
                <Chip
                  label={c.status === 'active' ? 'فعال' : 'منقضی'}
                  size="small"
                  sx={{
                    bgcolor: alpha(c.status === 'active' ? '#38A169' : '#E53E3E', 0.1),
                    color: c.status === 'active' ? '#38A169' : '#E53E3E',
                    fontWeight: 600,
                    fontSize: 11.5,
                    height: 26,
                    borderRadius: '8px',
                  }}
                />
              </Stack>

              <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK, letterSpacing: 1 }}>{c.code}</Typography>
              <Typography sx={{ fontSize: 14, color: ACCENT_ORANGE, fontWeight: 700, mt: 0.5 }}>{c.type === 'percent' ? `${ConvertToPersianDigit(c.value)}٪ تخفیف` : `${ConvertToPersianDigit(c.value.toLocaleString())} تومان تخفیف`}</Typography>

              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>
                  استفاده: {ConvertToPersianDigit(c.used)} / {ConvertToPersianDigit(c.limit)}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>انقضا: {c.expire}</Typography>
              </Stack>

              <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <IconButton size="small">
                  <Edit2 size={16} color={ACCENT_ORANGE} />
                </IconButton>
                <IconButton size="small">
                  <Trash size={16} color="#E53E3E" />
                </IconButton>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}
