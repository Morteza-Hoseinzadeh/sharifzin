'use client';

import React from 'react';
import { Box, Typography, Stack, Button, Chip, Divider, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight2, TickCircle, TruckFast, Clock, CloseCircle, Location, Call, User } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };

const order = {
  id: 'SZ-1042',
  status: 'shipping',
  date: '۲ مرداد ۱۴۰۴ - ۱۴:۳۲',
  user: { name: 'علی رضایی', phone: '۰۹۱۲۳۴۵۶۷۸۹', email: 'ali.rezaei@example.com' },
  address: {
    title: 'منزل',
    full: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه آفتاب، پلاک ۱۲، واحد ۳',
    postal: '۱۹۶۵۶۴۳۲۱۰',
  },
  items: [{ name: 'زین موتورسیکلت مدل کلاسیک', price: 2850000, qty: 1 }],
  shippingCost: 85000,
  discount: 0,
  total: 2935000,
  timeline: [
    { status: 'ثبت سفارش', date: '۲ مرداد - ۱۴:۳۲', done: true },
    { status: 'تأیید پرداخت', date: '۲ مرداد - ۱۴:۳۵', done: true },
    { status: 'در حال آماده‌سازی', date: '۲ مرداد - ۱۶:۱۰', done: true },
    { status: 'ارسال شده', date: '۳ مرداد - ۱۰:۲۰', done: true },
    { status: 'تحویل به مشتری', date: '', done: false },
  ],
};

const statusMap = {
  delivered: { label: 'تحویل شده', color: '#38A169', icon: TickCircle },
  shipping: { label: 'در حال ارسال', color: ACCENT_BLUE, icon: TruckFast },
  processing: { label: 'در حال پردازش', color: ACCENT_ORANGE, icon: Clock },
  cancelled: { label: 'لغو شده', color: '#E53E3E', icon: CloseCircle },
};

export default function AdminOrderDetailPage() {
  const st = statusMap[order.status];
  const StatusIcon = st.icon;

  return (
    <AdminLayout>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3.5 }}>
        <Button component={Link} href="/admin/orders" startIcon={<ArrowRight2 size={16} style={{ marginLeft: 4 }} />} sx={{ color: INK, fontWeight: 600, ...neoSoft, px: 2, py: 1, borderRadius: '12px' }}>
          بازگشت
        </Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: INK }}>جزئیات سفارش {order.id}</Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ ...neoRaised, p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>اقلام سفارش</Typography>
              <Chip
                icon={<StatusIcon size={14} variant="Bold" color={st.color} style={{ marginRight: 6 }} />}
                label={st.label}
                sx={{
                  bgcolor: alpha(st.color, 0.1),
                  color: st.color,
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              />
            </Stack>

            {order.items.map((item, i) => (
              <Box key={i} sx={{ ...neoSoft, p: 2, mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK }}>{item.name}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 0.5 }}>تعداد: {ConvertToPersianDigit(item.qty)}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK }}>{ConvertToPersianDigit(item.price.toLocaleString())} تومان</Typography>
                </Stack>
              </Box>
            ))}

            <Divider sx={{ my: 2.5, borderColor: alpha(INK, 0.08) }} />

            <Stack gap={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: INK_SOFT, fontSize: 13.5 }}>جمع اقلام</Typography>
                <Typography sx={{ fontWeight: 600, color: INK }}>{ConvertToPersianDigit((order.total - order.shippingCost + order.discount).toLocaleString())} تومان</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: INK_SOFT, fontSize: 13.5 }}>هزینه ارسال</Typography>
                <Typography sx={{ fontWeight: 600, color: INK }}>{ConvertToPersianDigit(order.shippingCost.toLocaleString())} تومان</Typography>
              </Stack>
              {order.discount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: INK_SOFT, fontSize: 13.5 }}>تخفیف</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#38A169' }}>-{ConvertToPersianDigit(order.discount.toLocaleString())} تومان</Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>مبلغ نهایی</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 16, color: ACCENT_ORANGE }}>{ConvertToPersianDigit(order.total.toLocaleString())} تومان</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Timeline */}
          <Box sx={{ ...neoRaised, p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>وضعیت سفارش</Typography>
            <Stack gap={2}>
              {order.timeline.map((t, i) => (
                <Stack key={i} direction="row" gap={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: t.done ? alpha('#38A169', 0.15) : alpha(INK, 0.08),
                      color: t.done ? '#38A169' : INK_SOFT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {t.done ? <TickCircle size={16} variant="Bold" /> : <Clock size={16} />}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: t.done ? INK : INK_SOFT }}>{t.status}</Typography>
                    {t.date && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 0.3 }}>{t.date}</Typography>}
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
                <Typography sx={{ fontSize: 14, color: INK }}>{order.user.name}</Typography>
              </Stack>
              <Stack direction="row" gap={1.5} alignItems="center">
                <Call size={18} color={INK_SOFT} />
                <Typography sx={{ fontSize: 14, color: INK }}>{order.user.phone}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ ...neoRaised, p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 2 }}>آدرس ارسال</Typography>
            <Stack direction="row" gap={1.5} alignItems="flex-start">
              <Location size={18} color={INK_SOFT} style={{ marginTop: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK, mb: 0.5 }}>{order.address.title}</Typography>
                <Typography sx={{ fontSize: 13, color: INK_SOFT, lineHeight: 1.7 }}>{order.address.full}</Typography>
                <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 1 }}>کد پستی: {order.address.postal}</Typography>
              </Box>
            </Stack>
          </Box>

          <Stack gap={1.5} sx={{ mt: 3 }}>
            <Button
              fullWidth
              sx={{
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
              تغییر وضعیت سفارش
            </Button>
            <Button
              fullWidth
              sx={{
                py: 1.3,
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: 14,
                color: INK,
                ...neoSoft,
              }}
            >
              چاپ فاکتور
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
