'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Button, CircularProgress, Alert, Stepper, Step, StepLabel, InputBase, Divider } from '@mui/material';
import { Location, Call, User, TickCircle, Card as CardIcon, Receipt } from 'iconsax-reactjs';
import { useRouter } from 'next/navigation';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import axiosInstance from '@/utils/API/axiosInstance';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT = '#F57C1F';
const ACCENT_GREEN = '#2F9E44';
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

const steps = ['ثبت آدرس', 'پرداخت صورت‌حساب', 'فاکتور تایید'];

function getCartToken() {
  if (typeof window === 'undefined') return null;
  let t = localStorage.getItem('cartToken');
  if (!t) {
    t = crypto.randomUUID();
    localStorage.setItem('cartToken', t);
  }
  return t;
}

// فیلد نئومورفیک
function NeoField({ label, value, onChange, placeholder, icon: Icon, multiline = false, minRows = 1, required = false, type = 'text' }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK_SOFT, mb: 1, pr: 0.5 }}>
        {label}
        {required && (
          <Box component="span" sx={{ color: ACCENT, mr: 0.3 }}>
            *
          </Box>
        )}
      </Typography>

      <Stack direction="row" alignItems={multiline ? 'flex-start' : 'center'} gap={1.2} sx={{ ...neoInset, px: 2, py: multiline ? 1.5 : 0, minHeight: multiline ? 'auto' : 48 }}>
        {Icon && (
          <Box sx={{ mt: multiline ? 0.6 : 0, display: 'flex', color: INK_SOFT, flexShrink: 0 }}>
            <Icon size={18} />
          </Box>
        )}

        <InputBase value={value} onChange={onChange} placeholder={placeholder} multiline={multiline} minRows={minRows} type={type} fullWidth sx={{ fontSize: 14, color: INK, fontFamily: 'inherit', '& input::placeholder, & textarea::placeholder': { color: INK_SOFT, opacity: 0.85 } }} />
      </Stack>
    </Box>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ fullName: '', phone: '', city: 'تهران', address: '', postalCode: '', addressNote: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [payable, setPayable] = useState(0);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) return setError('همه فیلدها الزامی است');

    setLoading(true);
    const token = localStorage.getItem('cartToken');

    try {
      const { data } = await axiosInstance.post(
        '/api/v1/orders/checkout',
        { ...form },
        {
          headers: { 'x-cart-token': token },
        }
      );
      setOrderCode(data.orderCode);
      setPayable(data.payableAmount);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!orderData?.orderCode) return;

    setPaying(true);
    setError('');

    try {
      const token = localStorage.getItem('cartToken');

      const { data } = await axiosInstance.post(`/api/v1/orders/${orderData.orderCode}/pay`, {}, { headers: { 'x-cart-token': token } });

      if (data.paymentUrl) {
        // هدایت به صفحه پرداخت زرین‌پال
        window.location.href = data.paymentUrl;
      } else {
        setError('خطا در دریافت لینک پرداخت');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'خطا در اتصال به درگاه');
    } finally {
      setPaying(false);
    }
  };

  // ==================== فاکتور تایید ====================
  if (activeStep === 2) {
    return (
      <ChildrenLayout>
        <Box sx={{ bgcolor: BG, minHeight: '100vh', py: 10 }}>
          <Container maxWidth="md">
            <Box sx={{ ...neoRaised, p: 5, textAlign: 'center' }}>
              <Box sx={{ width: 80, height: 80, borderRadius: '20px', mx: 'auto', mb: 3, ...neoSoft, color: ACCENT_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TickCircle size={50} color={ACCENT_GREEN} />
              </Box>

              <Typography sx={{ fontWeight: 800, fontSize: 26, color: INK, mb: 2 }}>پرداخت با موفقیت انجام شد</Typography>
              <Typography sx={{ color: INK_SOFT, mb: 4, fontSize: 15 }}>فاکتور شما ثبت شد. پیک به زودی برای برداشتن زین از مغازه شریف‌زین مراجعه می‌کند.</Typography>

              <Box sx={{ ...neoInset, p: 3, textAlign: 'right', mb: 4 }}>
                <Typography sx={{ fontSize: 15, color: INK }}>
                  کد پیگیری: <strong>{orderCode}</strong>
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: ACCENT, mt: 1 }}>{ConvertToPersianDigit(payable.toLocaleString())} تومان</Typography>
              </Box>

              <Button fullWidth size="large" onClick={() => router.push(`/orders/${orderCode}`)} sx={{ py: 2, borderRadius: '14px', bgcolor: ACCENT, color: '#fff', fontWeight: 700, fontSize: 16 }}>
                پیگیری سفارش
              </Button>
              <Button fullWidth size="large" onClick={() => router.push('/products')} sx={{ mt: 2, py: 2, borderRadius: '14px', ...neoSoft }}>
                بازگشت به فروشگاه
              </Button>
            </Box>
          </Container>
        </Box>
      </ChildrenLayout>
    );
  }

  // ==================== فرم اصلی ====================
  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 800, fontSize: 26, color: INK, mb: 2 }}>ادامه فرآیند خرید</Typography>
          <Typography sx={{ color: INK_SOFT, mb: 4 }}>آدرس خود را وارد کنید تا پیک برای برداشتن زین مراجعه کند.</Typography>

          {/* Stepper */}
          <Box sx={{ ...neoSoft, p: 3, mb: 5 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: 13, color: INK_SOFT }, '& .MuiStepLabel-label.Mui-active': { color: ACCENT, fontWeight: 700 } }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {activeStep === 0 && (
            <Box component="form" onSubmit={handleAddressSubmit} sx={{ ...neoRaised, p: 5 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              <Stack spacing={3}>
                <NeoField label="نام و نام خانوادگی" value={form.fullName} onChange={handleChange('fullName')} icon={User} required placeholder="مرتضی حسین زاده" />
                <NeoField label="شماره موبایل" value={form.phone} onChange={handleChange('phone')} icon={Call} required placeholder="0912xxxxxxx" type="tel" />
                <NeoField label="شهر" value={form.city} onChange={handleChange('city')} icon={Location} placeholder="تهران" />
                <NeoField label="آدرس کامل" value={form.address} onChange={handleChange('address')} icon={Location} required multiline minRows={3} placeholder="خیابان، کوچه، پلاک..." />
                <NeoField label="کد پستی (اختیاری)" value={form.postalCode} onChange={handleChange('postalCode')} placeholder="۱۰ رقم" />
                <NeoField label="توضیحات برای پیک (اختیاری)" value={form.addressNote} onChange={handleChange('addressNote')} multiline minRows={2} placeholder="مثلاً: زنگ واحد ۳" />
                <Button type="submit" disabled={loading} fullWidth sx={{ py: 2, borderRadius: '14px', bgcolor: ACCENT, color: '#fff', fontWeight: 700, fontSize: 16 }}>
                  {loading ? <CircularProgress size={24} /> : 'ادامه و پرداخت'}
                </Button>
              </Stack>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ ...neoRaised, p: 5 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 3 }}>صورت‌حساب شما</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>مبلغ قابل پرداخت: {ConvertToPersianDigit(payable.toLocaleString())} تومان</Typography>

              <Button fullWidth onClick={handlePayment} disabled={loading} sx={{ mt: 4, py: 2.5, borderRadius: '14px', bgcolor: '#2F9E44', color: '#fff', fontWeight: 700, fontSize: 17 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'پرداخت با زرین‌پال'}
              </Button>
              <Button fullWidth onClick={() => setActiveStep(0)} sx={{ mt: 2, py: 1.5, ...neoSoft }}>
                ویرایش آدرس
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
