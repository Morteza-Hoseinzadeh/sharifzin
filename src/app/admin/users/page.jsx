'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField, InputAdornment, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchNormal1, Eye, Profile2User, Trash } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import { handleConvertDate } from '@/utils/functions/convertDate';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '12px', boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const res = await axiosInstance.get('/api/v1/admin/users');
      setUsers(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId) {
    try {
      const res = await axiosInstance.delete(`/api/v1/admin/users/${userId}`);
      const isConfirm = window.confirm('آیا از حذف این کاربر مطمئن هستید؟');

      if (isConfirm && res.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => u?.full_name.includes(search) || u?.phone.includes(search));

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
                <TableCell sx={{ textAlign: 'right', fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>کاربر</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>شماره موبایل</TableCell>
                <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: 13 }}>نقش</TableCell>
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
                      <Avatar sx={{ width: 38, height: 38, bgcolor: alpha(ACCENT_ORANGE, 0.15), color: ACCENT_ORANGE, fontWeight: 700, fontSize: 14 }}>{u.full_name.charAt(0)}</Avatar>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: INK }}>{u.full_name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>{u.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13.5, color: INK }}>{u.role === 'admin' ? 'مدیر' : 'کاربر عادی'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{handleConvertDate(u.created_at)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={u.status === 'active' ? 'فعال' : 'مسدود'} size="small" sx={{ bgcolor: alpha(u.status === 'active' ? '#38A169' : '#E53E3E', 0.1), color: u.status === 'active' ? '#38A169' : '#E53E3E', fontWeight: 600, fontSize: 11.5, height: 26, borderRadius: '8px' }} />
                  </TableCell>
                  <TableCell align="left">
                    <IconButton size="small" onClick={() => handleDeleteUser(u.id)}>
                      <Trash size={18} color={ACCENT_ORANGE} />
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
