'use client';

import React from 'react';
import { alpha, Box, Grid, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';

const stats = [
  { value: '+۱۵', label: 'سال تجربه در صنعت زین‌سازی' },
  { value: '+۲۰,۰۰۰', label: 'زین تولید و تحویل‌شده' },
  { value: '۱۰۰٪', label: 'دوخت دستی و کنترل کیفیت' },
];

const steps = [
  { n: '۰۱', title: 'انتخاب چرم', desc: 'چرم‌های اصل و مقاوم، ورودی به ورودی بازرسی می‌شوند تا فقط بهترین‌ها به کارگاه برسند.' },
  { n: '۰۲', title: 'برش و طراحی', desc: 'الگوی هر زین بر اساس مدل دقیق موتور، برش و آماده دوخت می‌شود.' },
  { n: '۰۳', title: 'دوخت دستی', desc: 'دوخت‌کاران با تجربه، هر بخیه را با دست و با دقت انجام می‌دهند.' },
  { n: '۰۴', title: 'کنترل کیفیت', desc: 'هر زین پیش از بسته‌بندی، از نظر استحکام و ظاهر بررسی می‌شود.' },
  { n: '۰۵', title: 'ارسال', desc: 'زین آماده، با بسته‌بندی مطمئن به دست مشتری می‌رسد.' },
];

function StitchDivider() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        height: 2,
        my: { xs: 4, md: 6 },
        backgroundImage: `repeating-linear-gradient(90deg, ${theme.palette.secondary.light} 0 10px, transparent 10px 22px)`,
        opacity: 0.6,
      }}
    />
  );
}

export default function About() {
  const theme = useTheme();

  return (
    <>
      <Box pt={6} pb={3}>
        <CardsTitle desc={'هرآنچه که باید راجب شریف‌زین بدانید'} en_title={'ABOUT SHARIFZIN'} fa_title={'همه چیز درباره، شریف‌زین'} />
      </Box>

      <Box sx={{ backgroundColor: 'background.default', direction: 'rtl', borderRadius: '48px' }}>
        {/* Hero */}
        <Grid container spacing={4} sx={{ px: { xs: 3, md: 8 }, pt: { xs: 6, md: 10 }, pb: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color="secondary.main" fontWeight={700} letterSpacing={2}>
              درباره شریف‌زین
            </Typography>
            <Typography variant="h4" component="h1" fontWeight={800} sx={{ mt: 1, mb: 2, color: 'text.primary' }}>
              هر زین، یک روایت از چرم و دقت است
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, lineHeight: 2 }}>
              شریف‌زین با تکیه بر تجربه صنعتگرانی که هر بخیه را با دست می‌زنند، زین‌هایی طراحی می‌کند که هم به بدنه موتور وفادارند و هم به راحتی سرنشین. نام ما یادآور همان صنعت اصیل زین‌سازی است؛ چیزی که در هر محصول شریف‌زین جریان دارد.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative', width: '100%', height: { xs: 250, md: 350 }, borderRadius: '24px', backgroundColor: 'background.paper', border: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 30px ${alpha(theme.palette.text.primary, 0.1)}` }}>
              <Image src="/assets/logo/sharifzin-logo.webp" alt="شریف‌زین" fill style={{ objectFit: 'contain', padding: '32px' }} />

              {/* Stitched corner tag — echoes the footer's hang tag */}
              <Box sx={{ position: 'absolute', top: -14, left: 24, px: 2, py: 0.6, borderRadius: '8px', backgroundColor: 'primary.main', transform: 'rotate(-4deg)', boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}` }}>
                <Typography variant="caption" fontWeight={800} sx={{ color: 'primary.contrastText' }}>
                  دست‌دوز و اصیل
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ px: { xs: 3, md: 8 } }}>
          <StitchDivider />
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ px: { xs: 3, md: 8 } }}>
          {stats.map((s) => (
            <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
              <Box sx={{ backgroundColor: 'background.paper', borderRadius: '20px', p: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {s.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ px: { xs: 3, md: 8 } }}>
          <StitchDivider />
        </Box>

        {/* Process */}
        <Box sx={{ px: { xs: 3, md: 8 }, pb: { xs: 6, md: 10 } }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 4, color: 'text.primary' }}>
            مسیر ساخت یک زین شریف‌زین
          </Typography>
          <Grid container spacing={3}>
            {steps.map((step) => (
              <Grid key={step.n} size={{ xs: 12, sm: 6, md: 12 / 5 }}>
                <Box
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: '18px',
                    p: 3,
                    height: '100%',
                    borderTop: `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" fontWeight={800} color="primary.main">
                      {step.n}
                    </Typography>
                    <Typography component="span" sx={{ color: 'secondary.light', fontWeight: 800, fontSize: '1rem' }}>
                      ×
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1, mb: 0.5, color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Closing CTA */}
        <Box sx={{ backgroundColor: 'primary.main', px: { xs: 3, md: 8 }, py: { xs: 6, md: 8 }, textAlign: 'center', borderRadius: '32px' }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: 'primary.contrastText', mb: 1 }}>
            زینی متناسب با موتور خود پیدا کنید
          </Typography>
          <Typography variant="body2" sx={{ color: alpha(theme.palette.primary.contrastText, 0.75) }}>
            مجموعه محصولات شریف‌زین را در فروشگاه ببینید
          </Typography>
        </Box>
      </Box>
    </>
  );
}
