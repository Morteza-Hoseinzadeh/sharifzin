'use client';

import React from 'react';
import { Box, Grid, Typography, Stack, Button } from '@mui/material';
import { TruckFast, ShieldTick, Setting2, Brush2, Layer, Refresh2, ArrowLeft2, TickCircle } from 'iconsax-reactjs';
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
  borderRadius: '18px',
  boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`,
};

const neoInset = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `inset 5px 5px 10px ${SHADOW_DARK}, inset -5px -5px 10px ${SHADOW_LIGHT}`,
};

// ==================== Data ====================
const services = [
  {
    icon: Setting2,
    title: 'زین‌سازی سفارشی',
    description: 'طراحی و ساخت زین کاملاً اختصاصی متناسب با آناتومی بدن و نوع موتورسیکلت شما.',
  },
  {
    icon: Brush2,
    title: 'تعمیر و بازسازی زین',
    description: 'تعمیر حرفه‌ای زین‌های آسیب‌دیده، تعویض رویه، دوخت مجدد و بازسازی کامل.',
  },
  {
    icon: Layer,
    title: 'تعویض فوم و اسفنج',
    description: 'استفاده از فوم سرد باکیفیت برای افزایش راحتی و دوام بیشتر زین.',
  },
  {
    icon: Refresh2,
    title: 'دوخت تخصصی',
    description: 'دوخت لوزی، خطی و طرح‌های سفارشی با نخ مقاوم و دوخت یکدست.',
  },
  {
    icon: ShieldTick,
    title: 'گارانتی اصالت',
    description: 'تمامی خدمات و محصولات ما دارای گارانتی اصالت و کیفیت هستند.',
  },
  {
    icon: TruckFast,
    title: 'تحویل سریع',
    description: 'تحویل اکسپرس در تهران و ارسال مطمئن به سراسر کشور.',
  },
];

const processSteps = [
  { step: '۰۱', title: 'مشاوره رایگان', desc: 'بررسی نیاز و نوع موتورسیکلت شما' },
  { step: '۰۲', title: 'انتخاب طرح و متریال', desc: 'انتخاب رنگ، فوم و نوع دوخت' },
  { step: '۰۳', title: 'ساخت و دوخت', desc: 'اجرای دقیق توسط استادکاران مجرب' },
  { step: '۰۴', title: 'تحویل و گارانتی', desc: 'تحویل نهایی همراه با گارانتی' },
];

const benefits = ['بیش از ۱۰ سال تجربه تخصصی', 'استفاده از بهترین متریال روز', 'طراحی ارگونومیک و راحت', 'گارانتی اصالت و کیفیت', 'پشتیبانی تخصصی پس از فروش', 'امکان سفارش کاملاً شخصی‌سازی شده'];

// ==================== Components ====================
function ServiceCard({ icon: Icon, title, description }) {
  return (
    <Box sx={{ ...neoSoft, p: 3, height: '100%', transition: 'all 0.25s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: `10px 10px 22px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` } }}>
      <Box sx={{ width: 52, height: 52, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: SURFACE, boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`, color: ACCENT_ORANGE, mb: 2.2 }}>
        <Icon size={26} variant="Bold" />
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 1.2 }}>{title}</Typography>
      <Typography sx={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.75 }}>{description}</Typography>
    </Box>
  );
}

function ProcessStep({ step, title, desc, isLast }) {
  return (
    <Stack alignItems="center" sx={{ position: 'relative', flex: 1 }}>
      <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...neoRaised, fontWeight: 800, fontSize: 18, color: ACCENT_ORANGE, mb: 2 }}>{step}</Box>
      <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: INK, mb: 0.6 }}>{title}</Typography>
      <Typography sx={{ fontSize: 12.5, color: INK_SOFT, textAlign: 'center', maxWidth: 140 }}>{desc}</Typography>
    </Stack>
  );
}

// ==================== Main Page ====================
export default function ServicesPage() {
  return (
    <ChildrenLayout>
      <Box width={'100%'} mt={4}>
        {/* ========== Hero ========== */}
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 }, mb: 5, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, color: INK, mb: 1.5, letterSpacing: '-0.5px' }}>خدمات تخصصی شریف‌زین</Typography>
          <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: INK_SOFT, maxWidth: 580, mx: 'auto', lineHeight: 1.8, mb: 3.5 }}>از زین‌سازی کاملاً سفارشی تا تعمیر و بازسازی حرفه‌ای، ما با دقت و تجربه، راحتی و زیبایی را به موتورسیکلت شما هدیه می‌دهیم.</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.8} justifyContent="center">
            <Button sx={{ px: 4, py: 1.6, borderRadius: '14px', fontWeight: 700, fontSize: 15, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `6px 6px 14px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`, '&:hover': { bgcolor: '#E06B10' } }}>درخواست مشاوره رایگان</Button>
            <Button sx={{ px: 4, py: 1.6, borderRadius: '14px', fontWeight: 700, fontSize: 15, color: INK, ...neoSoft, '&:hover': { boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}` } }}>مشاهده نمونه کارها</Button>
          </Stack>
        </Box>

        {/* ========== Services Grid ========== */}
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mb: 3, textAlign: 'center' }}>خدمات ما</Typography>

        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {services.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <ServiceCard {...item} />
            </Grid>
          ))}
        </Grid>

        {/* ========== Process ========== */}
        <Box sx={{ ...neoRaised, p: { xs: 3, md: 4.5 }, mb: 6 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mb: 4, textAlign: 'center' }}>فرآیند انجام کار</Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 4, md: 2 }} justifyContent="space-between" alignItems="center">
            {processSteps.map((item, index) => (
              <ProcessStep key={index} {...item} isLast={index === processSteps.length - 1} />
            ))}
          </Stack>
        </Box>

        {/* ========== Benefits ========== */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ ...neoRaised, p: 3.5, height: '100%' }}>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: INK, mb: 2 }}>چرا شریف‌زین؟</Typography>
              <Typography sx={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.8, mb: 3 }}>ما با تکیه بر تجربه صنعتی و عشق به موتورسیکلت، خدماتی ارائه می‌دهیم که هم دوام بالا داشته باشد و هم راحتی فوق‌العاده‌ای برای شما فراهم کند.</Typography>
              <Button endIcon={<ArrowLeft2 size={18} />} sx={{ color: ACCENT_ORANGE, fontWeight: 700, fontSize: 14, px: 0, '&:hover': { bgcolor: 'transparent', color: '#E06B10' } }}>
                تماس با ما
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ ...neoRaised, p: 3.5, height: '100%' }}>
              <Grid container spacing={1.8}>
                {benefits.map((text, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ ...neoInset, px: 1.8, py: 1.4 }}>
                      <TickCircle size={18} variant="Bold" color={ACCENT_ORANGE} />
                      <Typography sx={{ fontSize: 13.5, color: INK }}>{text}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* ========== CTA ========== */}
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 }, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 24 }, color: INK, mb: 1.5 }}>آماده‌اید زین موتور خود را متحول کنید؟</Typography>
          <Typography sx={{ fontSize: 14.5, color: INK_SOFT, mb: 3.5, maxWidth: 480, mx: 'auto' }}>همین حالا با ما در ارتباط باشید تا مشاوره رایگان دریافت کنید و سفارش خود را ثبت نمایید.</Typography>

          <Button sx={{ px: 5, py: 1.7, borderRadius: '14px', fontWeight: 700, fontSize: 15, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `6px 6px 16px ${SHADOW_DARK}, -4px -4px 12px ${SHADOW_LIGHT}`, '&:hover': { bgcolor: '#E06B10' } }}>ثبت درخواست خدمات</Button>
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
