'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Button, TextField, InputAdornment, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchNormal1, Calendar, DocumentText, Eye } from 'iconsax-reactjs';
import Link from 'next/link';
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
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// ==================== Mock Data ====================
const categories = ['همه', 'زین‌سازی', 'نگهداری', 'راهنمای خرید', 'اخبار'];

const posts = [
  {
    id: 1,
    slug: 'how-to-choose-motorcycle-seat',
    title: 'چگونه بهترین زین موتورسیکلت را انتخاب کنیم؟',
    excerpt: 'راهنمای کامل انتخاب زین مناسب بر اساس نوع موتور، سبک رانندگی و آناتومی بدن شما.',
    category: 'راهنمای خرید',
    date: '۱۲ مرداد ۱۴۰۴',
    readTime: '۶ دقیقه',
    views: '۱,۲۴۰',
    image: null,
  },
  {
    id: 2,
    slug: 'foam-types-in-motorcycle-seats',
    title: 'انواع فوم در زین موتورسیکلت و تفاوت آن‌ها',
    excerpt: 'آشنایی با فوم سرد، فوم گرم و فوم مموری و تأثیر هرکدام بر راحتی و دوام زین.',
    category: 'زین‌سازی',
    date: '۵ مرداد ۱۴۰۴',
    readTime: '۸ دقیقه',
    views: '۹۸۰',
    image: null,
  },
  {
    id: 3,
    slug: 'how-to-clean-motorcycle-seat',
    title: 'روش صحیح تمیز کردن و نگهداری زین موتور',
    excerpt: 'نکات مهم برای افزایش عمر زین و جلوگیری از ترک‌خوردگی و رنگ‌پریدگی رویه.',
    category: 'نگهداری',
    date: '۲۸ تیر ۱۴۰۴',
    readTime: '۵ دقیقه',
    views: '۲,۱۵۰',
    image: null,
  },
  {
    id: 4,
    slug: 'custom-seat-benefits',
    title: 'مزایای زین سفارشی نسبت به زین فابریک',
    excerpt: 'چرا زین دست‌دوز و سفارشی راحتی و دوام بسیار بالاتری نسبت به نمونه‌های کارخانه‌ای دارد؟',
    category: 'زین‌سازی',
    date: '۱۵ تیر ۱۴۰۴',
    readTime: '۷ دقیقه',
    views: '۱,۶۷۰',
    image: null,
  },
  {
    id: 5,
    slug: 'waterproof-motorcycle-seat',
    title: 'آیا زین ضدآب ارزش خرید دارد؟',
    excerpt: 'بررسی مزایا و معایب پوشش‌های ضدآب در زین‌های موتورسیکلت و موارد استفاده مناسب.',
    category: 'راهنمای خرید',
    date: '۸ تیر ۱۴۰۴',
    readTime: '۴ دقیقه',
    views: '۸۴۰',
    image: null,
  },
  {
    id: 6,
    slug: 'sharifzin-workshop-tour',
    title: 'گشتی در کارگاه شریف‌زین؛ از ایده تا محصول نهایی',
    excerpt: 'آشنایی با مراحل ساخت یک زین دست‌دوز از انتخاب متریال تا دوخت نهایی در کارگاه ما.',
    category: 'اخبار',
    date: '۱ تیر ۱۴۰۴',
    readTime: '۹ دقیقه',
    views: '۳,۲۱۰',
    image: null,
  },
];

// ==================== Components ====================
function PostCard({ post }) {
  return (
    <Box
      component={Link}
      href={`/blog/${post.slug}`}
      sx={{
        ...neoSoft,
        display: 'block',
        textDecoration: 'none',
        overflow: 'hidden',
        height: '100%',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `10px 10px 22px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
        },
      }}
    >
      {/* Image Placeholder */}
      <Box
        sx={{
          height: 180,
          bgcolor: alpha(ACCENT_ORANGE, 0.08),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '18px 18px 0 0',
        }}
      >
        <DocumentText size={42} color={alpha(ACCENT_ORANGE, 0.45)} variant="Bold" />
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              bgcolor: alpha(ACCENT_ORANGE, 0.12),
              color: ACCENT_ORANGE,
              fontWeight: 600,
              fontSize: 11.5,
              height: 24,
              borderRadius: '8px',
            }}
          />
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <Eye size={14} color={INK_SOFT} />
            <Typography sx={{ fontSize: 11.5, color: INK_SOFT }}>{post.views}</Typography>
          </Stack>
        </Stack>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 15.5,
            color: INK,
            mb: 1.2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: INK_SOFT,
            lineHeight: 1.7,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.7}>
            <Calendar size={14} color={INK_SOFT} />
            <Typography sx={{ fontSize: 12, color: INK_SOFT }}>{post.date}</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, color: ACCENT_ORANGE, fontWeight: 600 }}>{post.readTime} مطالعه</Typography>
        </Stack>
      </Box>
    </Box>
  );
}

// ==================== Main Page ====================
export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('همه');

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'همه' || post.category === activeCategory;
    const matchesSearch = post.title.includes(search) || post.excerpt.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        {/* Hero */}
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 }, mb: 4, textAlign: 'center' }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 26, md: 32 },
              color: INK,
              mb: 1.5,
            }}
          >
            بلاگ شریف‌زین
          </Typography>
          <Typography
            sx={{
              fontSize: 14.5,
              color: INK_SOFT,
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            مقالات تخصصی درباره زین‌سازی، نگهداری، راهنمای خرید و دنیای موتورسواری
          </Typography>
        </Box>

        {/* Search + Categories */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 4 }}>
          {/* Search */}
          <Box sx={{ ...neoRaised, px: 1, flex: 1, maxWidth: { md: 360 } }}>
            <TextField
              fullWidth
              placeholder="جستجو در مقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={18} color={INK_SOFT} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  bgcolor: 'transparent',
                  '& fieldset': { border: 'none' },
                  fontSize: 15.5,
                  color: INK,
                },
              }}
            />
          </Box>

          {/* Categories */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  height: 36,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  bgcolor: activeCategory === cat ? ACCENT_ORANGE : SURFACE,
                  color: activeCategory === cat ? '#fff' : INK,
                  boxShadow: activeCategory === cat ? 'none' : `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                  '&:hover': {
                    bgcolor: activeCategory === cat ? '#E06B10' : alpha(ACCENT_ORANGE, 0.1),
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Box sx={{ ...neoInset, py: 8, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 15, color: INK_SOFT }}>مقاله‌ای یافت نشد.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filteredPosts.map((post) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              sx={{
                px: 4.5,
                py: 1.5,
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: 14,
                color: INK,
                ...neoSoft,
                '&:hover': {
                  boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
                },
              }}
            >
              مشاهده مقالات بیشتر
            </Button>
          </Box>
        )}
      </Box>
    </ChildrenLayout>
  );
}
