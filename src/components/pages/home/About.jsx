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
  {
    n: '۰۱',
    title: 'انتخاب چرم',
    desc: 'چرم‌های اصل و مقاوم، ورودی به ورودی بازرسی می‌شوند تا فقط بهترین‌ها به کارگاه برسند.',
  },
  {
    n: '۰۲',
    title: 'برش و طراحی',
    desc: 'الگوی هر زین بر اساس مدل دقیق موتور، برش و آماده دوخت می‌شود.',
  },
  {
    n: '۰۳',
    title: 'دوخت دستی',
    desc: 'دوخت‌کاران با تجربه، هر بخیه را با دست و با دقت انجام می‌دهند.',
  },
  {
    n: '۰۴',
    title: 'کنترل کیفیت',
    desc: 'هر زین پیش از بسته‌بندی، از نظر استحکام و ظاهر بررسی می‌شود.',
  },
  {
    n: '۰۵',
    title: 'ارسال',
    desc: 'زین آماده، با بسته‌بندی مطمئن به دست مشتری می‌رسد.',
  },
];

function StitchDivider() {
  const theme = useTheme();

  return <Box sx={{ width: '100%', height: 1, my: { xs: 4, md: 6 }, background: `repeating-linear-gradient(90deg,${alpha(theme.palette.secondary.main, 0.35)} 0px,${alpha(theme.palette.secondary.main, 0.35)} 8px,transparent 8px,transparent 18px)` }} />;
}

function NeoSurface({ children, sx = {}, inset = false, ...props }) {
  return (
    <Box {...props} sx={{ background: 'background.default', borderRadius: '28px', boxShadow: inset ? `inset 5px 5px 12px rgba(163, 177, 198, 0.32),inset -5px -5px 12px rgba(255, 255, 255, 0.95)` : `8px 8px 20px rgba(163, 177, 198, 0.42),-8px -8px 20px rgba(255, 255, 255, 0.95)`, ...sx }}>
      {children}
    </Box>
  );
}

export default function About() {
  const theme = useTheme();

  return (
    <>
      {/* Section Title */}
      <Box pt={{ xs: 5, md: 7 }} pb={{ xs: 3, md: 4 }}>
        <CardsTitle desc="هرآنچه که باید راجب شریف‌زین بدانید" en_title="ABOUT SHARIFZIN" fa_title="همه چیز درباره، شریف‌زین" />
      </Box>

      <Box component="section" sx={{ direction: 'rtl', borderRadius: { xs: '32px', md: '48px' }, p: { xs: 2, md: 4 }, background: 'background.default', boxShadow: `inset 4px 4px 12px rgba(163, 177, 198, 0.16),inset -4px -4px 12px rgba(255, 255, 255, 0.8)` }}>
        {/* =========================================
            HERO
        ========================================= */}
        <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center" sx={{ px: { xs: 1, md: 4 }, pt: { xs: 3, md: 5 } }}>
          {/* Text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="h6" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'secondary.main', fontWeight: 800 }}>
                درباره شریف‌زین
              </Typography>

              <Typography component="h1" sx={{ mt: 1.5, mb: 2, color: 'text.primary', fontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.4rem' }, fontWeight: 800, lineHeight: 1.65 }}>
                هر زین، یک روایت از چرم و دقت است
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, lineHeight: 2.15 }}>
                شریف‌زین با تکیه بر تجربه صنعتگرانی که هر بخیه را با دست می‌زنند، زین‌هایی طراحی می‌کند که هم به بدنه موتور وفادارند و هم به راحتی سرنشین. نام ما یادآور همان صنعت اصیل زین‌سازی است؛ چیزی که در هر محصول شریف‌زین جریان دارد.
              </Typography>
            </Box>
          </Grid>

          {/* Logo */}
          <Grid size={{ xs: 12, md: 6 }}>
            <NeoSurface inset sx={{ position: 'relative', height: { xs: 260, sm: 300, md: 380 }, borderRadius: { xs: '28px', md: '38px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
              {/* Inner Raised Logo */}
              <Box sx={{ position: 'relative', width: { xs: '70%', md: '65%' }, height: { xs: '65%', md: '68%' }, borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'background.default', boxShadow: `7px 7px 16px rgba(163, 177, 198, 0.34),-7px -7px 16px rgba(255, 255, 255, 0.9)` }}>
                <Image src="/assets/logo/sharifzin-logo.webp" alt="شریف‌زین" fill sizes="(max-width: 768px) 60vw, 35vw" style={{ objectFit: 'contain', padding: '28px' }} />
              </Box>

              {/* Tag */}
              <Box sx={{ position: 'absolute', top: { xs: -12, md: -16 }, left: { xs: 20, md: 35 }, px: 2, py: 1, borderRadius: '14px', background: 'background.default', boxShadow: `6px 6px 14px rgba(163, 177, 198, 0.4),-6px -6px 14px rgba(255, 255, 255, 0.95)`, transform: 'rotate(-4deg)' }}>
                <Typography variant="caption" fontWeight={800} color="secondary.main">
                  دست‌دوز و اصیل
                </Typography>
              </Box>
            </NeoSurface>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ px: { xs: 1, md: 4 } }}>
          <StitchDivider />
        </Box>

        {/* =========================================
            STATS
        ========================================= */}
        <Box sx={{ px: { xs: 1, md: 4 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {stats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    position: 'relative',
                    p: { xs: 2.5, md: 3.5 },
                    minHeight: { xs: 130, md: 150 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderRadius: '26px',
                    background: 'background.default',
                    boxShadow: `inset 4px 4px 10px rgba(163, 177, 198, 0.22),inset -4px -4px 10px rgba(255, 255, 255, 0.85)`,
                    transition: 'all .3s ease',
                    '&:hover': { boxShadow: `7px 7px 16px rgba(163, 177, 198, 0.38),-7px -7px 16px rgba(255, 255, 255, 0.95)`, transform: 'translateY(-3px)' },
                  }}
                >
                  {/* Small dot */}
                  <Box sx={{ position: 'absolute', top: 18, right: 20, width: 7, height: 7, borderRadius: '50%', background: 'primary.main', boxShadow: `2px 2px 5px rgba(163, 177, 198, .4),-2px -2px 5px rgba(255, 255, 255, .8)` }} />

                  <Typography sx={{ fontSize: { xs: '1.9rem', md: '2.2rem' }, fontWeight: 900, color: 'primary.main' }}>{stat.value}</Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.8 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Divider */}
        <Box sx={{ px: { xs: 1, md: 4 } }}>
          <StitchDivider />
        </Box>

        {/* =========================================
            PROCESS
        ========================================= */}
        <Box sx={{ px: { xs: 1, md: 4 }, pb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'primary.main', boxShadow: `2px 2px 5px rgba(163,177,198,.4),-2px -2px 5px rgba(255,255,255,.9)` }} />

            <Typography variant="h5" fontWeight={800} color="text.primary">
              مسیر ساخت یک زین شریف‌زین
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid key={step.n} size={{ xs: 12, sm: 6, md: 12 / 5 }}>
                <Box sx={{ position: 'relative', height: '100%', minHeight: 250, p: 3, borderRadius: '26px', background: 'background.default', boxShadow: `8px 8px 18px rgba(163, 177, 198, 0.38),-8px -8px 18px rgba(255, 255, 255, 0.92)`, transition: 'all .3s ease', '&:hover': { transform: 'translateY(-5px)', '& .step-number': { transform: 'scale(1.05)' } } }}>
                  {/* Number */}
                  <Box className="step-number" sx={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px', background: 'background.default', boxShadow: `inset 4px 4px 9px rgba(163, 177, 198, 0.28),inset -4px -4px 9px rgba(255, 255, 255, 0.9)`, transition: 'transform .3s ease' }}>
                    <Typography fontWeight={900} color="primary.main" fontSize={14}>
                      {step.n}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mt: 2.5, mb: 1 }}>
                    {step.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2 }}>
                    {step.desc}
                  </Typography>

                  {/* Step connector */}
                  {index < steps.length - 1 && <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 42, left: -20, width: 18, height: 2, background: alpha(theme.palette.secondary.main, 0.3) }} />}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* =========================================
            CTA
        ========================================= */}
        <Box sx={{ position: 'relative', px: { xs: 3, md: 8 }, py: { xs: 5, md: 7 }, borderRadius: { xs: '26px', md: '34px' }, textAlign: 'center', background: 'background.default', boxShadow: `inset 6px 6px 14px rgba(163, 177, 198, 0.3),inset -6px -6px 14px rgba(255, 255, 255, 0.9)`, overflow: 'hidden' }}>
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', top: -100, right: -50, background: alpha(theme.palette.primary.main, 0.06), pointerEvents: 'none' }} />

          <Box sx={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', bottom: -90, left: -30, background: alpha(theme.palette.secondary.main, 0.05), pointerEvents: 'none' }} />

          <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ position: 'relative', mb: 1 }}>
            زینی متناسب با موتور خود پیدا کنید
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ position: 'relative', lineHeight: 2 }}>
            مجموعه محصولات شریف‌زین را در فروشگاه ببینید
          </Typography>

          {/* CTA Button */}
          <Box
            component="a"
            href="/products"
            sx={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: '18px',
              background: theme.palette.primary.main,
              color: 'primary.contrastText',
              textDecoration: 'none',
              fontWeight: 800,
              boxShadow: `6px 6px 12px rgba(163, 177, 198, 0.45),-5px -5px 10px rgba(255, 255, 255, 0.8)`,
              transition: 'all .25s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: `8px 8px 15px rgba(163, 177, 198, 0.5),-7px -7px 13px rgba(255, 255, 255, 0.9)` },
              '&:active': { transform: 'translateY(1px)', boxShadow: `inset 4px 4px 8px rgba(0, 0, 0, 0.18),inset -3px -3px 7px rgba(255, 255, 255, 0.2)` },
            }}
          >
            مشاهده فروشگاه
          </Box>
        </Box>
      </Box>
    </>
  );
}
