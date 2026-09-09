'use client';

import { storeDetials } from '@/utils/data/links';
import { alpha, Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { ArrowRight2 } from 'iconsax-reactjs';
import Image from 'next/image';

export default function HeroSection() {
  const theme = useTheme();

  const neoRaised = `8px 8px 20px rgba(0, 0, 0, 0.22),-6px -6px 16px rgba(255, 255, 255, 0.08)`;
  const neoInset = `inset 4px 4px 10px rgba(0, 0, 0, 0.2),inset -4px -4px 10px rgba(255, 255, 255, 0.08)`;

  return (
    <Box component="section" sx={{ position: 'relative', py: { xs: 3, lg: 5 }, pb: { xs: 3, lg: 9 }, overflow: 'hidden' }}>
      {/* =====================================================
          HERO
      ====================================================== */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: 500, sm: 540, md: 580, lg: 620 }, overflow: 'hidden', borderRadius: { xs: '28px', sm: '36px', lg: '48px' }, background: '#151515', boxShadow: neoRaised }}>
        {/* Background image */}
        <Image src="/assets/banner/hero-section.webp" alt="شریف زین" fill priority sizes="100vw" style={{ objectFit: 'cover', filter: 'blur(5px)', transform: 'scale(1.04)' }} />

        {/* Main dark overlay */}
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,rgba(0,0,0,.78) 0%,rgba(0,0,0,.55) 38%,rgba(0,0,0,.18) 75%,rgba(0,0,0,.08) 100%)` }} />

        {/* Bottom darkening */}
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(0deg,rgba(0,0,0,.68) 0%,transparent 45%)` }} />

        {/* Orange ambient light */}
        <Box sx={{ position: 'absolute', width: { xs: 280, md: 450, lg: 550 }, height: { xs: 280, md: 450, lg: 550 }, borderRadius: '50%', left: { xs: -150, md: -120 }, bottom: { xs: -150, md: -220 }, background: theme.palette.primary.main, filter: 'blur(150px)', opacity: 0.25, pointerEvents: 'none' }} />

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', px: { xs: 2.5, sm: 4, md: 6, lg: 9 }, pb: { xs: 5, lg: 7 } }}>
          <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 500, lg: 600 }, direction: 'rtl' }}>
            {/* Label */}
            <Box sx={{ display: 'inline-flex', p: '5px', mb: { xs: 2, md: 2.5 }, borderRadius: '15px', background: 'rgba(255,255,255,.08)', boxShadow: neoInset, backdropFilter: 'blur(12px)' }}>
              <Chip label="تعویض تخصصی زین موتور" sx={{ height: { xs: 32, md: 36 }, px: 0.5, borderRadius: '11px', background: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 800, fontSize: { xs: 11, md: 12 }, boxShadow: `4px 4px 10px rgba(0,0,0,.25)` }} />
            </Box>

            {/* Heading */}
            <Typography component="h1" sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: 32, sm: 40, md: 52, lg: 64 }, lineHeight: { xs: 1.35, lg: 1.25 }, letterSpacing: '-1px', mb: 2 }}>
              راحتی واقعی
              <br />
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                از اینجا شروع میشه
              </Box>
            </Typography>

            {/* Description */}
            <Typography sx={{ color: 'rgba(255,255,255,.78)', fontSize: { xs: 14, sm: 15, lg: 17 }, lineHeight: 2, maxWidth: 540, mb: { xs: 3, lg: 4 } }}>تعویض، تعمیر و دوخت انواع زین موتور با بهترین متریال، کیفیت تضمینی و تحویل سریع.</Typography>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
              {/* Primary */}
              <Button
                size="large"
                endIcon={<ArrowRight2 size={19} style={{ transform: 'rotate(180deg)', marginRight: 7 }} />}
                sx={{
                  minHeight: 52,
                  px: { xs: 3, lg: 4 },
                  borderRadius: '17px',
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 800,
                  boxShadow: `7px 7px 14px rgba(0,0,0,.28),-4px -4px 10px rgba(255,255,255,.08)`,
                  width: { xs: '100%', sm: 'auto' },
                  transition: 'all .25s ease',
                  '&:hover': {
                    background: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: `9px 9px 18px rgba(0,0,0,.32),-5px -5px 12px rgba(255,255,255,.08)`,
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: `inset 4px 4px 8px rgba(0,0,0,.25),inset -3px -3px 7px rgba(255,255,255,.08)`,
                  },
                }}
              >
                ثبت سفارش
              </Button>

              {/* Secondary */}
              <Button
                size="large"
                sx={{
                  minHeight: 52,
                  px: { xs: 3, lg: 4 },
                  borderRadius: '17px',
                  background: 'rgba(255,255,255,.08)',
                  color: '#fff',
                  fontWeight: 700,
                  border: '1px solid rgba(255,255,255,.14)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: `inset 2px 2px 5px rgba(255,255,255,.05),5px 5px 12px rgba(0,0,0,.2)`,
                  width: { xs: '100%', sm: 'auto' },
                  transition: 'all .25s ease',
                  '&:hover': { background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', transform: 'translateY(-2px)' },
                  '&:active': { boxShadow: neoInset, transform: 'translateY(1px)' },
                }}
              >
                مشاهده نمونه کارها
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =====================================================
          STATS
      ====================================================== */}
      <Box sx={{ position: { xs: 'relative', lg: 'absolute' }, left: { lg: '50%' }, bottom: { lg: 15 }, transform: { lg: 'translateX(-50%)' }, width: { xs: '100%', lg: '88%' }, mt: { xs: 2.5, lg: 0 }, zIndex: 5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: { xs: 1.5, md: 2 }, p: { xs: 1.5, md: 2 }, borderRadius: { xs: '24px', md: '30px' }, background: theme.palette.background.default, boxShadow: `10px 10px 24px rgba(163,177,198,.48),-10px -10px 24px rgba(255,255,255,.9)` }}>
          {storeDetials.map((item, index) => {
            const isOdd = index % 2 !== 0;

            return (
              <Box key={index} sx={{ position: 'relative', minHeight: { xs: 82, md: 86 }, display: 'flex', alignItems: 'center', px: { xs: 1, md: 1.5 }, borderRadius: '21px', background: theme.palette.background.default, boxShadow: `inset 3px 3px 7px rgba(163,177,198,.18),inset -3px -3px 7px rgba(255,255,255,.8)` }}>
                {/* Icon */}
                <Box sx={{ flexShrink: 0, width: { xs: 42, md: 52 }, height: { xs: 42, md: 52 }, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: { xs: '14px', md: '17px' }, background: isOdd ? alpha(theme.palette.primary.main, 0.09) : alpha(theme.palette.secondary.main, 0.09), boxShadow: `4px 4px 9px rgba(163,177,198,.28),-4px -4px 9px rgba(255,255,255,.85)` }}>
                  <item.icon size={24} variant="Bulk" style={{ color: isOdd ? theme.palette.primary.main : theme.palette.secondary.main }} />
                </Box>

                {/* Text */}
                <Box sx={{ mr: { xs: 1, md: 1.5 }, minWidth: 0 }}>
                  <Typography sx={{ color: theme.palette.text.primary, fontWeight: 800, fontSize: { xs: 11, sm: 12, md: 14 }, lineHeight: 1.6 }}>{item.title}</Typography>
                  <Typography sx={{ color: theme.palette.text.disabled, fontSize: { xs: 10, md: 12 }, mt: 0.3, lineHeight: 1.7, display: { xs: 'none', sm: 'block' } }}>{item.description}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
