'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add,
  SearchNormal1,
  Edit2,
  Trash,
  Eye,
  Box1,
  Filter,
} from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

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
  borderRadius: '12px',
  boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}`,
};

const products = [
  { id: 1, name: 'زین موتورسیکلت مدل کلاسیک', category: 'زین کلاسیک', price: 2850000, stock: 12, status: 'active', sold: 48 },
  { id: 2, name: 'زین اسپرت دوخت لوزی', category: 'زین اسپرت', price: 3200000, stock: 8, status: 'active', sold: 36 },
  { id: 3, name: 'رویه زین چرم طبیعی', category: 'رویه و کاور', price: 980000, stock: 0, status: 'out', sold: 29 },
  { id: 4, name: 'زین آفرود تقویت‌شده', category: 'زین آفرود', price: 4100000, stock: 5, status: 'active', sold: 22 },
  { id: 5, name: 'کاور زین ضد آب', category: 'رویه و کاور', price: 450000, stock: 34, status: 'active', sold: 67 },
  { id: 6, name: 'زین ریسینگ حرفه‌ای', category: 'زین اسپرت', price: 3650000, stock: 3, status: 'low', sold: 15 },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.includes(search) || p.category.includes(search)
  );

  const statusChip = (status) => {
    const map = {
      active: { label: 'فعال', color: '#38A169' },
      out: { label: 'ناموجود', color: '#E53E3E' },
      low: { label: 'کمبود موجودی', color: ACCENT_ORANGE },
    };
    const s = map[status];
    return (
      <Chip
        label={s.label}
        size="small"
        sx={{
          bgcolor: alpha(s.color, 0.1),
          color: s.color,
          fontWeight: 600,
          fontSize: 11.5,
          height: 26,
          borderRadius: '8px',
        }}
      />
    );
  };

  return (
    <AdminLayout>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        gap={2}
        sx={{ mb: 3.5 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>
            مدیریت محصولات
          </Typography>
          <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>
            {ConvertToPersianDigit(products.length)} محصول ثبت‌شده
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/admin/products/new"
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
          افزودن محصول
        </Button>
      </Stack>

      {/* Search & Filter */}
      <Box sx={{ ...neoSoft, p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
          <TextField
            fullWidth
            placeholder="جستجو در محصولات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
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
          <Button
            startIcon={<Filter size={16} style={{ marginLeft: 4 }} />}
            sx={{
              px: 2.5,
              borderRadius: '12px',
              fontWeight: 600,
              color: INK,
              ...neoSoft,
              whiteSpace: 'nowrap',
            }}
          >
            فیلتر
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      <Box sx={{ ...neoRaised, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>محصول</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>دسته‌بندی</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>قیمت</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>موجودی</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>فروش</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>وضعیت</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }} align="left">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '10px',
                          bgcolor: alpha(ACCENT_ORANGE, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: ACCENT_ORANGE,
                        }}
                      >
                        <Box1 size={20} variant="Bold" />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>
                        {p.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{p.category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>
                      {ConvertToPersianDigit(p.price.toLocaleString())}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, color: p.stock === 0 ? '#E53E3E' : INK }}>
                      {ConvertToPersianDigit(p.stock)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>
                      {ConvertToPersianDigit(p.sold)}
                    </Typography>
                  </TableCell>
                  <TableCell>{statusChip(p.status)}</TableCell>
                  <TableCell align="left">
                    <Stack direction="row" gap={0.5} justifyContent="flex-end">
                      <IconButton size="small" component={Link} href={`/admin/products/${p.id}`}>
                        <Eye size={17} color={INK_SOFT} />
                      </IconButton>
                      <IconButton size="small" component={Link} href={`/admin/products/${p.id}/edit`}>
                        <Edit2 size={17} color={ACCENT_ORANGE} />
                      </IconButton>
                      <IconButton size="small">
                        <Trash size={17} color="#E53E3E" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}