'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Grid, Button, Avatar, Chip, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Bag2, WalletMoney, Location, Heart, User, ArrowLeft2, Box1, Clock, TickCircle, TruckFast } from 'iconsax-reactjs';
import Link from 'next/link';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import ChildrenLayout from '@/components/ChildrenLayout';
import useCheckUserRole from '@/utils/hooks/useCheckUserRole/useCheckUserRole';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/API/axiosInstance';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };

const quickLinks = [
  { icon: Bag2, title: 'سفارش‌های من', href: '/user/orders', color: ACCENT_ORANGE },
  { icon: Location, title: 'آدرس‌ها', href: '/user/addresses', color: '#38A169' },
  { icon: Heart, title: 'علاقه‌مندی‌ها', href: '/user/wishlist', color: '#E53E3E' },
  { icon: User, title: 'اطلاعات حساب', href: '/user/profile', color: ACCENT_BLUE },
];

// ==================== Components ====================
function StatCard({ icon: Icon, label, value, color, suffix }) {
  return (
    <Box sx={{ ...neoSoft, p: 2.5, height: '100%' }}>
      <Stack direction="row" alignItems="center" gap={1.8}>
        <Box sx={{ width: 46, height: 46, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(color, 0.12), color: color, flexShrink: 0 }}>
          <Icon size={22} variant="Bold" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mb: 0.3 }}>{label}</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 17, color: INK }}>
            {ConvertToPersianDigit(value)}
            {suffix && (
              <Typography component="span" sx={{ fontSize: 11, color: INK_SOFT, fontWeight: 500, mr: 0.5 }}>
                {suffix}
              </Typography>
            )}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function OrderItem({ order }) {
  const statusMap = {
    pending_payment: { label: 'در انتظار پرداخت', color: '#F57C1F' },
    paid: { label: 'پرداخت شده', color: '#2F9E44' },
    pickup_dispatched: { label: 'در حال برداشتن زین', color: '#3B82F6' },
    picked_up: { label: 'برداشته شده', color: '#9C27B0' },
    at_shop: { label: 'در مغازه', color: '#FF9800' },
    inspecting: { label: 'در حال بررسی', color: '#2196F3' },
    ready_to_ship: { label: 'آماده ارسال', color: '#795548' },
    return_dispatched: { label: 'در حال ارسال بازگشت', color: '#9C27B0' },
    delivered: { label: 'تحویل شده', color: '#4CAF50' },
    cancelled: { label: 'لغو شده', color: '#F44336' },
  };

  const statusInfo = statusMap[order.status] || { label: order.status, color: '#9E9E9E' };

  return (
    <Box sx={{ ...neoSoft, p: 2.2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={1.5}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK }}>{order.full_name}</Typography>
          <Typography sx={{ fontSize: 12, color: INK_SOFT }}>کد: {order.order_code}</Typography>
        </Box>

        <Chip icon={<TickCircle size={14} color={statusInfo.color} style={{ marginRight: '8px' }} />} label={statusInfo.label} size="small" sx={{ bgcolor: alpha(statusInfo.color, 0.1), color: statusInfo.color, fontWeight: 600, fontSize: 11.5, height: 28, borderRadius: '8px' }} />

        <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK }}>{order.payable_amount?.toLocaleString('fa-IR')} تومان</Typography>
      </Stack>
    </Box>
  );
}

// ==================== Main Page ====================
export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useCheckUserRole();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      return router.push('/auth/sign-in');
    }
  }, []);

  // گرفتن توکن سبد خرید
  const getCartToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cartToken');
  };

  // گرفتن سفارشات واقعی
  const getMyOrders = async (cartToken) => {
    const { data } = await axiosInstance.get('/api/v1/orders', {
      headers: { 'x-cart-token': cartToken },
    });
    return data;
  };

  useEffect(() => {
    async function fetchData() {
      if (!isLoggedIn) return;

      const token = getCartToken();
      try {
        setLoading(true);
        const data = await getMyOrders(token);
        setOrders(data.data || data.orders || []);
      } catch (err) {
        setError('خطا در دریافت سفارش‌ها');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const fetchWishlist = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/user/wishlist?id=${user?.id}`);
        setWishlist(data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/api/v1/user/addresses');
        setAddresses(data.data || []);
      } catch (err) {
        setError('خطا در دریافت آدرس‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchAddresses();
    fetchWishlist();
  }, [isLoggedIn]);

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* ========== Welcome Header ========== */}
          <Box sx={{ ...neoRaised, p: { xs: 3, md: 3.5 }, mb: 3.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(ACCENT_ORANGE, 0.15), color: ACCENT_ORANGE, fontWeight: 800, fontSize: 20, boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}` }}>{user?.full_name.charAt(0)}</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>سلام، {user?.full_name} عزیز👋</Typography>
                  <Typography sx={{ fontSize: 13, color: INK_SOFT }}>به پنل کاربری شریف‌زین خوش آمدید</Typography>
                </Box>
              </Stack>

              <Button component={Link} href="/user/profile" endIcon={<ArrowLeft2 size={16} style={{ marginRight: '8px' }} />} sx={{ px: 2.5, py: 1.2, borderRadius: '12px', fontWeight: 600, fontSize: 13, color: INK, ...neoSoft }}>
                ویرایش پروفایل
              </Button>
            </Stack>
          </Box>

          {/* ========== Stats ========== */}
          <Grid container spacing={2} sx={{ mb: 3.5 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard icon={Bag2} label="سفارش‌ها" value={orders.length} color={ACCENT_ORANGE} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard icon={WalletMoney} label="مجموع پرداختی سفارشات" value={'-'} color={ACCENT_BLUE} suffix="تومان" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard icon={Location} label="آدرس‌ها" value={addresses?.length} color="#38A169" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard icon={Heart} label="علاقه‌مندی‌ها" value={wishlist?.length} color="#E53E3E" />
            </Grid>
          </Grid>

          {/* ========== Recent Orders ========== */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK }}>سفارش‌های اخیر</Typography>
              <Button component={Link} href="/user/orders" sx={{ fontSize: 13, fontWeight: 600, color: ACCENT_ORANGE }}>
                مشاهده همه
              </Button>
            </Stack>

            {loading ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 6, color: INK_SOFT }}>هیچ سفارشی هنوز ثبت نشده است.</Typography>
            ) : (
              <Stack gap={1.5}>
                {orders.map((order, index) => (
                  <OrderItem key={index} order={order} />
                ))}
              </Stack>
            )}
          </Box>

          {/* ========== Quick Links ========== */}
          <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3 }, height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 2.5 }}>دسترسی سریع</Typography>

            <Stack gap={1.5}>
              {quickLinks.map((item, index) => (
                <Box key={index} component={Link} href={item.href} sx={{ ...neoSoft, p: 2, display: 'flex', alignItems: 'center', gap: 1.8, textDecoration: 'none', transition: 'all 0.2s ease', '&:hover': { transform: 'translateX(-3px)', boxShadow: `6px 6px 14px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` } }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(item.color, 0.12), color: item.color, flexShrink: 0 }}>
                    <item.icon size={20} variant="Bold" />
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, color: INK, flex: 1 }}>{item.title}</Typography>
                  <ArrowLeft2 size={16} color={INK_SOFT} />
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
