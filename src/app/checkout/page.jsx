'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Button, IconButton, CircularProgress, Alert, Stepper, Step, StepLabel, InputBase } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Location, Call, User, TickCircle, Card as CardIcon, TicketDiscount, CloseCircle, Shop, Truck, Box1, Box as BoxIcon } from 'iconsax-reactjs';
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

// مقادیر ذخیره‌شده در دیتابیس (pickup_method / return_method)
const PICKUP_METHODS = [
  { value: 'in_person', label: 'تحویل حضوری', desc: 'خودم زین را به مغازه شریف‌زین می‌آورم', icon: Shop },
  { value: 'snapp', label: 'اسنپ / پیک', desc: 'پیک از آدرس من زین را می‌گیرد', icon: Truck },
  { value: 'tipax', label: 'تیپاکس', desc: 'با تیپاکس برای مغازه ارسال می‌کنم', icon: Box1 },
  { value: 'post', label: 'پست', desc: 'با پست برای مغازه ارسال می‌کنم', icon: BoxIcon },
];

const RETURN_METHODS = [
  { value: 'in_person', label: 'تحویل حضوری', desc: 'خودم از مغازه تحویل می‌گیرم', icon: Shop },
  { value: 'snapp', label: 'اسنپ / پیک', desc: 'با پیک به آدرسم ارسال شود', icon: Truck },
  { value: 'tipax', label: 'تیپاکس', desc: 'با تیپاکس به آدرسم ارسال شود', icon: Box1 },
  { value: 'post', label: 'پست', desc: 'با پست به آدرسم ارسال شود', icon: BoxIcon },
];

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

// گروه انتخاب نئومورفیک (انتخاب‌شده = فرورفته)
function NeoChoiceGroup({ title, hint, options, value, onChange }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: INK, mb: 0.5 }}>{title}</Typography>
      {hint && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 1.5, lineHeight: 1.9 }}>{hint}</Typography>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {options.map((opt) => {
          const selected = value === opt.value;
          const Icon = opt.icon;
          return (
            <Box
              key={opt.value}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(opt.value)}
              sx={{
                ...(selected ? neoInset : neoSoft),
                p: 2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                border: `1.5px solid ${selected ? ACCENT : 'transparent'}`,
                transition: 'all .2s',
                outline: 'none',
              }}>
              <Box sx={{ display: 'flex', color: selected ? ACCENT : INK_SOFT, flexShrink: 0 }}>
                <Icon size={24} variant={selected ? 'Bold' : 'Linear'} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: selected ? ACCENT : INK }}>{opt.label}</Typography>
                <Typography sx={{ fontSize: 12, color: INK_SOFT, mt: 0.3 }}>{opt.desc}</Typography>
              </Box>
              {selected && <TickCircle size={20} variant="Bold" color={ACCENT} />}
            </Box>
          );
        })}
      </Box>
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
  const [shippingCost, setShippingCost] = useState(0);
  const [payable, setPayable] = useState(0);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // ✅ new: آیا سبد شامل محصولی است که مشتری باید جنسش را به مغازه تحویل بدهد؟
  const [requiresPhysical, setRequiresPhysical] = useState(false);
  // ✅ new: دو انتخاب مستقل - روش رسوندن زین به مغازه / روش دریافت بعد از بررسی
  const [pickupMethod, setPickupMethod] = useState('in_person');
  const [returnMethod, setReturnMethod] = useState('in_person');

  // کد تخفیفی که از صفحه‌ی سبد خرید قبلاً اعمال و در localStorage ذخیره شده
  const [cartDiscount, setCartDiscount] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('appliedDiscount');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.code) setCartDiscount(parsed);
      }
    } catch {
      // localStorage خراب یا JSON نامعتبر - نادیده بگیر
    }
  }, []);

  // ✅ new: چک می‌کنیم آیتم‌های سبد requires_physical_item = 1 دارن یا نه.
  // فرض: GET /api/v1/cart آیتم‌ها رو برمی‌گردونه. اگه ساختار پاسخ یا آدرس فرق داره،
  // فقط همین بلاک رو با ساختار واقعی API خودت تنظیم کن.
  useEffect(() => {
    const token = getCartToken();
    axiosInstance
      .get('/api/v1/cart', { headers: { 'x-cart-token': token } })
      .then(({ data }) => {
        console.log(data);
        const items = data?.items || data?.cart?.items || [];
        const needs = items.some((it) => Number(it?.requires_physical_item ?? it?.requiresPhysicalItem ?? it?.product?.requires_physical_item) === 1);
        setRequiresPhysical(needs);
      })
      .catch(() => {
        // اگه سبد خونده نشد، بخش رو نشون نمیدیم؛ بک‌اند هم باید خودش دوباره چک کنه
      });
  }, []);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

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
    const token = getCartToken();

    try {
      const { data } = await axiosInstance.post(
        '/api/v1/orders/checkout',
        {
          ...form,
          discountCode: effectiveDiscountCode,
          // ✅ new: فقط برای سفارش‌های نیازمند تحویل کالا ارسال میشن.
          // بک‌اند باید دوباره از روی دیتابیس چک کنه که واقعاً requires_physical_item دارن
          // و مقدار رو با لیست مجاز (in_person/snapp/tipax/post/other) اعتبارسنجی کنه.
          pickupMethod: requiresPhysical ? pickupMethod : null,
          returnMethod: requiresPhysical ? returnMethod : null,
          // آدرس مبدا برای دریافت کالا: اگه حضوری نیست همون آدرس فرم
          pickupAddress: requiresPhysical && pickupMethod !== 'in_person' ? form.address : null,
        },
        {
          headers: { 'x-cart-token': token },
        }
      );
      setOrderCode(data.orderCode);
      setSubtotal(data.subtotal ?? 0);
      setDiscountAmount(data.discountAmount ?? 0);
      setDiscountApplied(!!data.discountApplied);
      setShippingCost(data.shippingCost ?? 0);
      setPayable(data.payableAmount);

      if (effectiveDiscountCode && !data.discountApplied) {
        setError('کد تخفیف معتبر نبود یا قابل اعمال نیست، سفارش با قیمت اصلی ثبت شد');
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
      setPaymentError(error?.response?.data?.message || error?.message || 'خطا در انتقال به درگاه پرداخت');
    } finally {
      setPaying(false);
    }
  };

  // ==================== فاکتور تایید ====================
  // نکته: handlePayment بعد از موفقیت ریدایرکت می‌کنه، پس این مرحله فقط وقتی
  // دیده میشه که صفحه‌ی /checkout/payment-result همین بلاک رو نشون بده یا
  // setActiveStep(2) صدا زده بشه.
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
              <Typography sx={{ color: INK_SOFT, mb: 4, fontSize: 15 }}>{requiresPhysical && pickupMethod === 'in_person' ? 'فاکتور شما ثبت شد. لطفاً زین را به مغازه شریف‌زین تحویل دهید.' : requiresPhysical ? 'فاکتور شما ثبت شد. هماهنگی دریافت زین از شما به‌زودی انجام می‌شود.' : 'فاکتور شما ثبت شد.'}</Typography>

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
          <Typography sx={{ color: INK_SOFT, mb: 4 }}>{requiresPhysical ? 'آدرس خود را وارد کنید و روش تحویل زین به مغازه و دریافت مجدد آن را انتخاب کنید.' : 'آدرس خود را وارد کنید.'}</Typography>

          {/* Stepper */}
          <Box sx={{ ...neoSoft, p: 3, mb: 5 }}>
            <Stepper activeStep={activeStep}>
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

                {/* ✅ new: فقط برای سفارش‌هایی که جنس مشتری باید به مغازه برسه */}
                {requiresPhysical && (
                  <Box sx={{ ...neoSoft, p: { xs: 2.5, md: 3.5 } }}>
                    <Stack spacing={4}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: 17, color: INK, mb: 0.5 }}>تحویل و دریافت زین</Typography>
                        <Typography sx={{ fontSize: 13, color: INK_SOFT, lineHeight: 2 }}>برای این سفارش باید زین خودتان را به مغازه شریف‌زین برسانید. بعد از دریافت و بررسی، زین را دوباره تحویل می‌گیرید. این دو انتخاب کاملاً مستقل از هم هستند.</Typography>
                      </Box>

                      <NeoChoiceGroup title="۱. زین را چطور به مغازه می‌رسانید؟" options={PICKUP_METHODS} value={pickupMethod} onChange={setPickupMethod} />

                      {pickupMethod !== 'in_person' && (
                        <Alert severity="info" sx={{ borderRadius: '14px' }}>
                          دریافت زین از «آدرس کامل» بالا انجام می‌شود. هزینه ارسال در مرحله بعد در صورت‌حساب نمایش داده می‌شود.
                        </Alert>
                      )}

                      <NeoChoiceGroup title="۲. بعد از بررسی، زین را چطور دریافت می‌کنید؟" options={RETURN_METHODS} value={returnMethod} onChange={setReturnMethod} />
                    </Stack>
                  </Box>
                )}

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

              {/* خلاصه روش‌های تحویل */}
              {requiresPhysical && (
                <Stack spacing={0.5} sx={{ mb: 2, ...neoInset, p: 2 }}>
                  <Typography sx={{ fontSize: 14, color: INK_SOFT }}>تحویل زین به مغازه: {PICKUP_METHODS.find((m) => m.value === pickupMethod)?.label}</Typography>
                  <Typography sx={{ fontSize: 14, color: INK_SOFT }}>دریافت بعد از بررسی: {RETURN_METHODS.find((m) => m.value === returnMethod)?.label}</Typography>
                </Stack>
              )}

              {(discountApplied && discountAmount > 0) || shippingCost > 0 ? (
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: 14, color: INK_SOFT }}>جمع سبد خرید: {ConvertToPersianDigit(subtotal.toLocaleString())} تومان</Typography>
                  {discountApplied && discountAmount > 0 && <Typography sx={{ fontSize: 14, color: ACCENT_GREEN }}>تخفیف اعمال شد: {ConvertToPersianDigit(discountAmount.toLocaleString())}- تومان</Typography>}
                  {shippingCost > 0 && <Typography sx={{ fontSize: 14, color: INK_SOFT }}>هزینه ارسال: {ConvertToPersianDigit(shippingCost.toLocaleString())} تومان</Typography>}
                </Stack>
              ) : null}

              <Typography sx={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>مبلغ قابل پرداخت: {ConvertToPersianDigit(payable.toLocaleString())} تومان</Typography>

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
