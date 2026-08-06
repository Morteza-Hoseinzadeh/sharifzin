'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, Chip, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchNormal1, Eye, Bag2, Filter } from 'iconsax-reactjs';
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
const neoInset = { background: SURFACE, borderRadius: '12px', boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };

const orders = [
  { id: 'SZ-1042', user: 'علی رضایی', phone: '۰۹۱۲۳۴۵۶۷۸۹', total: 2850000, status: 'delivered', date: '۲ مرداد ۱۴۰۴', items: 1 },
  { id: 'SZ-1041', user: 'مریم احمدی', phone: '۰۹۱۹۸۷۶۵۴۳۲', total: 4200000, status: 'shipping', date: '۲ مرداد ۱۴۰۴', items: 2 },
  { id: 'SZ-1040', user: 'حسین محمدی', phone: '۰۹۳۵۱۲۳۴۵۶۷', total: 980000, status: 'processing', date: '۱ مرداد ۱۴۰۴', items: 1 },
  { id: 'SZ-1039', user: 'سارا کریمی', phone: '۰۹۱۲۱۱۱۲۲۳۳', total: 3650000, status: 'delivered', date: '۱ مرداد ۱۴۰۴', items: 1 },
  { id: 'SZ-1038', user: 'رضا نوری', phone: '۰۹۳۶۷۸۹۱۲۳۴', total: 1500000, status: 'processing', date: '۳۱ تیر ۱۴۰۴', items: 1 },
  { id: 'SZ-1037', user: 'فاطمه رضایی', phone: '۰۹۱۵۴۳۲۱۰۹۸', total: 2100000, status: 'cancelled', date: '۳۰ تیر ۱۴۰۴', items: 2 },
  { id: 'SZ-1036', user: 'امیر حسینی', phone: '۰۹۳۳۲۱۰۹۸۷۶', total: 4800000, status: 'shipping', date: '۲۹ تیر ۱۴۰۴', items: 3 },
];

const statusMap = {
  delivered: { label: 'تحویل شده', color: '#38A169' },
  shipping: { label: 'در حال ارسال', color: ACCENT_BLUE },
  processing: { label: 'در حال پردازش', color: ACCENT_ORANGE },
  cancelled: { label: 'لغو شده', color: '#E53E3E' },
};

const filters = [
  { key: 'all', label: 'همه' },
  { key: 'processing', label: 'در حال پردازش' },
  { key: 'shipping', label: 'در حال ارسال' },
  { key: 'delivered', label: 'تحویل شده' },
  { key: 'cancelled', label: 'لغو شده' },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.includes(search) || o.user.includes(search) || o.phone.includes(search);
    const matchStatus = activeFilter === 'all' || o.status === activeFilter;
    return matchSearch && matchStatus;
  });

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
            <Button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              sx={{
                px: 2.2,
                py: 1,
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: 13,
                color: activeFilter === f.key ? '#fff' : INK,
                bgcolor: activeFilter === f.key ? ACCENT_ORANGE : 'transparent',
                boxShadow: activeFilter === f.key ? `4px 4px 10px ${SHADOW_DARK}` : 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: activeFilter === f.key ? '#E06B10' : alpha(ACCENT_ORANGE, 0.08) },
              }}
            >
              {f.label}
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
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>تعداد</TableCell>
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
                  <TableRow key={o.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: INK }}>{o.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{o.user}</Typography>
                      <Typography sx={{ fontSize: 12, color: INK_SOFT }}>{o.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(o.total.toLocaleString())}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(o.items)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={st.label}
                        size="small"
                        sx={{
                          bgcolor: alpha(st.color, 0.1),
                          color: st.color,
                          fontWeight: 600,
                          fontSize: 11.5,
                          height: 26,
                          borderRadius: '8px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{o.date}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <IconButton size="small" component={Link} href={`/admin/orders/${o.id}`}>
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
