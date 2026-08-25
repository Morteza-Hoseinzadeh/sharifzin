'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, TextField, Button, IconButton, InputAdornment, Divider, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Eye, EyeSlash, Sms, Lock } from 'iconsax-reactjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/API/axiosInstance';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '24px',
  boxShadow: `10px 10px 24px ${SHADOW_DARK}, -10px -10px 24px ${SHADOW_LIGHT}`,
  border: 'none',
};

const neoInset = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// Point this at your actual API base URL (env var recommended).
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) {
      setErrorMsg('شماره موبایل و رمز عبور الزامی است');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data } = await axiosInstance.post('/api/v1/auth/login', { phone: form.phone, password: form.password });

      if (!data) {
        // e.g. unverified phone -> send them to verify instead of a dead end
        if (data.status === 403 && data.message_fa?.includes('تایید')) {
          router.push(`/auth/verify-otp?phone=${encodeURIComponent(form.phone)}`);
          return;
        }
        setErrorMsg(data.message_fa || 'خطا در ورود');
        return;
      }

      localStorage.setItem('sharifzin-auth-token', JSON.stringify(data?.data));
      router.push('/');
    } catch (err) {
      setErrorMsg('ارتباط با سرور برقرار نشد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} sx={{ ...neoRaised, p: { xs: 3.5, md: 5 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, color: INK, mb: 1 }}>ورود به حساب کاربری</Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT }}>به فروشگاه شریف‌زین خوش آمدید</Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '14px' }}>
              {errorMsg}
            </Alert>
          )}

          {/* Form */}
          <Stack gap={2.5}>
            {/* Phone */}
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>شماره موبایل</Typography>
              <TextField
                fullWidth
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                inputProps={{ inputMode: 'tel', dir: 'ltr' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment sx={{ marginRight: '20px' }}>
                      <Sms size={18} color={INK_SOFT} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { ...neoInset, borderRadius: '14px', '& fieldset': { border: 'none' }, fontSize: 14, color: INK },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>رمز عبور</Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="رمز عبور خود را وارد کنید"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ marginLeft: '14px' }}>
                      <Lock size={18} color={INK_SOFT} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment>
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeSlash size={18} color={INK_SOFT} /> : <Eye size={18} color={INK_SOFT} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    ...neoInset,
                    borderRadius: '14px',
                    '& fieldset': { border: 'none' },
                    fontSize: 14,
                    color: INK,
                  },
                }}
              />
            </Box>

            {/* Forgot Password */}
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                component={Link}
                href="/auth/forgot-password"
                sx={{
                  fontSize: 13,
                  color: ACCENT_ORANGE,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Typography>
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: 15,
                color: '#fff',
                bgcolor: ACCENT_ORANGE,
                boxShadow: `6px 6px 16px ${SHADOW_DARK}, -4px -4px 12px ${SHADOW_LIGHT}`,
                mt: 1,
                '&:hover': { bgcolor: '#E06B10' },
                '&.Mui-disabled': { bgcolor: alpha(ACCENT_ORANGE, 0.6), color: '#fff' },
              }}
            >
              {loading ? 'در حال ورود...' : 'ورود به حساب'}
            </Button>
          </Stack>

          {/* Divider */}
          <Stack direction="row" alignItems="center" gap={2} sx={{ my: 3.5 }}>
            <Divider sx={{ flex: 1, borderColor: alpha(INK, 0.1) }} />
            <Typography sx={{ fontSize: 12.5, color: INK_SOFT }}>یا</Typography>
            <Divider sx={{ flex: 1, borderColor: alpha(INK, 0.1) }} />
          </Stack>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>
              حساب کاربری ندارید؟{' '}
              <Typography component={Link} href="/auth/sign-up" sx={{ color: ACCENT_ORANGE, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                ثبت‌نام کنید
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
