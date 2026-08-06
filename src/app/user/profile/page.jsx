'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, TextField, Avatar, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { User, ArrowLeft2, Edit2, Call, Calendar, Sms, Lock1, TickCircle } from 'iconsax-reactjs';
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

// ==================== Main Page ====================
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'علی رضایی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    email: 'ali.rezaei@example.com',
    joinDate: '۱۴۰۳/۰۸/۱۲',
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: API call
  };

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Box width="100%" mx="auto">
          {/* Header */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(ACCENT_BLUE, 0.12),
                    color: ACCENT_BLUE,
                  }}
                >
                  <User size={22} variant="Bold" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>اطلاعات حساب</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.2 }}>مدیریت پروفایل کاربری</Typography>
                </Box>
              </Stack>

              <Button component={Link} href="/user" endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />} sx={{ px: 2, py: 1, borderRadius: '12px', fontWeight: 600, fontSize: 13, color: INK, ...neoSoft }}>
                بازگشت
              </Button>
            </Stack>
          </Box>

          {/* Profile Card */}
          <Box sx={{ ...neoRaised, p: { xs: 3, md: 4 } }}>
            {/* Avatar Section */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2.5} sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: alpha(ACCENT_ORANGE, 0.15),
                  color: ACCENT_ORANGE,
                  fontWeight: 800,
                  fontSize: 32,
                  boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`,
                }}
              >
                {form.name.charAt(0)}
              </Avatar>
              <Box sx={{ textAlign: { xs: 'center', sm: 'right' }, flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 20, color: INK }}>{form.name}</Typography>
                <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mt: 0.5 }}>عضو از {form.joinDate}</Typography>
              </Box>
              {!isEditing && (
                <Button
                  startIcon={<Edit2 size={16} style={{ marginLeft: '4px' }} />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    px: 2.5,
                    py: 1.1,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: 13.5,
                    color: INK,
                    ...neoSoft,
                    boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                  }}
                >
                  ویرایش اطلاعات
                </Button>
              )}
            </Stack>

            <Divider
              sx={{
                borderColor: alpha(INK, 0.08),
                mb: 3.5,
              }}
            />

            {/* Form Fields */}
            <Stack gap={2.5}>
              <Box>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <User size={16} color={INK_SOFT} />
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, fontWeight: 600 }}>نام و نام خانوادگی</Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={form.name}
                    onChange={handleChange('name')}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        ...neoInset,
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                ) : (
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: INK }}>{form.name}</Typography>
                )}
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <Call size={16} color={INK_SOFT} />
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, fontWeight: 600 }}>شماره موبایل</Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={form.phone}
                    onChange={handleChange('phone')}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        ...neoInset,
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                ) : (
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: INK }}>{form.phone}</Typography>
                )}
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <Sms size={16} color={INK_SOFT} />
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, fontWeight: 600 }}>ایمیل</Typography>
                </Stack>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={form.email}
                    onChange={handleChange('email')}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        ...neoInset,
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                ) : (
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: INK }}>{form.email}</Typography>
                )}
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <Calendar size={16} color={INK_SOFT} />
                  <Typography sx={{ fontSize: 13, color: INK_SOFT, fontWeight: 600 }}>تاریخ عضویت</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: INK }}>{form.joinDate}</Typography>
              </Box>
            </Stack>

            {/* Action Buttons */}
            {isEditing && (
              <Stack direction="row" gap={1.5} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Button
                  onClick={() => setIsEditing(false)}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: 14,
                    color: INK,
                    ...neoSoft,
                  }}
                >
                  انصراف
                </Button>
                <Button
                  startIcon={<TickCircle size={18} style={{ marginLeft: '4px' }} />}
                  onClick={handleSave}
                  sx={{
                    px: 3,
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
                  ذخیره تغییرات
                </Button>
              </Stack>
            )}
          </Box>

          {/* Change Password Card */}
          <Box sx={{ ...neoRaised, p: { xs: 3, md: 3.5 }, mt: 3 }}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(ACCENT_BLUE, 0.12),
                  color: ACCENT_BLUE,
                }}
              >
                <Lock1 size={20} variant="Bold" />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>تغییر رمز عبور</Typography>
                <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>برای امنیت بیشتر، رمز عبور خود را به‌روز کنید</Typography>
              </Box>
            </Stack>
            <Button
              sx={{
                mt: 2,
                px: 2.5,
                py: 1.1,
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: 13.5,
                color: ACCENT_BLUE,
                ...neoSoft,
                boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
              }}
            >
              تغییر رمز عبور
            </Button>
          </Box>
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
