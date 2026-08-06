'use client';

import React from 'react';
import { Box, Typography, Stack, Grid, LinearProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Chart, MoneyRecive, Bag2, Profile2User, ArrowUp } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };

const monthlySales = [
  { month: 'فروردین', amount: 185 },
  { month: 'اردیبهشت', amount: 210 },
  { month: 'خرداد', amount: 198 },
  { month: 'تیر', amount: 245 },
  { month: 'مرداد', amount: 268 },
];

const topProducts = [
  { name: 'زین کلاسیک', percent: 32 },
  { name: 'زین اسپرت لوزی', percent: 24 },
  { name: 'رویه چرم', percent: 18 },
  { name: 'زین آفرود', percent: 14 },
  { name: 'کاور ضدآب', percent: 12 },
];

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>گزارش‌ها و آمار</Typography>
        <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>تحلیل عملکرد فروشگاه</Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          { title: 'فروش ماه جاری', value: '۲۶۸ میلیون', icon: MoneyRecive, color: '#38A169' },
          { title: 'تعداد سفارش', value: '۳۸۴', icon: Bag2, color: ACCENT_ORANGE },
          { title: 'کاربران جدید', value: '۱۲۷', icon: Profile2User, color: '#3B82F6' },
          { title: 'نرخ تبدیل', value: '۴.۲٪', icon: Chart, color: '#805AD5' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
              <Box sx={{ ...neoRaised, p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{item.title}</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mt: 0.5 }}>{item.value}</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '14px',
                      bgcolor: alpha(item.color, 0.12),
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} variant="Bold" />
                  </Box>
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 3 }}>فروش ماهانه (میلیون تومان)</Typography>
            <Stack gap={2}>
              {monthlySales.map((m) => (
                <Box key={m.month}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>{m.month}</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(m.amount)}</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(m.amount / 300) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha(ACCENT_ORANGE, 0.12),
                      '& .MuiLinearProgress-bar': { bgcolor: ACCENT_ORANGE, borderRadius: 5 },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 3 }}>سهم محصولات از فروش</Typography>
            <Stack gap={2.2}>
              {topProducts.map((p) => (
                <Box key={p.name}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>{p.name}</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(p.percent)}٪</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={p.percent}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha('#3B82F6', 0.12),
                      '& .MuiLinearProgress-bar': { bgcolor: '#3B82F6', borderRadius: 4 },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
