import { links } from '@/utils/data/links';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import { alpha, Box, Button, IconButton, InputBase, Typography, useTheme } from '@mui/material';
import { ArrowCircleUp2, ArrowUp, Instagram, Message, Whatsapp } from 'iconsax-reactjs';
import Image from 'next/image';
import React from 'react';

export default function Footer() {
  const theme = useTheme();

  const handleScrollToTop = () => {
    return window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <Box width={'100%'} display={'flex'} alignItems={'center'} flexDirection={'column'} justifyContent={'center'} gap={2}>
      <Box width="100%" display="flex" justifyContent={{ xs: 'center', lg: 'center' }} mt={4}>
        <Button
          onClick={handleScrollToTop}
          endIcon={<ArrowCircleUp2 variant="Bulk" size={22} style={{ marginRight: 10 }} />}
          sx={(theme) => ({
            px: 3,
            py: 1.4,
            borderRadius: '18px',
            color: theme.palette.primary.contrastText,
            background: `linear-gradient( 135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 45%, ${theme.palette.primary.light} 100% )`,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 10px 35px ${theme.palette.primary.main}55`,
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: theme.transitions.create(['transform', 'box-shadow', 'background'], { duration: theme.transitions.duration.standard }),
            '& svg': { transition: theme.transitions.create('transform') },
            '&:hover': { transform: 'translateY(-4px)', background: `linear-gradient(135deg,${theme.palette.primary.main},${theme.palette.primary.light})`, boxShadow: `0 18px 45px ${theme.palette.primary.main}80`, '& svg': { transform: 'translateY(-3px)' } },
            '&:active': { transform: 'scale(.98)' },
          })}
        >
          بازگشت به بالا
        </Button>
      </Box>
      <Box sx={styles(theme).wrapper} display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'}>
        {/* Logo & Brand */}
        <Box mt={{ xs: 3, sm: 2, lg: 0 }} sx={styles(theme).logoSection}>
          <Box display={'flex'} alignItems={'center'} gap={1.5}>
            <Box sx={styles(theme).logoWrapper}>
              <Image src="/assets/logo/sharifzin.webp" alt="sharifzin" fill priority style={{ objectFit: 'contain' }} />
            </Box>

            <Box sx={styles(theme).brandText}>
              <Typography component="h1" variant="h6" sx={styles(theme).brandName}>
                شریف زین
              </Typography>
              <Typography variant="caption" sx={styles(theme).brandSlogan}>
                فروشگاه تخصصی محصولات دیجیتال و گجت‌های هوشمند
              </Typography>
            </Box>
          </Box>

          <Box maxWidth={500} textAlign={'right'}>
            <Typography variant="body2" sx={{ ...styles(theme).brandSlogan, color: '#eee', fontSize: '.95rem', lineHeight: 1.5 }}>
              شریف زین با هدف ارائه تجربه‌ای سریع، مطمئن و حرفه‌ای در خرید محصولات دیجیتال راه‌اندازی شده است. ما مجموعه‌ای از گوشی موبایل، لپ‌تاپ، تبلت، ساعت هوشمند، هدفون و لوازم جانبی اورجینال را با ضمانت اصالت کالا، قیمت رقابتی و ارسال سریع ارائه می‌کنیم.{' '}
            </Typography>
          </Box>

          <Box width={'100%'} display={'flex'} alignItems={'center'} gap={4} mt={2}>
            <IconButton href="https://www.instagram.com/sharifzin/" sx={{ width: 52, height: 52, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(16px)', transition: '.35s', '&:hover': { background: 'primary.main', transform: 'translateY(-6px) scale(1.08)', boxShadow: '0 10px 25px rgba(0,0,0,.35)', rotate: '8deg' } }}>
              <img src="/assets/icon/instagram.svg" alt="آدرس اینستاگرام شریف زین" width={26} height={26} />
            </IconButton>
            <IconButton href="https://wa.me/989101941207" sx={{ width: 52, height: 52, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(16px)', transition: '.35s', '&:hover': { background: 'primary.main', transform: 'translateY(-6px) scale(1.08)', boxShadow: '0 10px 25px rgba(0,0,0,.35)', rotate: '8deg' } }}>
              <img src="/assets/icon/whatsapp.svg" alt="آدرس واتساپ شریف زین" width={26} height={26} />
            </IconButton>
            <IconButton href="https://t.me/sharifzin" sx={{ width: 52, height: 52, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(16px)', transition: '.35s', '&:hover': { background: 'primary.main', transform: 'translateY(-6px) scale(1.08)', boxShadow: '0 10px 25px rgba(0,0,0,.35)', rotate: '8deg' } }}>
              <img src="/assets/icon/telegram.svg" alt="آدرس تلگرام شریف زین" width={26} height={26} />
            </IconButton>
            <IconButton href="https://bale.ai/sharifzin" sx={{ width: 52, height: 52, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(16px)', transition: '.35s', '&:hover': { background: 'primary.main', transform: 'translateY(-6px) scale(1.08)', boxShadow: '0 10px 25px rgba(0,0,0,.35)', rotate: '8deg' } }}>
              <img src="/assets/icon/bale.png" alt="آدرس بله شریف زین" width={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Links Container */}
        <Box mt={{ xs: 3, sm: 2, lg: 0 }} display={'flex'} alignItems={'flex-start'} flexDirection={'column'} gap={2}>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main }} />
            <Typography variant="h6" color={theme.palette.primary.contrastText} fontWeight={900}>
              دسترسی سریع
            </Typography>
          </Box>

          <Box component={'ul'} display={'flex'} flexDirection={'column'} gap={1}>
            {links?.map((link, index) => {
              const url = link?.href !== null;
              return (
                <Box key={index} component={'li'} sx={{ cursor: 'pointer', listStyleType: 'none' }}>
                  <Box component="a" href={link?.href} sx={{ color: url ? '#fff' : '#ffffff50', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1, transition: '.25s', '&:before': { content: '"›"', opacity: 0.4 }, '&:hover': { color: 'primary.main', transform: 'translateX(-8px)' } }}>
                    {link.title}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Infoes */}
        <Box mt={{ xs: 3, sm: 2, lg: 0 }} display={'flex'} alignItems={'flex-start'} flexDirection={'column'} gap={2}>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main }} />
            <Typography variant="h6" color={theme.palette.primary.contrastText} fontWeight={900}>
              ارتباط با ما
            </Typography>
          </Box>

          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="body2" color="#fff">
              سوالات متداول:
            </Typography>
            <Typography variant="body2" color="#fff">
              {ConvertToPersianDigit('09101941207')}
            </Typography>
          </Box>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="body2" color="#fff">
              آدرس ایمیل:
            </Typography>
            <Typography variant="body2" color="#fff">
              lobosop.ir@info.com
            </Typography>
          </Box>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="body2" color="#fff">
              آدرس:
            </Typography>
            <Typography variant="body2" color="#fff">
              (شعبه تهران به زودی)
            </Typography>
          </Box>
          <Box width={'100%'} display={'flex'} flexDirection={'column'}>
            <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={2}>
              <Typography variant="body2" color="#fff" fontWeight={900}>
                خبرنامه
              </Typography>
              <Typography variant="body2" color="#fff">
                جهت عضویت در خبرنامه از کادر زیر اقدام کنید
              </Typography>
            </Box>
            <Box sx={styles(theme).searchArea} mt={3}>
              <Box width={'100%'} position={'relative'}>
                <InputBase
                  placeholder="شماره تلفن خود را وارد کنید"
                  inputProps={{ 'aria-label': 'شماره تلفن خود را وارد کنید' }}
                  startAdornment={
                    <Box sx={styles(theme).inputIcon}>
                      <Message size={22} color={theme.palette.primary.main} variant="Bulk" />
                    </Box>
                  }
                  sx={styles(theme).searchInput}
                />
                <Box position={'absolute'} top={1} left={-1}>
                  <Button variant="contained" size="medium" sx={{ boxShadow: 'none', height: '100%', borderRadius: '12px 0 0 12px', '& hover': { backgroundColor: 'primary.dark' } }}>
                    ثبت
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Certificates */}
        {/* <Box mt={{ xs: 3, sm: 2, xl: 0 }} width={{ xs: '100%', lg: 'fit-content' }} display={'flex'} alignItems={'center'} flexDirection={{ xs: 'row', md: 'column' }} flexWrap={'wrap'} gap={2}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', borderRadius: '16px', padding: 1.5, '& img': { borderRadius: '12px' } }}>
            <img src="/assets/certificates/zarinpal.png" alt="درگاه امن پرداخت زرین پال شریف زین" width={65} height={65} />
          </Box>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', borderRadius: '16px', padding: 1.5, '& img': { borderRadius: '12px' } }}>
            <img src="/assets/certificates/zarinpal.png" alt="درگاه امن پرداخت زرین پال شریف زین" width={65} height={65} />
          </Box>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', borderRadius: '16px', padding: 1.5, '& img': { borderRadius: '12px' } }}>
            <img src="/assets/certificates/zarinpal.png" alt="درگاه امن پرداخت زرین پال شریف زین" width={65} height={65} />
          </Box>
        </Box> */}
      </Box>

      <Box sx={{ ...styles(theme).wrapper, padding: '24px' }} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant="caption" color="#fff" component={'span'}>
          تمامی مطالب و حقوق متعلق به فروشگاه شریف زین میباشد
        </Typography>
        <a href="https://vortexwebteam.ir" style={{ textDecoration: 'none' }}>
          <Typography variant="caption" color="#fff" component={'span'}>
            🔷 توسعه یافته شده توسط تیم طراحی سایت ورتکس 🔷
          </Typography>
        </a>
      </Box>
    </Box>
  );
}

const styles = (theme) => ({
  wrapper: {
    width: '100%',
    padding: { xs: '28px', md: '32px' },
    borderRadius: '48px',

    background: `
    radial-gradient(circle at top right, rgba(0,122,255,.12), transparent 35%),
    radial-gradient(circle at bottom left, rgba(59,130,246,.08), transparent 45%),
    linear-gradient(
      180deg,
      #1A1F2E 0%,
      #131722 50%,
      #0B0F17 100%
    )
  `,
    border: '1px solid rgba(255,255,255,.08)',
    boxShadow: `
    0 25px 80px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.05),
    0 0 80px rgba(0,122,255,.08)
  `,
    backdropFilter: 'blur(30px)',
    overflow: 'hidden',
    position: 'relative',
  },

  logoSection: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: 1,
  },

  // Mobile grid template (two rows)
  mobileGrid: {
    gridTemplateColumns: '1fr auto',
    gridTemplateAreas: '"logo actions" ' + '"search search"',
    alignItems: 'center',
  },

  logoArea: {
    gridArea: 'logo',
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 1.5, sm: 2 },
  },

  logoWrapper: {
    position: 'relative',
    width: {
      xs: 70,
      md: 82,
    },
    height: {
      xs: 70,
      md: 82,
    },
    borderRadius: '20px',
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '.35s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 35px rgba(0,0,0,.4)',
    },
  },

  brandText: {
    display: 'block',
  },

  brandName: {
    fontWeight: 800,
    color: 'primary.contrastText',
    letterSpacing: '0.5px',
    lineHeight: 1.1,
  },

  brandSlogan: {
    fontSize: '0.78rem',
    color: '#fff',
    mt: 0.25,
  },
  searchArea: {
    gridArea: 'search',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },

  searchInput: {
    width: '100%',
    pl: 6,
    pr: 6,
    py: 0.5,
    fontSize: { xs: '0.75rem', sm: '0.85rem' },
    color: 'text.primary',
    borderRadius: '16px',
    background: 'rgba(255,255,255,.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,.08)',
    transition: '.35s',
    color: 'text.disabled',

    '&:hover': {
      borderColor: 'primary.main',
      '&.Mui-focused': {
        borderColor: 'primary.main',
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.18)}`,
      },
      '& input::placeholder': {
        color: 'primary.main',
        opacity: 0.85,
      },
    },
  },

  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '55%',
    transform: 'translateY(-50%)',
    color: 'text.disabled',
    pointerEvents: 'none',
  },
});
