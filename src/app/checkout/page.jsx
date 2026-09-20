'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Button, IconButton, CircularProgress, Alert, Stepper, Step, StepLabel, InputBase, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Location, Call, User, TickCircle, Card as CardIcon, Receipt, TicketDiscount, CloseCircle } from 'iconsax-reactjs';
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
const ACCENT_RED = '#E53E3E';
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
  const [form, setForm] = useState({ fullName: '', phone: '', city: 'تهران', address: '', postalCode: '', addressNote: '', discountCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [payable, setPayable] = useState(0);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // ✅ new: کد تخفیفی که از صفحه‌ی سبد خرید قبلاً اعمال و در localStorage
  // ذخیره شده. اگه وجود داشته باشه، دیگه کاربر رو مجبور به تایپ دوباره نمی‌کنیم -
  // مستقیم همون کد رو استفاده می‌کنیم و فقط یه نوار "اعمال شده" نشون میدیم.
  const [cartDiscount, setCartDiscount] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('appliedDiscount');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.code) setCartDiscount(parsed);
      }
    } catch {
      // localStorage خراب یا JSON نامعتبر - نادیده بگیر و بذار کاربر دستی وارد کنه
    }
  }, []);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  // کد تخفیفی که واقعاً باید به سرور فرستاده بشه: اول کد اعمال‌شده تو سبد خرید،
  // وگرنه چیزی که کاربر دستی تو همین صفحه تایپ کرده
  const effectiveDiscountCode = cartDiscount?.code || form.discountCode?.trim() || null;

  const handleForgetCartDiscount = () => {
    setCartDiscount(null);
    localStorage.removeItem('appliedDiscount');
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.phone || !form.address) return setError('همه فیلدها الزامی است');

    setLoading(true);
    // ✅ was: localStorage.getItem('cartToken') directly — if this page is
    // opened before any other page ever created a cart token, that returns
    // null and the checkout request goes out with an empty x-cart-token.
    // getCartToken() creates one on the spot if it doesn't exist yet.
    const token = getCartToken();

    try {
      const { data } = await axiosInstance.post(
        '/api/v1/orders/checkout',
        // ✅ was: form.discountCode?.trim() only — now uses the code already
        // applied on the cart page when one exists, so the user never has to
        // re-enter it here.
        { ...form, discountCode: effectiveDiscountCode },
        {
          headers: { 'x-cart-token': token },
        }
      );
      setOrderCode(data.orderCode);
      setSubtotal(data.subtotal ?? 0);
      setDiscountAmount(data.discountAmount ?? 0);
      setDiscountApplied(!!data.discountApplied);
      setPayable(data.payableAmount);

      // ✅ if a discount code was entered but the backend didn't accept it
      // (expired / over-used / below minimum), tell the user instead of
      // silently charging full price.
      if (effectiveDiscountCode && !data.discountApplied) {
        setError('کد تخفیف معتبر نبود یا قابل اعمال نیست، سفارش با قیمت اصلی ثبت شد');
        // اگه کد از سبد خرید اومده بود و دیگه معتبر نیست، از localStorage هم پاکش کن
        if (cartDiscount) handleForgetCartDiscount();
      }

      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentError('');
    try {
      if (!orderCode) {
        setPaymentError('ابتدا سفارش خود را ثبت کنید');
        return;
      }

      const cartToken = localStorage.getItem('cartToken');

      if (!cartToken) {
        setPaymentError('سبد خرید پیدا نشد');
        return;
      }

      setPaying(true);

      const response = await axiosInstance.post(
        `/api/v1/orders/${encodeURIComponent(orderCode)}/pay`,
        {},
        {
          headers: {
            'x-cart-token': cartToken,
          },
        }
      );

      const data = response.data;

      if (!data?.success) {
        throw new Error(data?.message || 'خطا در ایجاد پرداخت');
      }

      if (data.alreadyPaid) {
        window.location.href = `/checkout/payment-result?status=success&order=${encodeURIComponent(orderCode)}`;
        return;
      }

      if (!data.paymentUrl) {
        throw new Error('لینک پرداخت از زرین‌پال دریافت نشد');
      }

      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error('handlePayment error:', error);
      // ✅ was: alert(...) only — the Alert box rendered in step 1 read from
      // `error`, which handlePayment never set, so it was always empty.
      // Using a dedicated paymentError state feeds that Alert correctly.
      setPaymentError(error?.response?.data?.message || error?.message || 'خطا در انتقال به درگاه پرداخت');
    } finally {
      setPaying(false);
    }
  };

  // ==================== فاکتور تایید ====================
  // نکته: چون handlePayment بعد از موفقیت مستقیم ریدایرکت میکنه (window.location.href)،
  // این مرحله در حال حاضر هیچ‌وقت رندر نمیشه مگر جایی صریحاً setActiveStep(2) صدا زده بشه.
  // اگر می‌خوای این صفحه واقعاً دیده بشه، باید صفحه‌ی /checkout/payment-result همین بلاک رو
  // نمایش بده، یا اینجا به‌جای ریدایرکت از setActiveStep(2) استفاده کنی.
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
        <Container maxWidth="xl">
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
                {/* ✅ new: اگه کد تخفیف قبلاً تو صفحه‌ی سبد خرید اعمال شده، دیگه
                    اینپوت نشون نمیدیم - فقط یه نوار "اعمال شده" با گزینه‌ی حذف.
                    فقط وقتی کاربر مستقیم اومده تو checkout (بدون اعمال کد تو سبد)
                    اینپوت دستی نمایش داده میشه. */}
                {cartDiscount ? (
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.2, borderRadius: '14px', bgcolor: alpha(ACCENT_GREEN, 0.08), border: `1px solid ${alpha(ACCENT_GREEN, 0.25)}` }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <TicketDiscount size={17} variant="Bold" color={ACCENT_GREEN} />
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: ACCENT_GREEN }}>کد تخفیف {cartDiscount.code} اعمال شد</Typography>
                    </Stack>
                    <IconButton size="small" onClick={handleForgetCartDiscount} sx={{ color: ACCENT_RED }}>
                      <CloseCircle size={18} />
                    </IconButton>
                  </Stack>
                ) : (
                  <NeoField label="کد تخفیف (اختیاری)" value={form.discountCode} onChange={handleChange('discountCode')} icon={CardIcon} placeholder="مثلاً OFF20" />
                )}
                <Button type="submit" disabled={loading} fullWidth sx={{ py: 2, borderRadius: '14px', bgcolor: ACCENT, color: '#fff', fontWeight: 700, fontSize: 16 }}>
                  {loading ? <CircularProgress size={24} /> : 'ادامه و پرداخت'}
                </Button>
              </Stack>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ ...neoRaised, p: 5 }}>
              {paymentError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {paymentError}
                </Alert>
              )}
              <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 3 }}>صورت‌حساب شما</Typography>

              {/* ✅ new: show subtotal / discount breakdown when a code was applied */}
              {discountApplied && discountAmount > 0 && (
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: 14, color: INK_SOFT }}>جمع سبد خرید: {ConvertToPersianDigit(subtotal.toLocaleString())} تومان</Typography>
                  <Typography sx={{ fontSize: 14, color: ACCENT_GREEN }}>تخفیف اعمال شد: {ConvertToPersianDigit(discountAmount.toLocaleString())}- تومان</Typography>
                </Stack>
              )}

              <Typography sx={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>مبلغ قابل پرداخت: {ConvertToPersianDigit(payable.toLocaleString())} تومان</Typography>

              {/* ✅ was: disabled={loading} and CircularProgress driven by `loading`,
                  which is only ever true during the address-submit step, so this
                  button never showed a loading state and could be double-clicked. */}
              <Button fullWidth onClick={handlePayment} disabled={paying} sx={{ mt: 4, py: 2.5, borderRadius: '14px', bgcolor: '#2F9E44', color: '#fff', fontWeight: 700, fontSize: 17 }}>
                {paying ? <CircularProgress size={24} color="inherit" /> : 'پرداخت با زرین‌پال'}
              </Button>
              <Button fullWidth onClick={() => setActiveStep(0)} disabled={paying} sx={{ mt: 2, py: 1.5, ...neoSoft }}>
                ویرایش آدرس
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
