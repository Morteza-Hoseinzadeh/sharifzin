'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, Chip, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchNormal1, Eye, Bag2, Filter } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import { handleConvertDate } from '@/utils/functions/convertDate';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '12px', boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };

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

const filters = [
  { key: 'all', label: 'همه' },
  { key: 'pending_payment', label: 'در انتظار پرداخت' },
  { key: 'paid', label: 'پرداخت شده' },
  { key: 'pickup_dispatched', label: 'در حال برداشتن زین' },
  { key: 'picked_up', label: 'برداشته شده' },
  { key: 'at_shop', label: 'در مغازه' },
  { key: 'inspecting', label: 'در حال بررسی' },
  { key: 'ready_to_ship', label: 'آماده ارسال' },
  { key: 'return_dispatched', label: 'در حال ارسال بازگشت' },
  { key: 'delivered', label: 'تحویل شده' },
  { key: 'cancelled', label: 'لغو شده' },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const { data } = await axiosInstance?.get('/api/v1/admin/orders');

      if (data?.data) {
        setOrders(data?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(true);
      alert('خطا در دریافت اطلاعات');
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>مدیریت سفارش‌ها</Typography>
        <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(orders.length)} سفارش ثبت‌شده</Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ ...neoSoft, p: 1.5, mb: 2.5, overflowX: 'auto' }}>
        <Stack direction="row" gap={1} sx={{ minWidth: 'max-content' }}>
          {filters.map((f) => (
            <Button key={f.key} onClick={() => setActiveFilter(f.key)} sx={{ px: 2.2, py: 1, borderRadius: '12px', fontWeight: 600, fontSize: 13, color: activeFilter === f.key ? '#fff' : INK, bgcolor: activeFilter === f.key ? ACCENT_ORANGE : 'transparent', boxShadow: activeFilter === f.key ? `4px 4px 10px ${SHADOW_DARK}` : 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: activeFilter === f.key ? '#E06B10' : alpha(ACCENT_ORANGE, 0.08) } }}>
              {f?.label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Search */}
      <Box sx={{ ...neoSoft, p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="جستجو با کد سفارش، نام یا شماره موبایل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchNormal1 size={18} color={INK_SOFT} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              ...neoInset,
              '& fieldset': { border: 'none' },
            },
          }}
        />
      </Box>

      {/* Table */}
      <Box sx={{ ...neoRaised, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>کد سفارش</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>مشتری</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>مبلغ</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>درصد تخفیف</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>وضعیت</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>تاریخ</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }} align="left">
                  عملیات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((o) => {
                const st = statusMap[o.status];
                return (
                  <TableRow key={o.order_code} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: INK }}>{o.order_code}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{o.full_name}</Typography>
                      <Typography sx={{ fontSize: 12, color: INK_SOFT }}>{o.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(o?.payable_amount?.toLocaleString())} هزارتومان</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13.5, color: INK }}>{`${o?.discount_amount?.toLocaleString('fa-IR')} هزارتومان` || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={st.title} size="small" sx={{ bgcolor: alpha(st?.color, 0.1), color: st?.color, fontWeight: 600, fontSize: 11.5, height: 26, borderRadius: '8px' }} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{handleConvertDate(o?.created_at)}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <IconButton size="small" component={Link} href={`/admin/orders/${o.order_code}`}>
                        <Eye size={18} color={ACCENT_ORANGE} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
