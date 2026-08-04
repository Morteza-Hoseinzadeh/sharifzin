'use client';

// components/custom/ProductsFilters/ProductsFilters.jsx
import { useMemo, useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Typography, Checkbox, InputBase, Select, MenuItem, InputLabel, FormControl, Slider, Switch, FormControlLabel, Button } from '@mui/material';
import { SearchNormal1, Filter } from 'iconsax-reactjs';

const EMPTY_FACETS = { categories: [], models: [], colors: [], materials: [], minPrice: 0, maxPrice: 0 };

function SectionHeader({ children, theme }) {
  return (
    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.secondary.light, flexShrink: 0 }} />
      <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
        {children}
      </Typography>
    </Box>
  );
}

function CheckRow({ label, checked, onClick, count, theme }) {
  return (
    <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderRadius: 1.5, px: 1, py: 0.5, transition: '.15s', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) } }}>
      <Box display="flex" alignItems="center" gap={0.5}>
        <Checkbox checked={checked} size="small" sx={{ p: 0.5, color: theme.palette.divider, '&.Mui-checked': { color: theme.palette.primary.main } }} />
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {label}
        </Typography>
      </Box>
      {typeof count === 'number' && (
        <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
          ({count.toLocaleString('fa-IR')})
        </Typography>
      )}
    </Box>
  );
}

export default function ProductsFilters({ facets = EMPTY_FACETS, counts = {} }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');

  // Defensive: even if a caller passes a partial object (e.g. {} ), fall back per-field
  // so `facets.minPrice` etc. can never be read off `undefined`.
  facets = { ...EMPTY_FACETS, ...facets };

  const current = {
    category: searchParams.get('category') || '',
    model: searchParams.get('model') || '',
    color: searchParams.get('color') || '',
    material: searchParams.get('material') || '',
    discount: searchParams.get('discount') === '1',
    sort: searchParams.get('sort') || '',
  };

  const [priceRange, setPriceRange] = useState([Number(searchParams.get('minPrice')) || facets.minPrice, Number(searchParams.get('maxPrice')) || facets.maxPrice]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.delete('page'); // reset pagination whenever a filter changes
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const toggleChip = (key, value) => updateParams({ [key]: current[key] === value ? '' : value });

  const applyPriceRange = () => updateParams({ minPrice: priceRange[0], maxPrice: priceRange[1] });

  const clearAll = () => {
    setPriceRange([facets.minPrice, facets.maxPrice]);
    setSearch('');
    startTransition(() => router.push(pathname));
  };

  const visibleCategories = useMemo(() => facets.categories.filter((c) => c.toLowerCase().includes(search.trim().toLowerCase())), [facets.categories, search]);

  const line = alpha(theme.palette.divider, 0.2);

  return (
    <Box sx={{ position: { md: 'sticky' }, top: 16, opacity: isPending ? 0.6 : 1, transition: 'opacity .15s', borderRadius: 2, p: 2.5 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <Filter size={18} variant="Bold" color={theme.palette.primary.main} />
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: theme.palette.text.primary }}>
            فیلتر محصولات
          </Typography>
        </Box>
        <Button size="small" onClick={clearAll} sx={{ color: theme.palette.text.secondary, minWidth: 0, px: 1 }}>
          حذف
        </Button>
      </Box>

      {/* Search within filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, mb: 2.5, borderRadius: '10px', bgcolor: theme.palette.background.default, border: `1px solid ${line}` }}>
        <SearchNormal1 size={16} color={theme.palette.text.disabled} />
        <InputBase placeholder="جستجو در برندها" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ fontSize: '0.85rem', width: '100%', color: theme.palette.text.primary }} />
      </Box>

      {/* Category (checkbox list) */}
      <Box mb={2.5}>
        <SectionHeader theme={theme}>برند موتور</SectionHeader>
        <Box display="flex" flexDirection="column">
          {visibleCategories.length === 0 ? (
            <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
              موردی یافت نشد
            </Typography>
          ) : (
            visibleCategories.map((c) => <CheckRow key={c} label={c} checked={current.category === c} onClick={() => toggleChip('category', c)} count={counts?.categories?.[c]} theme={theme} />)
          )}
        </Box>
      </Box>

      {facets.models.length > 0 && (
        <>
          <Box sx={{ borderTop: `1px solid ${line}`, my: 2.5 }} />
          <Box mb={2.5}>
            <SectionHeader theme={theme}>مدل</SectionHeader>
            <Box display="flex" flexDirection="column">
              {facets.models.map((m) => (
                <CheckRow key={m} label={m} checked={current.model === m} onClick={() => toggleChip('model', m)} count={counts?.models?.[m]} theme={theme} />
              ))}
            </Box>
          </Box>
        </>
      )}

      {facets.colors.length > 0 && (
        <>
          <Box sx={{ borderTop: `1px solid ${line}`, my: 2.5 }} />
          <Box mb={2.5}>
            <SectionHeader theme={theme}>رنگ</SectionHeader>
            <Box display="flex" flexDirection="column">
              {facets.colors.map((c) => (
                <CheckRow key={c} label={c} checked={current.color === c} onClick={() => toggleChip('color', c)} count={counts?.colors?.[c]} theme={theme} />
              ))}
            </Box>
          </Box>
        </>
      )}

      {facets.materials.length > 0 && (
        <>
          <Box sx={{ borderTop: `1px solid ${line}`, my: 2.5 }} />
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <InputLabel id="material-label">جنس</InputLabel>
            <Select labelId="material-label" label="جنس" value={current.material} onChange={(e) => updateParams({ material: e.target.value })}>
              <MenuItem value="">همه</MenuItem>
              {facets.materials.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <Box sx={{ borderTop: `1px solid ${line}`, my: 2.5 }} />

      {/* Price */}
      <Box mb={1}>
        <SectionHeader theme={theme}>محدوده قیمت (تومان)</SectionHeader>
        <Slider
          value={priceRange}
          onChange={(_, value) => setPriceRange(value)}
          min={facets.minPrice}
          max={facets.maxPrice}
          step={50000}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => v.toLocaleString('fa-IR')}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiSlider-thumb': {
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        />
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
            {priceRange[0].toLocaleString('fa-IR')}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
            {priceRange[1].toLocaleString('fa-IR')}
          </Typography>
        </Box>
      </Box>

      <FormControlLabel
        control={<Switch checked={current.discount} onChange={(e) => updateParams({ discount: e.target.checked ? '1' : '' })} />}
        label={
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            فقط تخفیف‌دارها
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      {/* Apply / Clear */}
      <Button fullWidth variant="contained" onClick={applyPriceRange} sx={{ borderRadius: '10px', py: 1.1, fontWeight: 700, bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: theme.palette.primary.dark } }}>
        اعمال فیلتر
      </Button>
      <Button fullWidth onClick={clearAll} sx={{ mt: 1, color: theme.palette.text.secondary, fontWeight: 600, fontSize: '0.85rem' }}>
        حذف فیلتر
      </Button>
    </Box>
  );
}
