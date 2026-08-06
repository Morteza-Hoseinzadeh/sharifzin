'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails, Button, TextField, InputAdornment } from '@mui/material';
import { ArrowDown2, SearchNormal1, MessageQuestion } from 'iconsax-reactjs';
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
  borderRadius: '22px',
  boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
  border: 'none',
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

const neoInset = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
};

// ==================== FAQ Data ====================
const faqData = [
  {
    category: 'محصولات و کیفیت',
    items: [
      {
        question: 'آیا محصولات شریف‌زین گارانتی دارند؟',
        answer: 'بله، تمامی محصولات و خدمات شریف‌زین دارای ۱۲ ماه گارانتی اصالت و سلامت کالا هستند. در صورت بروز هرگونه مشکل ناشی از کیفیت ساخت، محصول تعویض یا تعمیر می‌شود.',
      },
      {
        question: 'جنس فوم و رویه زین‌ها چیست؟',
        answer: 'ما از فوم سرد با تراکم بالا و رویه‌های باکیفیت (چرم طبیعی یا مصنوعی درجه یک) استفاده می‌کنیم که دوام و راحتی بالایی دارند.',
      },
      {
        question: 'آیا زین‌ها ضد آب هستند؟',
        answer: 'بسیاری از مدل‌های ما دارای پوشش ضد آب هستند. در صفحه هر محصول، مشخصات فنی به‌صورت کامل ذکر شده است.',
      },
      {
        question: 'آیا امکان سفارش زین کاملاً سفارشی وجود دارد؟',
        answer: 'بله، شما می‌توانید رنگ دوخت، نوع فوم، طرح و حتی ابعاد زین را به‌صورت کاملاً سفارشی سفارش دهید.',
      },
    ],
  },
  {
    category: 'سفارش و ارسال',
    items: [
      {
        question: 'چگونه می‌توانم سفارش ثبت کنم؟',
        answer: 'کافی است محصول مورد نظر را انتخاب کرده و به سبد خرید اضافه کنید. سپس مراحل پرداخت را تکمیل نمایید. همچنین می‌توانید از طریق تماس تلفنی سفارش خود را ثبت کنید.',
      },
      {
        question: 'زمان تحویل سفارش چقدر است؟',
        answer: 'در تهران تحویل اکسپرس کمتر از ۲ ساعت انجام می‌شود. برای سایر شهرها معمولاً بین ۱ تا ۳ روز کاری زمان نیاز است.',
      },
      {
        question: 'هزینه ارسال چقدر است؟',
        answer: 'هزینه ارسال بر اساس شهر مقصد و وزن مرسوله محاسبه می‌شود و در مرحله نهایی سبد خرید نمایش داده می‌شود.',
      },
      {
        question: 'آیا امکان پیگیری سفارش وجود دارد؟',
        answer: 'بله، پس از ثبت سفارش کد پیگیری برای شما ارسال می‌شود و می‌توانید وضعیت سفارش خود را از طریق سایت یا پشتیبانی پیگیری کنید.',
      },
    ],
  },
  {
    category: 'گارانتی و مرجوعی',
    items: [
      {
        question: 'شرایط مرجوع کردن کالا چیست؟',
        answer: 'تا ۷ روز پس از دریافت کالا، در صورتی که محصول استفاده نشده و در بسته‌بندی اصلی باشد، می‌توانید آن را مرجوع کنید.',
      },
      {
        question: 'اگر محصول ایراد داشته باشد چه باید کرد؟',
        answer: 'در اسرع وقت با پشتیبانی تماس بگیرید. پس از بررسی، محصول تعویض یا هزینه آن بازگردانده می‌شود.',
      },
      {
        question: 'گارانتی شامل چه مواردی می‌شود؟',
        answer: 'گارانتی شامل ایرادات ناشی از ساخت، دوخت و متریال می‌شود. آسیب‌های ناشی از استفاده نادرست یا تصادف شامل گارانتی نیست.',
      },
    ],
  },
  {
    category: 'خدمات و پشتیبانی',
    items: [
      {
        question: 'آیا خدمات تعمیر زین هم ارائه می‌دهید؟',
        answer: 'بله، ما خدمات تخصصی تعمیر، بازسازی، تعویض فوم و دوخت مجدد زین را نیز ارائه می‌دهیم.',
      },
      {
        question: 'چطور با پشتیبانی تماس بگیرم؟',
        answer: 'می‌توانید از طریق شماره ۰۹۱۰۱۹۴۱۲۰۷، ایمیل info@sharifzin.ir یا شبکه‌های اجتماعی با ما در ارتباط باشید.',
      },
      {
        question: 'ساعات پاسخگویی پشتیبانی چه زمانی است؟',
        answer: 'پشتیبانی ما همه روزه از ساعت ۹ صبح تا ۹ شب پاسخگوی شماست.',
      },
    ],
  },
];

// ==================== Component ====================
export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredData = faqData
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.question.includes(search) || item.answer.includes(search)),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: BG, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
        {/* Hero */}
        <Box sx={{ ...neoRaised, p: { xs: 3.5, md: 5 }, mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
              background: SURFACE,
              boxShadow: `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`,
              color: ACCENT_ORANGE,
            }}
          >
            <MessageQuestion size={30} variant="Bold" />
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 24, md: 30 },
              color: INK,
              mb: 1.5,
            }}
          >
            سوالات متداول
          </Typography>
          <Typography
            sx={{
              fontSize: 14.5,
              color: INK_SOFT,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            پاسخ سوالات پرتکرار شما درباره محصولات، سفارش، گارانتی و خدمات شریف‌زین
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ ...neoRaised, p: 1.5, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="جستجو در سوالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={20} color={INK_SOFT} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                bgcolor: 'transparent',
                '& fieldset': { border: 'none' },
                fontSize: 14,
                color: INK,
              },
            }}
          />
        </Box>

        {/* FAQ List */}
        {filteredData.length === 0 ? (
          <Box sx={{ ...neoInset, py: 6, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 15, color: INK_SOFT }}>نتیجه‌ای یافت نشد.</Typography>
          </Box>
        ) : (
          <Stack gap={3.5}>
            {filteredData.map((category, catIndex) => (
              <Box key={catIndex}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: INK,
                    mb: 1.8,
                    pr: 1,
                  }}
                >
                  {category.category}
                </Typography>

                <Stack gap={1.5}>
                  {category.items.map((item, index) => {
                    const panelId = `${catIndex}-${index}`;
                    return (
                      <Accordion
                        key={panelId}
                        expanded={expanded === panelId}
                        onChange={handleChange(panelId)}
                        sx={{
                          ...neoSoft,
                          '&:before': { display: 'none' },
                          boxShadow: expanded === panelId ? `inset 4px 4px 10px ${SHADOW_DARK}, inset -4px -4px 10px ${SHADOW_LIGHT}` : `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
                          borderRadius: '16px !important',
                          overflow: 'hidden',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ArrowDown2 size={18} color={expanded === panelId ? ACCENT_ORANGE : INK_SOFT} />}
                          sx={{
                            px: 2.2,
                            py: 0.5,
                            minHeight: 56,
                            '& .MuiAccordionSummary-content': {
                              my: 1.5,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: expanded === panelId ? ACCENT_ORANGE : INK,
                            }}
                          >
                            {item.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.2, pb: 2.2, pt: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 13.5,
                              color: INK_SOFT,
                              lineHeight: 1.85,
                            }}
                          >
                            {item.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {/* CTA */}
        <Box
          sx={{
            ...neoRaised,
            p: { xs: 3.5, md: 4.5 },
            mt: 5,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: INK, mb: 1.2 }}>سوال دیگری دارید؟</Typography>
          <Typography sx={{ fontSize: 14, color: INK_SOFT, mb: 3 }}>اگر پاسخ سوال خود را پیدا نکردید، با پشتیبانی ما در ارتباط باشید.</Typography>
          <Button
            sx={{
              px: 4.5,
              py: 1.5,
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: 14.5,
              color: '#fff',
              bgcolor: ACCENT_ORANGE,
              boxShadow: `6px 6px 14px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
              '&:hover': { bgcolor: '#E06B10' },
            }}
          >
            تماس با پشتیبانی
          </Button>
        </Box>
      </Box>
    </ChildrenLayout>
  );
}
