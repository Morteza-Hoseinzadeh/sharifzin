'use client';

import { links } from '@/utils/data/links';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import { alpha, Box, IconButton, InputBase, Typography, useTheme } from '@mui/material';
import { ArrowUp2, Call, Sms } from 'iconsax-reactjs';
import Image from 'next/image';
import React, { useState } from 'react';

export default function Footer() {
  const theme = useTheme();
  const [phone, setPhone] = useState('');

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = () => {
    if (!phone) return;
    // TODO: wire up to actual newsletter API
    console.log('subscribe:', phone);
  };

  const s = styles(theme);

  return (
    <Box component="footer" sx={s.outer}>
      <Box sx={s.wrapper}>
        {/* Rivet — scroll to top, sits astride the top seam */}
        <IconButton onClick={handleScrollToTop} aria-label="بازگشت به بالا" sx={s.rivet}>
          <ArrowUp2 size={26} variant="Bold" color={theme.palette.primary.contrastText} />
        </IconButton>

        <Box sx={s.grid}>
          {/* Brand */}
          <Box sx={s.col}>
            <Typography variant="h6" sx={s.brandName}>
              شریف‌زین
            </Typography>
            <Typography variant="caption" sx={s.eyebrow}>
              زین‌سازی تخصصی موتورسیکلت، دست‌دوز و اصیل
            </Typography>

            <Typography variant="body2" sx={s.brandDesc}>
              شریف‌زین با تکیه بر تجربه صنعتگرانی که هر بخیه را با دست می‌زنند، زین‌هایی طراحی می‌کند که هم به بدنه موتور وفادارند و هم به راحتی سرنشین. تضمین اصالت چرم، دوخت دستی و ارسال سریع، همراه هر سفارش شریف‌زین است.
            </Typography>

            <Box sx={s.socialRow}>
              <IconButton href="https://www.instagram.com/sharifzin/" sx={s.socialBtn}>
                <img src="/assets/icon/instagram.svg" alt="آدرس اینستاگرام شریف‌زین" width={22} height={22} />
              </IconButton>
              <IconButton href="https://wa.me/989101941207" sx={s.socialBtn}>
                <img src="/assets/icon/whatsapp.svg" alt="آدرس واتساپ شریف‌زین" width={22} height={22} />
              </IconButton>
              <IconButton href="https://t.me/sharifzin" sx={s.socialBtn}>
                <img src="/assets/icon/telegram.svg" alt="آدرس تلگرام شریف‌زین" width={22} height={22} />
              </IconButton>
              <IconButton href="https://bale.ai/sharifzin" sx={s.socialBtn}>
                <img src="/assets/icon/bale.png" alt="آدرس بله شریف‌زین" width={18} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={s.seam} />

          {/* Quick links */}
          <Box sx={s.col}>
            <Box sx={s.sectionHeader}>
              <Box sx={s.stitchMark}>×</Box>
              <Typography variant="subtitle1" sx={s.sectionTitle}>
                دسترسی سریع
              </Typography>
            </Box>
            <Box component="ul" sx={s.linkList}>
              {links?.map((link, index) => {
                const hasHref = Boolean(link?.href);
                return (
                  <Box key={index} component="li" sx={{ listStyleType: 'none' }}>
                    <Box component="a" href={link?.href} sx={{ ...s.link, color: hasHref ? s.textOnDark.color : alpha(s.textOnDark.color, 0.35) }}>
                      {link.title}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box sx={s.seam} />

          {/* Contact */}
          <Box sx={s.col}>
            <Box sx={s.sectionHeader}>
              <Box sx={s.stitchMark}>×</Box>
              <Typography variant="subtitle1" sx={s.sectionTitle}>
                ارتباط با ما
              </Typography>
            </Box>

            <Box sx={s.infoRow}>
              <Typography variant="body2" sx={s.textOnDark}>
                پشتیبانی
              </Typography>
              <Typography variant="body2" sx={s.textOnDark}>
                {ConvertToPersianDigit('09101941207')}
              </Typography>
            </Box>
            <Box sx={s.infoRow}>
              <Typography variant="body2" sx={s.textOnDark}>
                ایمیل
              </Typography>
              <Typography variant="body2" sx={s.textOnDark}>
                info@sharifzin.ir
              </Typography>
            </Box>
            <Box sx={s.infoRow}>
              <Typography variant="body2" sx={s.textOnDark}>
                آدرس:
              </Typography>
              <Typography variant="body2" sx={s.textOnDark}>
                ایران، تهران، میدان رازی (کمرگ)، خیابان مولوی، روبه روی پاساژ بهمن، کوچه خسجته، پلاک 6 ، طبقه بالا{' '}
              </Typography>
            </Box>
          </Box>

          <Box sx={s.seam} />

          {/* Newsletter */}
          <Box sx={s.col}>
            <Box sx={s.sectionHeader}>
              <Box sx={s.stitchMark}>×</Box>
              <Typography variant="subtitle1" sx={s.sectionTitle}>
                خبرنامه
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ...s.textOnDark, opacity: 0.75, mb: 2 }}>
              جهت عضویت در خبرنامه، شماره تلفن خود را وارد کنید
            </Typography>

            <Box sx={{ position: 'relative' }}>
              <InputBase
                placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputProps={{ 'aria-label': 'شماره تلفن خود را وارد کنید' }}
                startAdornment={
                  <Box sx={{ pl: 1, display: 'flex', color: theme.palette.primary.main }}>
                    <Call size={18} variant="Bold" />
                  </Box>
                }
                sx={s.searchInput}
              />
            </Box>
            <Box component="button" onClick={handleNewsletterSubmit} sx={s.subscribeBtn}>
              <Sms size={16} variant="Bold" />
              ثبت‌نام
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box sx={s.bottomBar}>
        <Typography variant="caption" sx={s.textOnDark}>
          تمامی مطالب و حقوق متعلق به فروشگاه شریف‌زین می‌باشد
        </Typography>

        <a href="https://www.zarinpal.com/verify/sharifzin" target="_blank" rel="noopener noreferrer">
          <Box sx={s.trustBadge}>
            <img src="/assets/trust-symbols/zarinpal.png" alt="نماد اعتماد الکترونیکی زرین‌پال شریف‌زین" width={40} height={40} />
          </Box>
        </a>

        <a href="https://vortexwebteam.ir" style={{ textDecoration: 'none' }}>
          <Typography variant="caption" sx={{ ...s.textOnDark, opacity: 0.7 }}>
            توسعه‌یافته توسط تیم طراحی سایت ورتکس
          </Typography>
        </a>
      </Box>
    </Box>
  );
}

const styles = (theme) => {
  const base = theme.palette.text.primary; // #0B1D30 — deepest tone in the palette, used as footer bg
  const baseDeep = theme.palette.secondary.dark; // #1E3A8A — for gradient depth
  const accent = theme.palette.primary.main; // #F97516
  const thread = theme.palette.secondary.light; // #3B82F6 — second thread color for seams/hang-tag hole
  const onDark = theme.palette.primary.contrastText; // #FFFFFF

  return {
    outer: {
      width: '100%',
      mt: 6,
    },

    wrapper: {
      position: 'relative',
      width: '100%',
      padding: { xs: '32px 24px', md: '48px 56px 40px' },
      borderRadius: '32px',
      background: `
        radial-gradient(circle at 15% 20%, ${alpha(thread, 0.1)}, transparent 40%),
        radial-gradient(circle at 85% 80%, ${alpha(accent, 0.12)}, transparent 45%),
        linear-gradient(180deg, ${base} 0%, ${baseDeep} 100%)
      `,
      borderTop: `2px dashed ${alpha(thread, 0.35)}`,
      overflow: 'visible',
    },

    rivet: {
      position: 'absolute',
      top: 0,
      right: '50%',
      transform: 'translate(50%, -50%)',
      borderRadius: '18px',
      width: 52,
      height: 52,
      background: theme.palette.primary.main,
      transition: 'all ease 0.2s',
      '&:hover': { transform: 'translate(50%, -55%)', background: theme.palette.primary.dark },
      '&:active': { transform: 'translate(50%, -48%)' },
    },

    hangTag: {
      position: 'absolute',
      top: -26,
      right: { xs: 24, md: 56 },
      width: 92,
      height: 108,
      backgroundColor: theme.palette.background.paper, // #EEEEEE
      borderRadius: '6px',
      border: `1px solid ${alpha(base, 0.15)}`,
      boxShadow: `0 10px 20px ${alpha('#000', 0.35)}`,
      transform: 'rotate(-6deg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0.5,
      pt: 1.5,
    },

    hangTagHole: {
      position: 'absolute',
      top: 8,
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: base,
      boxShadow: `inset 0 1px 2px ${alpha('#000', 0.5)}`,
    },

    hangTagLogo: {
      mt: 1,
    },

    hangTagText: {
      fontSize: '0.68rem',
      fontWeight: 800,
      color: theme.palette.text.primary,
    },

    grid: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1.4fr 1px 0.8fr 1px 1fr 1px 1.1fr' },
      gap: { xs: 4, md: 0 },
      mt: { xs: 4, md: 2 },
    },

    col: {
      px: { xs: 0, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
    },

    seam: {
      display: { xs: 'none', md: 'block' },
      width: 1,
      backgroundImage: `repeating-linear-gradient(180deg, ${alpha(thread, 0.45)} 0 8px, transparent 8px 16px)`,
    },

    brandName: {
      fontWeight: 800,
      color: onDark,
      mb: 0.5,
    },

    eyebrow: {
      color: theme.palette.primary.light,
      fontSize: '0.78rem',
      letterSpacing: 0.3,
      mb: 2,
    },

    brandDesc: {
      color: alpha(onDark, 0.65),
      fontSize: '0.85rem',
      lineHeight: 1.9,
      mb: 3,
    },

    socialRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
    },

    socialBtn: {
      width: 42,
      height: 42,
      backgroundColor: alpha(onDark, 0.06),
      border: `1px solid ${alpha(onDark, 0.1)}`,
      transition: '.25s',
      '&:hover': {
        backgroundColor: 'primary.main',
        transform: 'translateY(-3px)',
      },
    },

    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 2.5,
    },

    stitchMark: {
      width: 20,
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.primary.main,
      fontWeight: 800,
      fontSize: '1rem',
    },

    sectionTitle: {
      color: onDark,
      fontWeight: 800,
    },

    linkList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1.2,
      p: 0,
      m: 0,
    },

    link: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      textDecoration: 'none',
      fontSize: '0.88rem',
      transition: '.2s',
      '&:before': { content: '"›"', opacity: 0.5 },
      '&:hover': { color: 'primary.main', transform: 'translateX(-6px)' },
    },

    infoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: 0.8,
      borderBottom: `1px dashed ${alpha(onDark, 0.1)}`,
      gap: 5,
    },

    textOnDark: {
      color: onDark,
    },

    searchInput: {
      width: '100%',
      px: 1.5,
      py: 1,
      fontSize: '0.85rem',
      color: onDark,
      borderRadius: '10px',
      backgroundColor: alpha(onDark, 0.06),
      border: `1px solid ${alpha(onDark, 0.12)}`,
      transition: '.25s',
      '& input::placeholder': { color: alpha(onDark, 0.4) },
      '&:hover, &.Mui-focused': {
        borderColor: theme.palette.primary.main,
      },
    },

    subscribeBtn: {
      mt: 1.5,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      py: 1.1,
      border: 'none',
      borderRadius: '10px',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 700,
      fontSize: '0.85rem',
      fontFamily: 'Dana',
      cursor: 'pointer',
      transition: '.2s',
      '&:hover': { backgroundColor: theme.palette.primary.dark },
    },

    trustBadge: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: alpha(onDark, 0.9),
      borderRadius: '10px',
      padding: 0.75,
      transition: '.25s',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: `0 8px 20px ${alpha('#000', 0.3)}`,
      },
    },

    bottomBar: {
      width: '100%',
      mt: 1,
      px: { xs: 3, md: 7 },
      py: 2.5,
      borderRadius: '24px',
      backgroundColor: base,
      borderTop: `1px solid ${alpha(thread, 0.2)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
    },
  };
};
