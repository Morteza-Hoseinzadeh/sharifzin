'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, TextField, InputAdornment, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchNormal1, Eye, Profile2User } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '12px', boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };

const users = [
  { id: 1, name: 'علی رضایی', phone: '۰۹۱۲۳۴۵۶۷۸۹', orders: 8, totalSpent: 18500000, joinDate: '۱۴۰۳/۰۸/۱۲', status: 'active' },
  { id: 2, name: 'مریم احمدی', phone: '۰۹۱۹۸۷۶۵۴۳۲', orders: 5, totalSpent: 12400000, joinDate: '۱۴۰۳/۰۹/۰۵', status: 'active' },
  { id: 3, name: 'حسین محمدی', phone: '۰۹۳۵۱۲۳۴۵۶۷', orders: 3, totalSpent: 5600000, joinDate: '۱۴۰۳/۱۰/۲۰', status: 'active' },
  { id: 4, name: 'سارا کریمی', phone: '۰۹۱۲۱۱۱۲۲۳۳', orders: 12, totalSpent: 31200000, joinDate: '۱۴۰۳/۰۶/۱۵', status: 'active' },
  { id: 5, name: 'رضا نوری', phone: '۰۹۳۶۷۸۹۱۲۳۴', orders: 1, totalSpent: 1500000, joinDate: '۱۴۰۴/۰۴/۰۱', status: 'blocked' },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => u.name.includes(search) || u.phone.includes(search));

  return (
    <AdminLayout>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>مدیریت کاربران</Typography>
        <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(users.length)} کاربر ثبت‌نام‌شده</Typography>
      </Box>

      <Box sx={{ ...neoSoft, p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="جستجو با نام یا شماره موبایل..."
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

      <Box sx={{ ...neoRaised, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>کاربر</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>شماره موبایل</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>سفارش‌ها</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>مجموع خرید</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>تاریخ عضویت</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>وضعیت</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }} align="left">
                  عملیات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: alpha(ACCENT_ORANGE, 0.15),
                          color: ACCENT_ORANGE,
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {u.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{u.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>{u.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(u.orders)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{ConvertToPersianDigit(u.totalSpent.toLocaleString())}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{u.joinDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.status === 'active' ? 'فعال' : 'مسدود'}
                      size="small"
                      sx={{
                        bgcolor: alpha(u.status === 'active' ? '#38A169' : '#E53E3E', 0.1),
                        color: u.status === 'active' ? '#38A169' : '#E53E3E',
                        fontWeight: 600,
                        fontSize: 11.5,
                        height: 26,
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <IconButton size="small">
                      <Eye size={18} color={ACCENT_ORANGE} />
                    </IconButton>
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
