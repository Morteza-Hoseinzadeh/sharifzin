'use client';

import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Stack, Tabs, Tab, IconButton, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TickCircle, Add, Minus, Book1, ShoppingCart } from 'iconsax-reactjs';

import theme from '../../../utils/theme/theme';
import ConvertToPersianDigit from '../../../utils/functions/convertToPersianDigit';
import { storeDetials } from '../../../utils/data/links';
import { getHexFromPersianColor } from '../../../utils/functions/getHexFromPersianColors';
import { productFQ } from '../../../utils/data/productsMock';
import ProductCard from '../../../components/custom/Product-Card/ProductCard';
import CardsTitle from '../../../components/custom/Cards-Title/CardsTitle';
import { getProducts } from '@/lib/api';

// --- Neomorphism Palette ---
const BG = '#E8ECF1'; // soft base
const SURFACE = '#F0F4F8'; // card surface
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_BLUE = '#3B82F6';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

// Neumorphic utilities
const neoRaised = {
  background: SURFACE,
  borderRadius: '20px',
  boxShadow: `
    8px 8px 16px ${SHADOW_DARK},
    -8px -8px 16px ${SHADOW_LIGHT}
  `,
  border: 'none',
};

const neoInset = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `
    inset 5px 5px 10px ${SHADOW_DARK},
    inset -5px -5px 10px ${SHADOW_LIGHT}
  `,
  border: 'none',
};

const neoPressed = {
  boxShadow: `
    inset 3px 3px 6px ${SHADOW_DARK},
    inset -3px -3px 6px ${SHADOW_LIGHT}
  `,
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '18px',
  boxShadow: `
    6px 6px 12px ${SHADOW_DARK},
    -6px -6px 12px ${SHADOW_LIGHT}
  `,
};

const TABS = [
  { value: 'description', label: 'توضیحات' },
  { value: 'specs', label: 'مشخصات فنی' },
  { value: 'qa', label: 'سوالات متداول محصول' },
];

function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <Stack direction="row" alignItems="center" gap={1.5}>
      <IconButton size="small" onClick={() => onChange(Math.min(max, value + 1))} sx={{ width: 38, height: 38, borderRadius: '12px', background: SURFACE, color: ACCENT_ORANGE, boxShadow: `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`, transition: 'all 0.2s ease', '&:hover': { boxShadow: `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`, transform: 'scale(0.97)' }, '&:active': neoPressed }}>
        <Add size={18} />
      </IconButton>

      <Box sx={{ minWidth: 92, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', ...neoInset, fontSize: 15, color: INK }}>{ConvertToPersianDigit(value)}</Box>

      <IconButton size="small" onClick={() => onChange(Math.max(min, value - 1))} sx={{ width: 38, height: 38, borderRadius: '12px', background: SURFACE, color: ACCENT_ORANGE, boxShadow: `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`, transition: 'all 0.2s ease', '&:hover': { boxShadow: `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`, transform: 'scale(0.97)' }, '&:active': neoPressed }}>
        <Minus size={18} />
      </IconButton>
    </Stack>
  );
}

// --------------------------------------------------
// Trust Badge Component
// --------------------------------------------------
function TrustBadge({ label, desc, accent, Icon }) {
  return (
    <Stack direction="row" gap={1.6} alignItems="center" sx={{ flex: 1, justifyContent: 'center', py: 2.4, px: 2 }}>
      <Box sx={{ width: 46, height: 46, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(accent, 0.14), color: accent, flexShrink: 0 }}>{Icon && <Icon size={22} variant="Bold" />}</Box>
      <Box>
        <Typography sx={{ fontSize: 13.5, color: accent, lineHeight: 1.3 }}>{label}</Typography>
        <Typography sx={{ fontSize: 11.5, color: 'text.disabled', mt: 0.35, lineHeight: 1.4 }}>{desc}</Typography>
      </Box>
    </Stack>
  );
}

function CheckListItem({ text, accent }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ ...neoSoft, px: 1.8, py: 1.2, mb: 1.2, transition: 'all 0.2s ease', '&:hover': { boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}` } }}>
      <Typography sx={{ fontSize: 13, color: INK_SOFT }}>{text}</Typography>
      <TickCircle size={18} variant="Bold" color={accent} />
    </Stack>
  );
}

export default function ProductView({ product }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    async function getData() {
      const response = await getProducts();
      setProducts(response?.data);
    }

    getData();
  }, []);

  const { title = null, brand = null, category_fa = null, description = null, price = null, discountedPrice = null, images = [] || null, features = [] || null, colors = [] || null, best_for = [] || null, specifications = {} || null } = product;

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? null);
  const [activeTab, setActiveTab] = useState('description');

  const final_price = discountedPrice ?? price;

  return (
    <>
      <Box sx={{ bgcolor: BG, borderRadius: '28px', my: 4, py: { xs: 2, md: 3 } }}>
        {/* Main Product Card */}
        <Box sx={{ ...neoRaised, p: { xs: 2.5, md: 3.5 }, background: SURFACE }}>
          <Grid container spacing={4}>
            {/* Gallery */}
            <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, lg: 2 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ ...neoInset, width: '100%', maxWidth: 340, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product?.thumbnail} alt={product?.title} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
              </Box>

              <Stack direction="row" gap={1.5} justifyContent="center" sx={{ width: '100%', flexWrap: 'wrap' }}>
                {images?.map((item, index) => (
                  <Box key={index} onClick={() => setActiveImage(index)} sx={{ width: 72, height: 72, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', background: SURFACE, boxShadow: activeImage === index ? `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}` : `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`, transition: 'all 0.2s ease', border: activeImage === index ? `2px solid ${ACCENT_BLUE}` : '2px solid transparent' }}>
                    <img src={item} alt={product?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Info */}
            <Grid size={{ xs: 12, md: 7 }} order={{ xs: 2, lg: 1 }}>
              {category_fa && brand && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography sx={{ fontSize: 14, color: INK_SOFT }}>برند:</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: ACCENT_BLUE }}>{brand}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography sx={{ fontSize: 14, color: INK_SOFT }}>دسته‌بندی:</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: ACCENT_BLUE }}>{category_fa}</Typography>
                  </Stack>
                </Stack>
              )}

              <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: INK, mb: 1.5, letterSpacing: '-0.3px' }}>
                {title}
              </Typography>

              {description && <Typography sx={{ fontSize: 13.5, color: INK_SOFT, mb: 3, lineHeight: 1.7 }}>{description}</Typography>}

              {/* Price */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ ...neoInset, px: 2.5, py: 1.8, mb: 2.5 }}>
                <Typography sx={{ fontSize: 15, color: INK_SOFT }}>قیمت:</Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: INK }}>
                    {ConvertToPersianDigit(Number(final_price)?.toLocaleString?.('fa-IR') ?? final_price)}
                  </Typography>
                  <img src="/assets/svg-overlays/toman-overlay.svg" width={22} height={22} alt="تومان" />
                </Stack>
              </Stack>

              {/* Quantity */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3.5 }}>
                <Typography sx={{ fontSize: 15, color: INK_SOFT }}>تعداد:</Typography>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </Stack>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.8}>
                <Button
                  fullWidth
                  size="large"
                  startIcon={<Book1 size={22} variant="Bulk" style={{ marginLeft: 8 }} />}
                  sx={{
                    py: 2,
                    fontSize: 15,
                    borderRadius: '16px',
                    color: '#fff',
                    background: `linear-gradient(145deg, ${ACCENT_BLUE}, #2563EB)`,
                    boxShadow: `0 0 30px ${alpha(theme.palette.secondary.main, 0.5)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': { background: `linear-gradient(145deg, #2563EB, ${ACCENT_BLUE})`, boxShadow: `4px 4px 10px ${SHADOW_DARK},-3px -3px 8px ${SHADOW_LIGHT}`, transform: 'translateY(1px)' },
                    '&:active': { boxShadow: `inset 4px 4px 8px rgba(0,0,0,0.25)` },
                  }}
                >
                  آموزش نحوه ثبت سفارش
                </Button>

                <Button
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCart size={22} variant="Bulk" style={{ marginLeft: 8 }} />}
                  sx={{
                    py: 2,
                    fontSize: 15,
                    borderRadius: '16px',
                    color: '#fff',
                    background: `linear-gradient(145deg, ${ACCENT_ORANGE}, #E86A0C)`,
                    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': { background: `linear-gradient(145deg, #E86A0C, ${ACCENT_ORANGE})`, boxShadow: `  4px 4px 10px ${SHADOW_DARK},  -3px -3px 8px ${SHADOW_LIGHT}`, transform: 'translateY(1px)' },
                    '&:active': { boxShadow: `inset 4px 4px 8px rgba(0,0,0,0.25)` },
                  }}
                >
                  افزودن به سبد خرید
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Trust Badges */}
        <Grid container spacing={2} sx={{ ...neoSoft, borderRadius: '24px', mt: 3, overflow: 'hidden', border: `1px solid ${alpha('#FFFFFF', 0.08)}` }}>
          {storeDetials?.map((item, index) => {
            const isOdd = index % 2 !== 0;
            const accent = isOdd ? ACCENT_ORANGE : ACCENT_BLUE;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <TrustBadge label={item?.title} desc={item?.description} accent={accent} Icon={item?.icon} />
                {index < storeDetials.length - 1 && <Box sx={{ width: { sm: '1px' }, height: { xs: '1px', sm: 'auto' }, bgcolor: alpha('#FFFFFF', 0.08), my: { xs: 0, sm: 2.5 }, mx: { xs: 3, sm: 0 } }} />}
              </Grid>
            );
          })}
        </Grid>

        {/* Tabs Section */}
        <Box sx={{ ...neoRaised, mt: 3.5, p: { xs: 2.5, md: 3.5 } }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3.5, minHeight: 48, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px', bgcolor: ACCENT_BLUE }, '& .MuiTab-root': { fontSize: 13.5, color: INK_SOFT, minHeight: 48, borderRadius: '12px', mx: 0.5, transition: 'all 0.2s ease' }, '& .Mui-selected': { color: `${ACCENT_BLUE} !important` } }}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {activeTab === 'description' && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography sx={{ fontSize: 14.5, color: INK, mb: 2 }}>ویژگی‌های محصول</Typography>
                {features.map((f, i) => (
                  <CheckListItem key={i} text={f} accent={ACCENT_ORANGE} />
                ))}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography sx={{ fontSize: 14.5, color: INK, mb: 2 }}>انتخاب رنگ دوخت</Typography>
                <Stack gap={1.2}>
                  {colors.map((c) => (
                    <Stack
                      key={c}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => setSelectedColor(c)}
                      sx={{ px: 1.8, py: 1.2, borderRadius: '14px', cursor: 'pointer', background: SURFACE, boxShadow: c === selectedColor ? `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}` : `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`, border: c === selectedColor ? `1.5px solid ${ACCENT_ORANGE}` : '1.5px solid transparent', transition: 'all 0.2s ease' }}
                    >
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: getHexFromPersianColor(c), boxShadow: `2px 2px 4px ${SHADOW_DARK}, -1px -1px 3px ${SHADOW_LIGHT}` }} />
                        <Typography sx={{ fontSize: 13.5, color: INK }}>{c}</Typography>
                      </Stack>
                      {c.name === selectedColor && <TickCircle size={18} variant="Bold" color={ACCENT_BLUE} />}
                    </Stack>
                  ))}
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography sx={{ fontSize: 14.5, color: INK, mb: 2 }}>مناسب برای</Typography>
                {best_for.map((item, i) => (
                  <CheckListItem key={i} text={item} accent={ACCENT_BLUE} />
                ))}
              </Grid>
            </Grid>
          )}

          {activeTab === 'specs' && (
            <Box>
              <Typography sx={{ fontSize: 15, color: INK, mb: 2.5 }}>مشخصات فنی</Typography>

              <Stack gap={1.2}>
                {Object.entries(specifications || {}).map(([key, value]) => {
                  // Optional: translate keys to Persian labels
                  const labels = { foam: 'نوع فوم', stitching: 'نوع دوخت', waterproof: 'ضد آب', warranty: 'گارانتی', weight: 'وزن' };

                  const displayValue = typeof value === 'boolean' ? (value ? 'دارد' : 'ندارد') : value;

                  return (
                    <Stack key={key} direction="row" alignItems="center" justifyContent="space-between" sx={{ ...neoSoft, px: 2, py: 1.4 }}>
                      <Typography sx={{ fontSize: 13.5, color: INK_SOFT }}>{labels[key] || key}</Typography>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{displayValue}</Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          )}

          {activeTab === 'qa' && (
            <Stack gap={2}>
              {productFQ.map((item, index) => (
                <Box key={index} sx={{ ...neoRaised, p: 2.5 }}>
                  {/* Question */}
                  <Stack direction="row" gap={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: alpha(ACCENT_BLUE, 0.12), color: ACCENT_BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>؟</Box>
                    <Box>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{item.question}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: INK_SOFT, mt: 0.4 }}>{item.date}</Typography>
                    </Box>
                  </Stack>

                  {/* Answer */}
                  <Box sx={{ ...neoInset, p: 1.8, ml: 4.5 }}>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT, lineHeight: 1.7 }}>{item.answer}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={4} alignItems={'center'} justifyContent={'center'} mt={4}>
        <CardsTitle fa_title={'محصولات پرفروش زین موتور، شریف زین'} en_title={"MOST SALE PRODUCT'S IN SHARIFZIN"} desc={'تضمین قیمت، تضمین کیفیت به همراه ماندگاری بالا'} />
        <Grid container spacing={4}>
          {products?.slice(0, 13).map((item) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
              <ProductCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
