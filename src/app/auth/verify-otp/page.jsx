'use client';

import React, { useState, Suspense } from 'react';
import { Box, Container, Typography, Stack, TextField, Button, Alert } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/utils/API/axiosInstance';

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

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get('phone') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setErrorMsg('کد تایید را وارد کنید');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const { data } = await axiosInstance.post(`/api/v1/auth/verify-otp`, { phone, code });
      console.log(data);
      localStorage.setItem('sharifzin-auth-token', data.token);
      router.push('/');
    } catch (error) {
      console.log(error);
      setErrorMsg('ارتباط با سرور برقرار نشد');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const { data } = await axiosInstance.post(`/api/v1/auth/resend-otp`, { phone, purpose: 'register' });
      if (!data) {
        setErrorMsg(data.message_fa || 'خطا در ارسال مجدد کد');
        return;
      }
      setInfoMsg(data.message || 'کد تایید ارسال شد');
    } catch {
      setErrorMsg('ارتباط با سرور برقرار نشد');
    } finally {
      setResending(false);
    }
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} sx={{ ...neoRaised, p: { xs: 3.5, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 }, color: INK, mb: 1 }}>تایید شماره موبایل</Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT }}>کد ارسال شده به {phone || 'شماره شما'} را وارد کنید</Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '14px' }}>
              {errorMsg}
            </Alert>
          )}
          {infoMsg && (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: '14px' }}>
              {infoMsg}
            </Alert>
          )}

          <Stack gap={2.5}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>کد تایید</Typography>
              <TextField fullWidth value={code} onChange={(e) => setCode(e.target.value)} placeholder="۱۲۳۴۵۶" inputProps={{ inputMode: 'numeric', maxLength: 6, dir: 'ltr', style: { textAlign: 'center', letterSpacing: 4 } }} sx={{ '& .MuiOutlinedInput-root': { ...neoInset, borderRadius: '14px', '& fieldset': { border: 'none' }, fontSize: 18, color: INK } }} />
            </Box>

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
                '&:hover': { bgcolor: '#E06B10' },
              }}
            >
              {loading ? 'در حال بررسی...' : 'تایید کد'}
            </Button>

            <Button fullWidth variant="text" disabled={resending} onClick={handleResend} sx={{ color: ACCENT_ORANGE, fontWeight: 600, fontSize: 13.5 }}>
              {resending ? 'در حال ارسال...' : 'ارسال مجدد کد'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
