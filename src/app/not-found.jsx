'use client';

import React from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Home2, ArrowLeft2, SearchNormal1, Warning2 } from 'iconsax-reactjs';
import Link from 'next/link';
import ChildrenLayout from '@/components/ChildrenLayout';

// ==================== Neomorphism Tokens ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '28px',
  boxShadow: `10px 10px 24px ${SHADOW_DARK}, -10px -10px 24px ${SHADOW_LIGHT}`,
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

export default function NotFound() {
  return (
    <>
      <Box sx={{ bgcolor: BG, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 6, md: 10 }, direction: 'rtl' }}>
        <Container maxWidth="sm">
          <Box sx={{ ...neoRaised, p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            {/* Icon */}
            <Box sx={{ width: 96, height: 96, borderRadius: '28px', mx: 'auto', mb: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ACCENT_ORANGE, 0.12), color: ACCENT_ORANGE, boxShadow: `6px 6px 16px ${SHADOW_DARK}, -6px -6px 16px ${SHADOW_LIGHT}` }}>
              <Warning2 size={48} variant="Bold" />
            </Box>

            {/* 404 Number */}
            <Typography sx={{ fontWeight: 900, fontSize: { xs: 72, md: 96 }, lineHeight: 1, color: alpha(INK, 0.08), letterSpacing: '-4px', mb: -1, userSelect: 'none' }}>۴۰۴</Typography>

            {/* Title */}
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK, mb: 1.5 }}>صفحه مورد نظر یافت نشد</Typography>

            {/* Description */}
            <Typography sx={{ fontSize: 15, color: INK_SOFT, lineHeight: 1.8, mb: 4, maxWidth: 380, mx: 'auto' }}>متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.</Typography>

            {/* Actions */}
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} justifyContent="center" alignItems="center">
              <Button component={Link} href="/" startIcon={<Home2 size={18} style={{ marginLeft: 6 }} />} sx={{ px: 3.5, py: 1.4, borderRadius: '14px', fontWeight: 700, fontSize: 14.5, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `5px 5px 14px ${alpha(ACCENT_ORANGE, 0.4)}`, minWidth: 160, '&:hover': { bgcolor: '#E06B10', boxShadow: `6px 6px 16px ${alpha(ACCENT_ORANGE, 0.45)}` } }}>
                بازگشت به خانه
              </Button>

              <Button component={Link} href="/products" startIcon={<SearchNormal1 size={18} style={{ marginLeft: 6 }} />} sx={{ px: 3.5, py: 1.4, borderRadius: '14px', fontWeight: 600, fontSize: 14.5, color: INK, minWidth: 160, ...neoSoft, '&:hover': { boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}` } }}>
                مشاهده محصولات
              </Button>
            </Stack>

            {/* Helpful Links */}
            <Box sx={{ mt: 5, pt: 3, borderTop: `1px solid ${alpha(INK, 0.06)}` }}>
              <Typography sx={{ fontSize: 13, color: INK_SOFT, mb: 2 }}>شاید این صفحات به شما کمک کند:</Typography>
              <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                {[
                  { label: 'صفحه اصلی', href: '/' },
                  { label: 'محصولات', href: '/products' },
                  { label: 'پنل کاربری', href: '/user' },
                  { label: 'تماس با ما', href: '/contact' },
                ].map((link) => (
                  <Button key={link.href} component={Link} href={link.href} size="small" sx={{ fontSize: 13, fontWeight: 600, color: ACCENT_ORANGE, px: 1.5, borderRadius: '10px', '&:hover': { bgcolor: alpha(ACCENT_ORANGE, 0.08) } }}>
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
