'use client';

import { storeDetials } from '@/utils/data/links';
import { alpha, Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { ArrowRight2 } from 'iconsax-reactjs';
import Image from 'next/image';

export default function HeroSection() {
  const theme = useTheme();

  return (
    <Box component="section" sx={{ py: 4, pb: { xs: 4, lg: 8 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: { xs: 4, lg: 8 }, height: { xs: 380, sm: 420, md: 480, lg: 520 } }}>
          <Image src="/assets/banner/hero-section.webp" alt="شریف زین" fill priority style={{ objectFit: 'cover', filter: 'blur(8px)' }} />

          {/* Dark Gradient */}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.1) 70%, transparent 100%)' }} />

          {/* Orange Blur */}
          <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: theme.palette.primary.main, filter: 'blur(170px)', opacity: 0.25, left: -120, bottom: -200 }} />

          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', px: { xs: 2.5, sm: 4, md: 6, lg: 8 } }}>
            <Box maxWidth={{ xs: '100%', sm: 480, lg: 560 }}>
              <Chip label="تعویض تخصصی زین موتور" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 700, mb: { xs: 2, lg: 3 }, fontSize: { xs: 12, lg: 13 } }} />

              <Typography variant="h2" sx={{ color: theme.palette.primary.contrastText, fontWeight: 900, lineHeight: 1.2, mb: 2, fontSize: { xs: 28, sm: 36, md: 48, lg: 60 } }}>
                راحتی واقعی
                <br />
                از اینجا شروع میشه
              </Typography>

              <Typography sx={{ color: 'rgba(255,255,255,.8)', fontSize: { xs: 14, sm: 16, lg: 18 }, lineHeight: { xs: 1.8, lg: 2 }, mb: { xs: 3, lg: 4 } }}>تعویض، تعمیر و دوخت انواع زین موتور با بهترین متریال، کیفیت تضمینی و تحویل سریع.</Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button size="large" endIcon={<ArrowRight2 size={20} style={{ transform: 'rotate(180deg)', marginRight: '8px' }} />} sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, px: { xs: 3, lg: 4 }, py: { xs: 1.25, lg: 1.5 }, borderRadius: 4, width: { xs: '100%', sm: 'auto' }, '&:hover': { bgcolor: 'primary.dark' } }}>
                  ثبت سفارش
                </Button>

                <Button variant="outlined" size="large" sx={{ borderColor: theme.palette.primary.contrastText, color: theme.palette.primary.contrastText, px: { xs: 3, lg: 4 }, py: { xs: 1.25, lg: 1.5 }, borderRadius: 4, width: { xs: '100%', sm: 'auto' }, '&:hover': { borderColor: theme.palette.primary.contrastText, bgcolor: 'rgba(255,255,255,.08)' } }}>
                  مشاهده نمونه کارها
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stats bar: in-flow + 2-column grid on mobile, floating overlap + 4-column row from lg up */}
      <Box
        sx={{
          position: { xs: 'static', lg: 'absolute' },
          width: { xs: '100%', lg: '90%' },
          left: 0,
          right: 0,
          bottom: { lg: 15 },
          mx: { xs: 0, lg: 'auto' },
          mt: { xs: 3, lg: 0 },
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: { xs: 'auto', lg: 100 },
            py: { xs: 2, lg: 0 },
            borderRadius: { xs: '20px', lg: '32px' },
            background: theme.palette.background.paper,
            boxShadow: '0 0px 20px rgba(0,0,0,.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            px: 2,
          }}
        >
          {storeDetials.map((item, index) => {
            const isOdd = index % 2 !== 0;

            return (
              <Box key={index} display={'flex'} alignItems="center" justifyContent="center" sx={{ width: { xs: '50%', sm: '50%', md: '50%', lg: '25%' }, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: { xs: 48, lg: 64 }, height: { xs: 48, lg: 64 }, borderRadius: { xs: '14px', lg: '20px' }, bgcolor: isOdd ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.secondary.main, 0.2) }}>
                  <item.icon size={28} variant="Bulk" style={{ color: isOdd ? theme.palette.primary.main : theme.palette.secondary.main }} />
                </Box>
                <Box display={'flex'} flexDirection="column" justifyContent={'center'} alignItems="flex-start" sx={{ mr: { xs: 1.25, lg: 2 } }}>
                  <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: { xs: 13, lg: 16 } }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontSize: { xs: 11, lg: 14 }, display: { xs: 'none', sm: 'block' } }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
