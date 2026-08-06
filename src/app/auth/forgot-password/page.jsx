'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, Stack, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Call, Lock, Eye, EyeSlash, ArrowRight, TickCircle } from 'iconsax-reactjs';
import Link from 'next/link';

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

const neoSoft = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

// ==================== OTP Input ====================
function OtpInput({ value, onChange, length = 5 }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const newValue = value.split('');
    newValue[index] = val[val.length - 1];
    onChange(newValue.join(''));

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');

      if (newValue[index]) {
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, ''));
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <Stack direction="row" gap={1.5} justifyContent="center" dir="ltr">
      {Array.from({ length }).map((_, index) => (
        <Box
          key={index}
          component="input"
          ref={(el) => (inputsRef.current[index] = el)}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          sx={{
            width: 52,
            height: 56,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: INK,
            border: 'none',
            outline: 'none',
            ...neoInset,
            borderRadius: '14px',
            transition: 'all 0.2s ease',
            '&:focus': {
              boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}, 0 0 0 2px ${alpha(ACCENT_ORANGE, 0.35)}`,
            },
          }}
        />
      ))}
    </Stack>
  );
}

// ==================== Main Page ====================
export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: phone | 2: otp | 3: new password | 4: success
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer for resend OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    // اینجا API ارسال OTP صدا زده می‌شود
    setStep(2);
    setTimer(120);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 5) return;
    // اینجا API تایید OTP صدا زده می‌شود
    setStep(3);
  };

  const handleResetPassword = () => {
    if (password.length < 8 || password !== confirmPassword) return;
    // اینجا API تغییر رمز صدا زده می‌شود
    setStep(4);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    // ارسال مجدد OTP
    setTimer(120);
    setOtp('');
  };

  return (
    <Box
      sx={{
        bgcolor: BG,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 } }}>
          {/* ========== STEP 1: Phone ========== */}
          {step === 1 && (
            <>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK, mb: 1 }}>بازیابی رمز عبور</Typography>
                <Typography sx={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.7 }}>شماره موبایلی که با آن ثبت‌نام کرده‌اید را وارد کنید</Typography>
              </Box>

              <Stack gap={2.5}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>شماره موبایل</Typography>
                  <TextField
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    inputProps={{ maxLength: 11 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Call size={18} color={INK_SOFT} />
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

                <Button
                  fullWidth
                  onClick={handleSendOtp}
                  disabled={phone.length < 10}
                  sx={{
                    py: 1.8,
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#fff',
                    bgcolor: ACCENT_ORANGE,
                    boxShadow: `6px 6px 16px ${SHADOW_DARK}, -4px -4px 12px ${SHADOW_LIGHT}`,
                    '&:hover': { bgcolor: '#E06B10' },
                    '&.Mui-disabled': {
                      bgcolor: alpha(ACCENT_ORANGE, 0.4),
                      color: '#fff',
                    },
                  }}
                >
                  ارسال کد تایید
                </Button>
              </Stack>
            </>
          )}

          {/* ========== STEP 2: OTP ========== */}
          {step === 2 && (
            <>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK, mb: 1 }}>کد تایید را وارد کنید</Typography>
                <Typography sx={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.7 }}>
                  کد ۵ رقمی ارسال‌شده به{' '}
                  <Typography component="span" sx={{ fontWeight: 700, color: INK, direction: 'ltr' }}>
                    {phone}
                  </Typography>{' '}
                  را وارد کنید
                </Typography>
              </Box>

              <Stack gap={3}>
                <OtpInput value={otp} onChange={setOtp} length={5} />

                {/* Timer / Resend */}
                <Box sx={{ textAlign: 'center' }}>
                  {timer > 0 ? (
                    <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>
                      ارسال مجدد کد تا{' '}
                      <Typography component="span" sx={{ fontWeight: 700, color: ACCENT_ORANGE }}>
                        {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                      </Typography>
                    </Typography>
                  ) : (
                    <Typography
                      onClick={handleResendOtp}
                      sx={{
                        fontSize: 13.5,
                        color: ACCENT_ORANGE,
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      ارسال مجدد کد
                    </Typography>
                  )}
                </Box>

                <Button
                  fullWidth
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 5}
                  sx={{
                    py: 1.8,
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#fff',
                    bgcolor: ACCENT_ORANGE,
                    boxShadow: `6px 6px 16px ${SHADOW_DARK}, -4px -4px 12px ${SHADOW_LIGHT}`,
                    '&:hover': { bgcolor: '#E06B10' },
                    '&.Mui-disabled': {
                      bgcolor: alpha(ACCENT_ORANGE, 0.4),
                      color: '#fff',
                    },
                  }}
                >
                  تایید کد
                </Button>

                <Button
                  fullWidth
                  onClick={() => setStep(1)}
                  startIcon={<ArrowRight size={18} style={{ marginLeft: '8px' }} />}
                  sx={{
                    py: 1.4,
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: 13.5,
                    color: INK_SOFT,
                    ...neoSoft,
                    '&:hover': {
                      boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                    },
                  }}
                >
                  تغییر شماره موبایل
                </Button>
              </Stack>
            </>
          )}

          {/* ========== STEP 3: New Password ========== */}
          {step === 3 && (
            <>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK, mb: 1 }}>رمز عبور جدید</Typography>
                <Typography sx={{ fontSize: 14, color: INK_SOFT }}>رمز عبور جدید خود را وارد و تایید کنید</Typography>
              </Box>

              <Stack gap={2.2}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>رمز عبور جدید</Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="حداقل ۸ کاراکتر"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color={INK_SOFT} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
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

                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>تکرار رمز عبور</Typography>
                  <TextField
                    fullWidth
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="رمز عبور را تکرار کنید"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color={INK_SOFT} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? <EyeSlash size={18} color={INK_SOFT} /> : <Eye size={18} color={INK_SOFT} />}
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

                <Button
                  fullWidth
                  onClick={handleResetPassword}
                  disabled={password.length < 8 || password !== confirmPassword}
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
                    '&.Mui-disabled': {
                      bgcolor: alpha(ACCENT_ORANGE, 0.4),
                      color: '#fff',
                    },
                  }}
                >
                  تغییر رمز عبور
                </Button>
              </Stack>
            </>
          )}

          {/* ========== STEP 4: Success ========== */}
          {step === 4 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  background: SURFACE,
                  boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`,
                  color: '#38A169',
                }}
              >
                <TickCircle size={36} variant="Bold" />
              </Box>

              <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mb: 1.5 }}>رمز عبور با موفقیت تغییر کرد</Typography>
              <Typography sx={{ fontSize: 14, color: INK_SOFT, mb: 3.5, lineHeight: 1.7 }}>اکنون می‌توانید با رمز عبور جدید وارد حساب کاربری خود شوید.</Typography>

              <Button
                component={Link}
                href="/auth/sign-in"
                fullWidth
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
                ورود به حساب کاربری
              </Button>
            </Box>
          )}

          {/* Back to Sign In (steps 1-3) */}
          {step < 4 && (
            <Box sx={{ textAlign: 'center', mt: 3.5 }}>
              <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>
                رمز عبور خود را به یاد آوردید؟{' '}
                <Typography
                  component={Link}
                  href="/auth/sign-in"
                  sx={{
                    color: ACCENT_ORANGE,
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  وارد شوید
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
