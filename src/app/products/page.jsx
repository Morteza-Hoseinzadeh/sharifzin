'use client';

import { Box, Grid, Typography, Chip, Stack, Breadcrumbs, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { ArrowRight2, ArrowLeft2, CloseCircle, Menu, Grid1, Grid5 } from 'iconsax-reactjs';

import Link from 'next/link';

import ChildrenLayout from '@/components/ChildrenLayout';
import ProductCard from '@/components/custom/Product-Card/ProductCard';
import ProductsFilters from '@/components/pages/products/productsFilters';

import { products as ALL_PRODUCTS, products } from '../../utils/data/productsMock';
import theme from '../../utils/theme/theme';
import CardsTitle from '@/components/custom/Cards-Title/CardsTitle';
import ConvertToPersianDigit from '../../utils/functions/convertToPersianDigit';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const PAGE_SIZE = 12;

// ---- Visual identity tokens, derived from the real MUI theme -----------
const INK = theme.palette.text.primary;
const INK_SOFT = theme.palette.text.secondary;
const BRAND = theme.palette.primary.main;
const BRAND_DARK = theme.palette.primary.dark;
const GOLD = theme.palette.secondary.light; // second accent (thread/rivet role)
const PAPER = theme.palette.background.paper;
const BG = theme.palette.background.default;
const LINE = alpha(theme.palette.divider, 0.25);

const FILTER_LABELS = {
  category: 'دسته‌بندی',
  model: 'مدل',
  color: 'رنگ',
  material: 'جنس',
  discount: 'تخفیف‌دار',
  minPrice: 'حداقل قیمت',
  maxPrice: 'حداکثر قیمت',
  sort: 'مرتب‌سازی',
};

function getFacets(list) {
  const prices = list.map((p) => p.finalPrice);
  return {
    categories: [...new Set(list.map((p) => p.category))],
    models: [...new Set(list.map((p) => p.model))],
    colors: [...new Set(list.flatMap((p) => p.colors ?? []))],
    materials: [...new Set(list.map((p) => p.material).filter(Boolean))],
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}

function filterProducts(list, params) {
  let result = list;

  if (params.category) result = result.filter((p) => p.category === params.category);
  if (params.model) result = result.filter((p) => p.model === params.model);
  if (params.color) result = result.filter((p) => p.colors?.includes(params.color));
  if (params.material) result = result.filter((p) => p.material === params.material);
  if (params.discount === '1') result = result.filter((p) => p.discount > 0);
  if (params.minPrice) result = result.filter((p) => p.finalPrice >= Number(params.minPrice));
  if (params.maxPrice) result = result.filter((p) => p.finalPrice <= Number(params.maxPrice));

  if (params.sort === 'price_asc') result = [...result].sort((a, b) => a.finalPrice - b.finalPrice);
  else if (params.sort === 'price_desc') result = [...result].sort((a, b) => b.finalPrice - a.finalPrice);
  else if (params.sort === 'newest') result = [...result].sort((a, b) => b.id - a.id);

  return result;
}

function buildHref(sp, overrides) {
  const params = new URLSearchParams();
  Object.entries({ ...sp, ...overrides }).forEach(([k, v]) => {
    if (v) params.set(k, String(v));
  });
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ''}`;
}

const SORT_OPTIONS = [
  { value: '', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
];

function ListPreview() {
  return (
    <Box display={'flex'} alignItems={'center'} gap={1}>
      <label style={{ fontFamily: 'Dana', fontSize: 16, color: '#6b6b6b', whiteSpace: 'nowrap' }}>نمایش:</label>
      <IconButton sx={{ borderRadius: '8px', backgroundColor: 'primary.main', p: 1, '&:hover': { backgroundColor: 'priamry.dark' } }}>
        <Menu variant="Bulk" color={theme.palette.primary.contrastText} size={18} />
      </IconButton>
    </Box>
  );
}

function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') ?? '';

  const handleChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) params.set('sort', value);
    else params.delete('sort');

    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="sort-select" style={{ fontFamily: 'Dana', fontSize: 16, color: '#6b6b6b', whiteSpace: 'nowrap' }}>
        مرتب سازی بر اساس:
      </label>

      <select id="sort-select" className="sort-select" value={currentSort} onChange={handleChange} style={{ width: 220, height: 34, fontFamily: 'Dana', fontSize: 16, color: theme.palette.text.disabled, borderRadius: 12, border: '1px solid #e0e0e0', backgroundColor: theme.palette.background.paper, padding: '0 12px', cursor: 'pointer', outline: 'none' }}>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value || 'default'} value={opt.value} style={{ fontFamily: 'Dana', padding: '8px 12px' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActiveFilters({ sp }) {
  const entries = Object.entries(sp).filter(([k, v]) => k !== 'page' && v);
  if (entries.length === 0) return null;

  return (
    <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" mb={3}>
      <Typography variant="caption" sx={{ color: INK_SOFT, fontWeight: 600 }}>
        فیلترهای فعال:
      </Typography>
      {entries.map(([key, value]) => (
        <Chip key={key} component={Link} href={buildHref(sp, { [key]: undefined, page: undefined })} clickable size="small" deleteIcon={<CloseCircle size={16} variant="Bold" />} onDelete={() => {}} label={`${FILTER_LABELS[key] ?? key}: ${value === '1' ? 'دارد' : value}`} sx={{ bgcolor: PAPER, border: `1px solid ${LINE}`, color: INK, fontWeight: 500, '&:hover': { borderColor: BRAND, bgcolor: alpha(BRAND, 0.06) } }} />
      ))}
      <Chip component={Link} href="/products" clickable size="small" label="پاک کردن همه" sx={{ bgcolor: 'transparent', color: BRAND, fontWeight: 700, border: `1px solid ${BRAND}`, '&:hover': { bgcolor: alpha(BRAND, 0.06) } }} />
    </Stack>
  );
}

// Builds a compact page list with ellipsis gaps: 1 … 4 5 [6] 7 8 … 24
function getPageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withGaps = [];
  let prev = 0;
  for (const p of list) {
    if (prev && p - prev > 1) withGaps.push('gap');
    withGaps.push(p);
    prev = p;
  }
  return withGaps;
}

export default function ProductsPage() {
  const sp = useSearchParams();
  const pageNum = Number(sp.page) || 1;

  const facets = getFacets(ALL_PRODUCTS);
  const filtered = filterProducts(ALL_PRODUCTS, sp);

  const start = (pageNum - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const activeLabel = [sp.category, sp.model].filter(Boolean).join(' ');
  const pageList = getPageList(pageNum, totalPages);

  return (
    <ChildrenLayout>
      <Box component="section" sx={{ py: { xs: 3, md: 5 } }}>
        <CardsTitle en_title={activeLabel ? `${activeLabel} MOTORCYCLE SEAT` : "MOTORCYCLE SEAT'S"} fa_title={activeLabel ? `خرید، ${activeLabel}` : 'خرید زین موتور، اصل و دست‌دوز'} desc={activeLabel ? `انواع ${activeLabel} با بهترین کیفیت، دوخت حرفه‌ای، ارسال سریع و قیمت مناسب.` : 'خرید انواع زین موتور اصل و دست‌دوز با بهترین کیفیت، مناسب انواع موتورسیکلت، ارسال سریع و تضمین کیفیت.'} />

        <Grid container spacing={2} mt={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 96 }, bgcolor: '#fff', borderRadius: 6, p: 2.5 }}>
              <ProductsFilters facets={facets} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: '32px' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1} mb={2} p={2}>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="body1" sx={{ color: INK_SOFT }}>
                    نمایش {ConvertToPersianDigit(filtered?.length)} محصول از {ConvertToPersianDigit(products?.length)} محصول
                  </Typography>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} gap={4}>
                  <ListPreview />
                  <SortSelect />
                </Stack>
              </Stack>

              <ActiveFilters sp={sp} />

              {items.length === 0 ? (
                <Box sx={{ textAlign: 'center', border: `1px solid ${LINE}`, borderRadius: 2, bgcolor: PAPER, px: 3, py: 8 }}>
                  <Typography variant="subtitle1" sx={{ color: INK, fontWeight: 700, mb: 0.5 }}>
                    محصولی با این فیلترها پیدا نشد
                  </Typography>
                  <Typography variant="body2" sx={{ color: INK_SOFT, mb: 2 }}>
                    فیلترها را تغییر دهید یا از ابتدا شروع کنید
                  </Typography>
                  <Chip component={Link} href="/products" clickable label="پاک کردن فیلترها" sx={{ bgcolor: BRAND, color: PAPER, fontWeight: 700, px: 1 }} />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {items.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                      <ProductCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {totalPages > 1 && (
                <Box component="nav" aria-label="صفحه‌بندی" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 6 }}>
                  <Link href={buildHref(sp, { page: Math.max(1, pageNum - 1) })} aria-disabled={pageNum === 1} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, color: pageNum === 1 ? INK_SOFT : INK, pointerEvents: pageNum === 1 ? 'none' : 'auto', opacity: pageNum === 1 ? 0.4 : 1, fontSize: 14 }}>
                    <ArrowRight2 size={18} variant="Linear" />
                    قبلی
                  </Link>

                  {pageList.map((p, i) =>
                    p === 'gap' ? (
                      <Typography key={`gap-${i}`} sx={{ color: INK_SOFT, px: 0.5 }}>
                        …
                      </Typography>
                    ) : (
                      <Link key={p} href={buildHref(sp, { page: p })} aria-current={p === pageNum ? 'page' : undefined} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 34, height: 34, borderRadius: 8, fontWeight: p === pageNum ? 800 : 500, color: p === pageNum ? PAPER : INK, backgroundColor: p === pageNum ? BRAND : 'transparent', border: p === pageNum ? 'none' : `1px solid ${LINE}`, fontSize: 14 }}>
                        {p}
                      </Link>
                    )
                  )}

                  <Link href={buildHref(sp, { page: Math.min(totalPages, pageNum + 1) })} aria-disabled={pageNum === totalPages} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, color: pageNum === totalPages ? INK_SOFT : INK, pointerEvents: pageNum === totalPages ? 'none' : 'auto', opacity: pageNum === totalPages ? 0.4 : 1, fontSize: 14 }}>
                    بعدی
                    <ArrowLeft2 size={18} variant="Linear" />
                  </Link>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ChildrenLayout>
  );
}
