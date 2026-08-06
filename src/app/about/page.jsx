'use client';

import React from 'react';
import { Box, Grid, Typography, Stack, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ShieldTick, Cup, People, Heart, Location, Call, Sms } from 'iconsax-reactjs';
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
const values = [
  {
    icon: ShieldTick,
    title: 'کیفیت و اصالت',
    description: 'ما فقط از بهترین متریال استفاده می‌کنیم و تمام محصولات و خدمات ما دارای گارانتی اصالت هستند.',
  },
  {
    icon: Heart,
    title: 'عشق به موتورسیکلت',
    description: 'هر زینی که می‌سازیم با علاقه و دقت ساخته می‌شود، چون خودمان عاشق موتورسواری هستیم.',
  },
  {
    icon: People,
    title: 'مشتری‌مداری',
    description: 'رضایت شما اولویت اول ماست. از مشاوره تا تحویل نهایی، کنار شما هستیم.',
  },
  {
    icon: Cup,
    title: 'تجربه و تخصص',
    description: 'بیش از یک دهه تجربه در زین‌سازی و تعمیرات تخصصی موتورسیکلت.',
  },
];

const stats = [
  { number: '۱۰+', label: 'سال تجربه' },
  { number: '۵۰۰۰+', label: 'زین ساخته شده' },
  { number: '۹۸٪', label: 'رضایت مشتریان' },
  { number: '۱۲', label: 'ماه گارانتی' },
];

const timeline = [
  {
    year: '۱۳۹۲',
    title: 'شروع فعالیت',
    description: 'شریف‌زین با هدف ارائه زین‌های باکیفیت و دست‌دوز فعالیت خود را آغاز کرد.',
  },
  {
    year: '۱۳۹۶',
    title: 'توسعه کارگاه',
    description: 'افزایش ظرفیت تولید و استخدام استادکاران مجرب برای پاسخگویی به سفارشات بیشتر.',
  },
  {
    year: '۱۴۰۰',
    title: 'ورود به بازار آنلاین',
    description: 'راه‌اندازی فروشگاه اینترنتی و امکان سفارش آنلاین از سراسر کشور.',
  },
  {
    year: '۱۴۰۴',
    title: 'امروز',
    description: 'تبدیل شدن به یکی از معتبرترین برندهای زین‌سازی تخصصی در ایران.',
  },
];

// ==================== Components ====================
function ValueCard({ icon: Icon, title, description }) {
  return (
    <Box
      sx={{
        ...neoSoft,
        p: 3,
        height: '100%',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `10px 10px 22px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
        },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: SURFACE,
          boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
          color: ACCENT_ORANGE,
          mb: 2.2,
        }}
      >
        <Icon size={26} variant="Bold" />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 16, color: INK, mb: 1.2 }}>{title}</Typography>
      <Typography sx={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.75 }}>{description}</Typography>
    </Box>
  );
}

// ==================== Main Page ====================
export default function AboutUsPage() {
  return (
    <ChildrenLayout>
      <Box width="100%" sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        {/* ========== Hero ========== */}
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 }, mb: 5, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, color: INK, mb: 1.5, letterSpacing: '-0.5px' }}>درباره شریف‌زین</Typography>
          <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: INK_SOFT, maxWidth: 620, mx: 'auto', lineHeight: 1.85 }}>شریف‌زین با تکیه بر تجربه صنعتگرانی که هر بخیه را با دست می‌زنند، زین‌هایی طراحی می‌کند که هم به بدنه موتور وفادارند و هم به راحتی سرنشین. تضمین اصالت چرم، دوخت دستی و ارسال سریع، همراه هر سفارش شریف‌زین است.</Typography>
        </Box>

        {/* ========== Stats ========== */}
        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {stats.map((item, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Box sx={{ ...neoRaised, py: 3.5, px: 2, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 28, md: 34 }, color: ACCENT_ORANGE, mb: 0.5 }}>{item.number}</Typography>
                <Typography sx={{ fontSize: 13.5, color: INK_SOFT, fontWeight: 600 }}>{item.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* ========== Our Story ========== */}
        <Grid container spacing={3} sx={{ mb: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ ...neoRaised, p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mb: 2 }}>داستان ما</Typography>
              <Typography sx={{ fontSize: 14.5, color: INK_SOFT, lineHeight: 1.9, mb: 2 }}>شریف‌زین از یک کارگاه کوچک با چند ابزار ساده شروع شد. هدف ما از ابتدا ساده بود: ساختن زینی که هم زیبا باشد، هم بادوام، و مهم‌تر از همه، راحت.</Typography>
              <Typography sx={{ fontSize: 14.5, color: INK_SOFT, lineHeight: 1.9, mb: 2 }}>با گذشت سال‌ها، تجربه ما بیشتر شد، تیم‌مان بزرگ‌تر شد و امروز به یکی از تخصصی‌ترین مجموعه‌های زین‌سازی در کشور تبدیل شده‌ایم.</Typography>
              <Typography sx={{ fontSize: 14.5, color: INK_SOFT, lineHeight: 1.9 }}>ما هنوز هم هر زین را با همان دقت و عشق روزهای اول می‌سازیم.</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ ...neoInset, height: { xs: 260, md: 340 }, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {/* تصویر کارگاه یا لوگو */}
              <Typography sx={{ color: INK_SOFT, fontSize: 15 }}>تصویر کارگاه / تیم شریف‌زین</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* ========== Values ========== */}
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mb: 3, textAlign: 'center' }}>ارزش‌های ما</Typography>

        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {values.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <ValueCard {...item} />
            </Grid>
          ))}
        </Grid>

        {/* ========== Timeline ========== */}
        <Box sx={{ ...neoRaised, p: { xs: 3, md: 4.5 }, mb: 6 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK, mb: 4, textAlign: 'center' }}>مسیر پیشرفت ما</Typography>

          <Stack gap={2}>
            {timeline.map((item, index) => (
              <Stack key={index} direction="row" gap={2.5} sx={{ position: 'relative', pb: index === timeline.length - 1 ? 0 : 3.5 }}>
                {/* Line */}
                {index !== timeline.length - 1 && <Box sx={{ position: 'absolute', right: 19, top: 40, bottom: 0, width: 2, bgcolor: alpha(ACCENT_ORANGE, 0.2) }} />}

                {/* Dot */}
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...neoSoft, color: ACCENT_ORANGE, fontWeight: 800, fontSize: 12, zIndex: 1 }}>{item.year.slice(2)}</Box>

                <Box sx={{ pt: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 0.5 }}>
                    {item.title}
                    <Typography component="span" sx={{ fontSize: 13, color: ACCENT_ORANGE, fontWeight: 600, mr: 1.5 }}>
                      {item.year}
                    </Typography>
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.7 }}>{item.description}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* ========== Contact Info ========== */}
        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ ...neoSoft, p: 3, textAlign: 'center', height: '100%' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, background: SURFACE, boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`, color: ACCENT_ORANGE }}>
                <Location size={24} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 1 }}>آدرس</Typography>
              <Typography sx={{ fontSize: 13, color: INK_SOFT, lineHeight: 1.7 }}>ایران، تهران، میدان رازی (گمرک)، خیابان مولوی، رو به روی پاساژ بهمن، کوچه خسجته، پلاک ۶، طبقه بالا</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ ...neoSoft, p: 3, textAlign: 'center', height: '100%' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, background: SURFACE, boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`, color: ACCENT_ORANGE }}>
                <Call size={24} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 1 }}>پشتیبانی</Typography>
              <Typography sx={{ fontSize: 15, color: INK, fontWeight: 600, direction: 'ltr' }}>۰۹۱۰۱۹۴۱۲۰۷</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ ...neoSoft, p: 3, textAlign: 'center', height: '100%' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, background: SURFACE, boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`, color: ACCENT_ORANGE }}>
                <Sms size={24} variant="Bold" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK, mb: 1 }}>ایمیل</Typography>
              <Typography sx={{ fontSize: 14, color: INK, fontWeight: 600 }}>info@sharifzin.ir</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* ========== CTA ========== */}
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 }, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 24 }, color: INK, mb: 1.5 }}>دوست دارید با ما کار کنید؟</Typography>
          <Typography sx={{ fontSize: 14.5, color: INK_SOFT, mb: 3.5, maxWidth: 480, mx: 'auto' }}>برای مشاوره رایگان، ثبت سفارش یا هر سوالی که دارید، با ما در ارتباط باشید.</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.8} justifyContent="center">
            <Button sx={{ px: 4.5, py: 1.7, borderRadius: '14px', fontWeight: 700, fontSize: 15, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `6px 6px 16px ${SHADOW_DARK}, -4px -4px 12px ${SHADOW_LIGHT}`, '&:hover': { bgcolor: '#E06B10' } }}>تماس با ما</Button>
            <Button sx={{ px: 4.5, py: 1.7, borderRadius: '14px', fontWeight: 700, fontSize: 15, color: INK, ...neoSoft, '&:hover': { boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}` } }}>مشاهده خدمات</Button>
          </Stack>
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
