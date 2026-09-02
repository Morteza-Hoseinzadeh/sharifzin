'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Button, IconButton, Divider, InputBase, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, Minus, Trash, ShoppingCart, TickCircle, TicketDiscount, CloseCircle } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import { useRouter } from 'next/navigation';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_GREEN = '#2F9E44';
const ACCENT_RED = '#E53E3E';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`, border: 'none' };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '14px', boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}` };

// ==================== Helpers ====================
function getCartToken() {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('cartToken');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('cartToken', token);
  }
  return token;
}

// ==================== Components ====================
function QuantityControl({ value, onIncrease, onDecrease, disabled }) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton size="small" onClick={onIncrease} disabled={disabled} sx={{ width: 32, height: 32, borderRadius: '10px', bgcolor: ACCENT_ORANGE, color: '#fff' }}>
        <Add size={16} />
      </IconButton>
      <Box sx={{ minWidth: 42, height: 32, ...neoInset, fontWeight: 700, fontSize: 14, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ConvertToPersianDigit(value)}</Box>
      <IconButton size="small" onClick={onDecrease} disabled={disabled || value <= 1} sx={{ width: 32, height: 32, borderRadius: '10px', bgcolor: ACCENT_ORANGE, color: '#fff' }}>
        <Minus size={16} />
      </IconButton>
    </Stack>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove, loading }) {
  const price = item?.price_at_add || item?.final_price || item?.price || 0;
  const imageSrc = item?.thumbnail;

  return (
    <Box sx={{ ...neoSoft, p: 2.5 }}>
      <Stack direction="row" gap={2} alignItems="center">
        <Box sx={{ width: 90, height: 90, borderRadius: '14px', bgcolor: alpha(ACCENT_ORANGE, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', ...neoInset }}>{imageSrc ? <img src={imageSrc} alt={item?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoppingCart size={28} color={alpha(ACCENT_ORANGE, 0.4)} />}</Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: INK, mb: 0.6 }}>{item?.title}</Typography>
          {item?.color && <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 1.5 }}>رنگ دوخت: {item?.color}</Typography>}

          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={1.5}>
            <QuantityControl value={item?.quantity} onIncrease={() => onIncrease(item?.id)} onDecrease={() => onDecrease(item?.id)} disabled={loading} />

            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>{ConvertToPersianDigit((price * item?.quantity).toLocaleString())} تومان</Typography>

              <IconButton size="small" onClick={() => onRemove(item?.id)} disabled={loading} sx={{ color: '#E53E3E' }}>
                <Trash size={18} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

// ==================== Discount Code Component ====================
function DiscountCodeBox({ discountCode, setDiscountCode, appliedDiscount, discountError, onApply, onRemove }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onApply();
  };

  return (
    <Box sx={{ mb: 4 }}>
      {!appliedDiscount ? (
        <Stack direction="row" gap={1} alignItems="center">
          <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1, p: 3, ...neoInset, height: 42 }}>
            <TicketDiscount size={18} color={INK_SOFT} />
            <InputBase value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} onKeyDown={handleKeyDown} placeholder="کد تخفیف را وارد کنید" sx={{ flex: 1, fontSize: 13.5, color: INK }} />
          </Stack>

          <Button onClick={onApply} sx={{ height: 42, px: 2.5, borderRadius: '14px', fontSize: 13, color: '#fff', bgcolor: ACCENT_ORANGE }}>
            اعمال کد
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.2, borderRadius: '14px', bgcolor: alpha(ACCENT_GREEN, 0.08), border: `1px solid ${alpha(ACCENT_GREEN, 0.25)}` }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <TickCircle size={17} variant="Bold" color={ACCENT_GREEN} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: ACCENT_GREEN }}>
              {appliedDiscount.code} اعمال شد ({appliedDiscount.label})
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onRemove} sx={{ color: ACCENT_RED }}>
            <CloseCircle size={18} />
          </IconButton>
        </Stack>
      )}

      {discountError && <Typography sx={{ fontSize: 12, color: ACCENT_RED, mt: 1 }}>{discountError}</Typography>}
    </Box>
  );
}

// ==================== Main Page ====================
export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');

  // ==================== API ====================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = getCartToken();
      const { data } = await axiosInstance.get('/api/v1/cart', { headers: { 'x-cart-token': token } });
      setCart(data?.items || []);
    } catch (err) {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setActionLoading(true);
      const token = getCartToken();

      // 1. آپدیت تعداد
      await axiosInstance.patch(`/api/v1/cart/item/${itemId}`, { quantity: newQuantity }, { headers: { 'x-cart-token': token } });

      // 2. گرفتن سبد جدید
      const { data: cartData } = await axiosInstance.get('/api/v1/cart', {
        headers: { 'x-cart-token': token },
      });

      const freshItems = cartData?.items || [];
      setCart(freshItems);

      // 3. محاسبه totalPrice از داده‌ی تازه
      const freshTotalPrice = freshItems.reduce((sum, item) => sum + (item?.price_at_add || 0) * (item?.quantity || 0), 0);

      // 4. اگر کد تخفیف فعال بود، دوباره validate کن
      if (appliedDiscount?.code) {
        try {
          const { data } = await axiosInstance.post('/api/v1/discount/validate', {
            code: appliedDiscount.code, // نه discountCode
            totalPrice: freshTotalPrice, // قیمت تازه
          });

          if (data?.success && data?.discount) {
            setAppliedDiscount({
              code: data.discount.code,
              type: data.discount.type,
              value: data.discount.value,
              label: data.discount.label,
              discountAmount: data.discount.discountAmount,
            });
            localStorage.setItem('appliedDiscount', JSON.stringify(data.discount));
          } else {
            // اگر دیگر معتبر نبود، پاکش کن
            setAppliedDiscount(null);
            localStorage.removeItem('appliedDiscount');
            setDiscountError(data?.message || 'کد تخفیف دیگر معتبر نیست');
          }
        } catch (err) {
          console.error('Re-validate discount error:', err);
          setAppliedDiscount(null);
          localStorage.removeItem('appliedDiscount');
        }
      }
    } catch (err) {
      console.error('Update quantity error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const increaseQty = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;
    updateQuantity(itemId, item.quantity + 1);
  };

  const decreaseQty = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item || item.quantity <= 1) return;
    updateQuantity(itemId, item.quantity - 1);
  };

  const removeItem = async (itemId) => {
    try {
      setActionLoading(true);
      const token = getCartToken();
      await axiosInstance.delete(`/api/v1/cart/item/${itemId}`, { headers: { 'x-cart-token': token } });
      fetchCart();
    } catch (err) {
      console.error('Remove item error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // ==================== Calculations ====================
  const totalPrice = cart.reduce((sum, item) => sum + (item?.price_at_add || 0) * item?.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item?.quantity, 0);

  const discountAmount = appliedDiscount ? (appliedDiscount.discountAmount ?? (appliedDiscount.type === 'percent' ? Math.round((totalPrice * appliedDiscount.value) / 100) : Math.min(appliedDiscount.value, totalPrice))) : 0;

  const payablePrice = totalPrice - discountAmount;

  // ==================== Discount ====================
  const handleApplyDiscount = async () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setDiscountError('لطفا کد تخفیف را وارد کنید');
      return;
    }

    try {
      setActionLoading(true);
      setDiscountError('');

      const { data } = await axiosInstance.post('/api/v1/discount/validate', {
        code,
        totalPrice,
      });

      if (data?.success && data?.discount) {
        setAppliedDiscount({
          code: data.discount.code,
          type: data.discount.type,
          value: data.discount.value,
          label: data.discount.label,
          discountAmount: data.discount.discountAmount,
        });
        localStorage.setItem('appliedDiscount', JSON.stringify(data.discount));
        setDiscountCode('');
      } else {
        setDiscountError(data?.message || 'کد تخفیف نامعتبر است');
      }
    } catch (err) {
      setDiscountError(err?.response?.data?.message || 'خطا در بررسی کد تخفیف');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError('');
    localStorage.removeItem('appliedDiscount');
  };

  // ==================== Render ====================
  if (loading) {
    return (
      <Box sx={{ bgcolor: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: ACCENT_ORANGE }} />
      </Box>
    );
  }

  if (cart.length === 0) {
    return (
      <ChildrenLayout>
        <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="sm">
            <Box sx={{ ...neoRaised, p: 5, textAlign: 'center' }}>
              <Box sx={{ width: 80, height: 80, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, background: SURFACE, boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`, color: INK_SOFT }}>
                <ShoppingCart size={36} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: INK, mb: 1.5 }}>سبد خرید شما خالی است</Typography>
              <Button component={Link} href="/products" sx={{ mt: 2, px: 4, py: 1.5, bgcolor: ACCENT_ORANGE, color: '#fff' }}>
                مشاهده محصولات
              </Button>
            </Box>
          </Container>
        </Box>
      </ChildrenLayout>
    );
  }

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK }}>سبد خرید</Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT }}>{ConvertToPersianDigit(totalItems)} کالا</Typography>
          </Stack>

          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack gap={2}>
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} onIncrease={increaseQty} onDecrease={decreaseQty} onRemove={removeItem} loading={actionLoading} />
                ))}
              </Stack>
            </Grid>

            {/* Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ ...neoRaised, p: 3, position: 'sticky', top: 24 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>خلاصه سفارش</Typography>

                <DiscountCodeBox discountCode={discountCode} setDiscountCode={setDiscountCode} appliedDiscount={appliedDiscount} discountError={discountError} onApply={handleApplyDiscount} onRemove={handleRemoveDiscount} />

                <Stack gap={1.8} sx={{ mb: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>جمع کل کالاها</Typography>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{ConvertToPersianDigit(totalPrice.toLocaleString())} تومان</Typography>
                  </Stack>

                  {appliedDiscount && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>تخفیف</Typography>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_GREEN }}>{ConvertToPersianDigit(discountAmount.toLocaleString())} تومان</Typography>
                    </Stack>
                  )}

                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>هزینه ارسال</Typography>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_ORANGE }}>رایگان</Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ borderColor: alpha(INK, 0.08), mb: 2.5 }} />

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: INK }}>مبلغ قابل پرداخت</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: INK }}>{ConvertToPersianDigit(payablePrice.toLocaleString())} تومان</Typography>
                </Stack>

                <Button fullWidth onClick={() => router.push('/checkout')} sx={{ py: 1.7, borderRadius: '14px', fontWeight: 700, fontSize: 15, color: '#fff', bgcolor: ACCENT_ORANGE, mb: 1.5 }}>
                  ادامه فرآیند خرید
                </Button>

                <Button component={Link} href="/products" fullWidth sx={{ py: 1.4, borderRadius: '14px', fontWeight: 600, color: INK, ...neoSoft }}>
                  بازگشت به فروشگاه
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
