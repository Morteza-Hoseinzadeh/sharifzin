'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, Modal, Grid, Switch, Chip } from '@mui/material';

import { alpha } from '@mui/material/styles';

import { Add, SearchNormal1, Edit2, Trash, Eye, Box1, Filter, Truck } from 'iconsax-reactjs';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import NewProductModal from './NewProductModal';

const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const ACCENT_GREEN = '#2F9E44';

const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '22px',
  boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`,
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

const PRODUCTS_ENDPOINT = '/api/v1/admin/products';

/* -------------------------------------------------------------------------- */
/*                              NEO INPUT FIELD                               */
/* -------------------------------------------------------------------------- */

// ✅ was: TextField پیش‌فرض MUI با لیبل شناور (روی استایل inset خراب دیده می‌شد
// و حالت disabled خاکستریِ کم‌رنگ داشت). حالا لیبل بالای فیلد قرار می‌گیره،
// دقیقاً مثل فرم checkout، و متن disabled هم خوانا می‌مونه.
function NeoInput({ label, helperText, error, ...props }) {
  return (
    <Box>
      {label && <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK_SOFT, mb: 0.8, pr: 0.5 }}>{label}</Typography>}

      <TextField
        fullWidth
        error={error}
        {...props}
        sx={{
          '& .MuiOutlinedInput-root': {
            ...neoInset,
            fontSize: 14,
            color: INK,
            '& fieldset': { border: 'none' },
            '&.Mui-error': { outline: '1.5px solid #E53E3E' },
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: INK,
            opacity: 0.85,
          },
        }}
      />

      {helperText && helperText.trim() && <Typography sx={{ fontSize: 12, color: error ? '#E53E3E' : INK_SOFT, mt: 0.6, pr: 0.5 }}>{helperText}</Typography>}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*                              NORMALIZE PRODUCT                             */
/* -------------------------------------------------------------------------- */

const normalizeProduct = (product = {}) => ({
  id: product.id,

  title: product.title || '',
  subtitle: product.subtitle || '',

  brand: product.brand || '',

  category: product.category || '',
  category_fa: product.category_fa || '',

  model: product.model || '',

  price: Number(product.price) || 0,
  discount: Number(product.discount) || 0,
  final_price: Number(product.final_price) || Number(product.price) || 0,

  thumbnail: product.thumbnail || '',

  images: Array.isArray(product.images) ? product.images : product.thumbnail ? [product.thumbnail] : [],

  colors: Array.isArray(product.colors) ? product.colors : [],

  material: product.material || '',

  description: product.description || '',

  features: Array.isArray(product.features) ? product.features : [],

  specifications: product.specifications && typeof product.specifications === 'object' ? product.specifications : {},

  // ✅ new: 1 = مشتری باید زین خودش رو به مغازه تحویل بده
  requires_physical_item: Number(product.requires_physical_item) === 1 ? 1 : 0,
});

/* -------------------------------------------------------------------------- */
/*                            FORM DATA BUILDER                               */
/* -------------------------------------------------------------------------- */

const productToFormData = (product) => {
  const normalized = normalizeProduct(product);

  return {
    id: normalized.id,

    title: normalized.title,
    subtitle: normalized.subtitle,

    brand: normalized.brand,

    category: normalized.category,
    category_fa: normalized.category_fa,

    model: normalized.model,

    price: normalized.price,
    discount: normalized.discount,
    final_price: normalized.final_price,

    thumbnail: normalized.thumbnail,
    images: normalized.images,

    colors: normalized.colors,

    material: normalized.material,

    description: normalized.description,

    features: normalized.features,

    specifications: normalized.specifications,

    requires_physical_item: normalized.requires_physical_item, // ✅ new
  };
};

/* -------------------------------------------------------------------------- */
/*                            ARRAY NORMALIZER                                */
/* -------------------------------------------------------------------------- */

const normalizeArray = (value) => {
  const separator = /[-–—,،]/;

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item ?? '').split(separator))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!value) return [];

  return String(value)
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
};

/* -------------------------------------------------------------------------- */
/*                         API PRODUCT PAYLOAD                                */
/* -------------------------------------------------------------------------- */

const buildProductPayload = (data) => ({
  title: data.title?.trim() || '',
  subtitle: data.subtitle?.trim() || '',

  brand: data.brand?.trim() || '',

  category: data.category?.trim() || '',
  category_fa: data.category_fa?.trim() || '',

  model: data.model?.trim() || '',

  price: Number(data.price) || 0,
  discount: Number(data.discount) || 0,
  final_price: Number(data.final_price) || 0,

  thumbnail: data.thumbnail || '',

  images: Array.isArray(data.images) ? data.images : [],

  colors: normalizeArray(data.colors),

  material: data.material?.trim() || '',

  description: data.description?.trim() || '',

  features: normalizeArray(data.features),

  specifications: data.specifications && typeof data.specifications === 'object' ? data.specifications : {},

  // ✅ new
  requires_physical_item: Number(data.requires_physical_item) === 1 ? 1 : 0,
});

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  // ✅ new: دکمه‌ی «فیلتر» قبلاً هیچ کاری نمی‌کرد؛ حالا فقط محصولات نیازمند تحویل زین رو نشون میده
  const [onlyPhysical, setOnlyPhysical] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [mode, setMode] = useState('view');

  const [formData, setFormData] = useState({});

  const [specsText, setSpecsText] = useState('{}');

  const [specsError, setSpecsError] = useState(false);

  // ✅ new: متن خام فیلدهای رنگ و ویژگی. قبلاً با هر کاراکتر تایپ‌شده آرایه ساخته و دوباره
  // join می‌شد و کاما بلافاصله پاک می‌شد؛ پس نمی‌شد چند مقدار تایپ کرد.
  const [colorsText, setColorsText] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  const [openNewModal, setOpenNewModal] = useState(false);

  const [saving, setSaving] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                          GET ALL PRODUCTS                                */
  /* ------------------------------------------------------------------------ */

  const getAllProducts = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const { data } = await axiosInstance.get(PRODUCTS_ENDPOINT);

      const apiProducts = Array.isArray(data?.data) ? data.data : [];

      setProducts(apiProducts.map(normalizeProduct));
    } catch (err) {
      console.error('خطا در دریافت محصولات:', err);

      alert(err?.response?.data?.message || 'دریافت محصولات با مشکل مواجه شد');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    getAllProducts(true);
  }, [getAllProducts]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const nextFormData = productToFormData(selectedProduct);

    setFormData(nextFormData);

    setSpecsText(JSON.stringify(nextFormData.specifications || {}, null, 2));

    setColorsText(normalizeArray(nextFormData.colors).join('-'));
    setFeaturesText(normalizeArray(nextFormData.features).join(', '));

    setSpecsError(false);
  }, [selectedProduct]);

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedProduct(null);
    setMode('view');
    setFormData({});
    setSpecsText('{}');
    setColorsText('');
    setFeaturesText('');
    setSpecsError(false);
  };

  const openModal = (nextMode, product = null) => {
    setMode(nextMode);
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecsChange = (value) => {
    setSpecsText(value);

    try {
      const parsed = JSON.parse(value);

      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Specifications must be an object');
      }

      setFormData((prev) => ({
        ...prev,
        specifications: parsed,
      }));

      setSpecsError(false);
    } catch {
      setSpecsError(true);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm('آیا از حذف این محصول اطمینان دارید؟');

    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`${PRODUCTS_ENDPOINT}/${id}`);

      setProducts((prev) => prev.filter((product) => product.id !== id));

      alert('محصول با موفقیت حذف شد');
    } catch (err) {
      console.error('Delete product error:', err);

      alert(err?.response?.data?.message || 'حذف محصول با مشکل مواجه شد');
    }
  };

  const handleSave = async () => {
    if (mode === 'view') {
      return;
    }

    if (specsError) {
      alert('فرمت JSON مشخصات معتبر نیست');
      return;
    }

    if (!formData.title?.trim()) {
      alert('عنوان محصول را وارد کنید');
      return;
    }

    try {
      setSaving(true);

      const payload = buildProductPayload(formData);

      if (mode === 'edit') {
        if (!formData.id) {
          alert('شناسه محصول پیدا نشد');
          return;
        }

        await axiosInstance.patch(`${PRODUCTS_ENDPOINT}/${formData.id}`, payload);

        alert('محصول با موفقیت ویرایش شد');
      }

      await getAllProducts(false);

      handleCloseModal();
    } catch (err) {
      console.error('Save product error:', err);

      alert(err?.response?.data?.message || 'عملیات با مشکل مواجه شد');
    } finally {
      setSaving(false);
    }
  };

  const handleNewProduct = async ({ productData, images = [] }) => {
    try {
      setSaving(true);

      const payload = buildProductPayload(productData);

      const response = await axiosInstance.post(PRODUCTS_ENDPOINT, payload);

      console.log('Created product:', response?.data);
      console.log('Selected images:', images);

      await getAllProducts(false);

      setOpenNewModal(false);

      alert('محصول جدید با موفقیت اضافه شد');
    } catch (err) {
      console.error('Create product error:', err);

      alert(err?.response?.data?.message || 'افزودن محصول با مشکل مواجه شد');

      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                  FILTER                                  */
  /* ------------------------------------------------------------------------ */

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (onlyPhysical && product.requires_physical_item !== 1) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return product.title?.toLowerCase().includes(normalizedSearch) || product.category_fa?.toLowerCase().includes(normalizedSearch) || product.brand?.toLowerCase().includes(normalizedSearch) || product.model?.toLowerCase().includes(normalizedSearch);
  });

  /* ------------------------------------------------------------------------ */
  /*                              RENDER MODAL                                */
  /* ------------------------------------------------------------------------ */

  const isView = mode === 'view';
  const physicalOn = Number(formData.requires_physical_item) === 1;

  const renderModal = () => (
    <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="product-modal" sx={{ overflowY: 'auto' }}>
      <Box
        sx={{
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: 1100,
          mx: 'auto',
          my: 4,
          outline: 'none',
        }}>
        <Box sx={{ ...neoRaised, bgcolor: BG, background: BG, overflow: 'hidden' }}>
          {/* HEADER */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(INK_SOFT, 0.15)}` }}>
            <Typography id="product-modal" sx={{ fontWeight: 800, fontSize: 22, color: INK }}>
              {mode === 'create' ? 'اضافه کردن محصول جدید' : mode === 'edit' ? 'ویرایش محصول' : 'مشاهده محصول'}
            </Typography>
            {formData.title && <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.5 }}>{formData.title}</Typography>}
          </Box>

          {/* CONTENT */}
          <Box sx={{ p: { xs: 2, sm: 3 }, maxHeight: '70vh', overflowY: 'auto' }}>
            <Grid container spacing={3}>
              {/* LEFT COLUMN */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.5}>
                  <NeoInput label="عنوان محصول" value={formData.title || ''} disabled={isView} onChange={handleFieldChange('title')} />
                  <NeoInput label="زیرعنوان" value={formData.subtitle || ''} disabled={isView} onChange={handleFieldChange('subtitle')} />
                  <NeoInput label="برند" value={formData.brand || ''} disabled={isView} onChange={handleFieldChange('brand')} />
                  <NeoInput label="مدل" value={formData.model || ''} disabled={isView} onChange={handleFieldChange('model')} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <NeoInput label="قیمت (تومان)" type="number" value={formData.price ?? ''} disabled={isView} onChange={handleFieldChange('price')} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <NeoInput label="تخفیف (%)" type="number" value={formData.discount ?? ''} disabled={isView} onChange={handleFieldChange('discount')} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <NeoInput label="قیمت نهایی" type="number" value={formData.final_price ?? ''} disabled={isView} onChange={handleFieldChange('final_price')} />
                    </Grid>
                  </Grid>

                  <NeoInput label="توضیحات" multiline rows={4} value={formData.description || ''} disabled={isView} onChange={handleFieldChange('description')} />
                </Stack>
              </Grid>

              {/* RIGHT COLUMN */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.5}>
                  <NeoInput label="دسته‌بندی" value={formData.category || ''} disabled={isView} onChange={handleFieldChange('category')} />
                  <NeoInput label="دسته‌بندی فارسی" value={formData.category_fa || ''} disabled={isView} onChange={handleFieldChange('category_fa')} />
                  <NeoInput label="مواد" value={formData.material || ''} disabled={isView} onChange={handleFieldChange('material')} />

                  <NeoInput
                    label="رنگ‌ها (با خط تیره جدا کنید)"
                    multiline
                    rows={2}
                    placeholder="مثال: آبی-مشکی-طلایی"
                    value={colorsText}
                    disabled={isView}
                    onChange={(event) => {
                      setColorsText(event.target.value);
                      setFormData((prev) => ({ ...prev, colors: normalizeArray(event.target.value) }));
                    }}
                  />

                  <NeoInput
                    label="ویژگی‌ها (با کاما جدا کنید)"
                    multiline
                    rows={2}
                    value={featuresText}
                    disabled={isView}
                    onChange={(event) => {
                      setFeaturesText(event.target.value);
                      setFormData((prev) => ({ ...prev, features: normalizeArray(event.target.value) }));
                    }}
                  />

                  <NeoInput label="مشخصات (JSON)" multiline rows={6} value={specsText} disabled={isView} onChange={(event) => handleSpecsChange(event.target.value)} error={specsError} helperText={specsError ? 'فرمت JSON معتبر نیست' : ''} />
                </Stack>
              </Grid>

              {/* ✅ new: سوییچ تحویل کالای فیزیکی - تمام عرض */}
              <Grid size={12}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  sx={{
                    ...(physicalOn ? neoInset : neoSoft),
                    p: 2.5,
                    border: `1.5px solid ${physicalOn ? ACCENT_ORANGE : 'transparent'}`,
                    transition: 'all .2s',
                  }}>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box sx={{ display: 'flex', color: physicalOn ? ACCENT_ORANGE : INK_SOFT }}>
                      <Truck size={26} variant={physicalOn ? 'Bold' : 'Linear'} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>نیاز به تحویل زین از مشتری</Typography>
                      <Typography sx={{ fontSize: 12.5, color: INK_SOFT, mt: 0.3, lineHeight: 1.9 }}>اگر روشن باشد، مشتری هنگام پرداخت باید روش رساندن زین به مغازه و روش دریافت مجدد آن را انتخاب کند.</Typography>
                    </Box>
                  </Stack>

                  <Switch
                    checked={physicalOn}
                    disabled={isView}
                    onChange={(event) => setFormData((prev) => ({ ...prev, requires_physical_item: event.target.checked ? 1 : 0 }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: ACCENT_ORANGE },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ACCENT_ORANGE },
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* FOOTER */}
          <Box sx={{ p: 3, borderTop: `1px solid ${alpha(INK_SOFT, 0.15)}`, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} disabled={saving} sx={{ ...neoSoft, px: 3, py: 1.2, color: INK_SOFT, fontWeight: 600 }}>
              {isView ? 'بستن' : 'لغو'}
            </Button>

            {!isView && (
              <Button
                onClick={handleSave}
                disabled={saving}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  bgcolor: ACCENT_ORANGE,
                  boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
                  '&:hover': { bgcolor: '#E06B10' },
                  '&.Mui-disabled': { bgcolor: alpha(ACCENT_ORANGE, 0.5), color: '#fff' },
                }}>
                {saving ? 'در حال ذخیره...' : mode === 'create' ? 'ذخیره محصول جدید' : 'ذخیره تغییرات'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */

  const headCellSx = { fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, bgcolor: SURFACE, borderBottom: `1px solid ${alpha(INK_SOFT, 0.15)}` };
  const bodyCellSx = { borderBottom: `1px solid ${alpha(INK_SOFT, 0.1)}` };

  return (
    <AdminLayout>
      <Box width="100%">
        {/* PAGE HEADER */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>مدیریت محصولات</Typography>

            <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(products.length)} محصول ثبت‌شده</Typography>
          </Box>

          <Button
            onClick={() => setOpenNewModal(true)}
            startIcon={<Add size={18} style={{ marginLeft: 4 }} />}
            sx={{
              px: 2.5,
              py: 1.2,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: 14,
              color: '#fff',
              bgcolor: ACCENT_ORANGE,
              boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,
              '&:hover': { bgcolor: '#E06B10' },
            }}>
            افزودن محصول
          </Button>
        </Stack>

        {/* SEARCH */}
        <Box sx={{ ...neoSoft, p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              fullWidth
              placeholder="جستجو در محصولات..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={18} color={INK_SOFT} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  ...neoInset,
                  '& fieldset': { border: 'none' },
                },
              }}
            />

            {/* ✅ was: دکمه‌ی بدون onClick. حالا فیلتر «نیازمند تحویل زین» رو روشن/خاموش می‌کنه */}
            <Button
              onClick={() => setOnlyPhysical((v) => !v)}
              startIcon={<Filter size={16} style={{ marginLeft: 4 }} variant={onlyPhysical ? 'Bold' : 'Linear'} />}
              sx={{
                px: 2.5,
                borderRadius: '12px',
                fontWeight: 600,
                color: onlyPhysical ? ACCENT_ORANGE : INK,
                ...(onlyPhysical ? neoInset : neoSoft),
                border: `1.5px solid ${onlyPhysical ? ACCENT_ORANGE : 'transparent'}`,
                whiteSpace: 'nowrap',
              }}>
              نیازمند تحویل زین
            </Button>
          </Stack>
        </Box>

        {/* TABLE */}
        <Box sx={{ ...neoRaised, overflow: 'hidden', width: '100%' }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, minWidth: 200 }}>محصول</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 110 }}>دسته‌بندی</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 90 }}>قیمت نهایی</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 70 }}>تخفیف</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 110 }}>برند</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 110 }}>مدل</TableCell>
                  <TableCell sx={{ ...headCellSx, minWidth: 130 }}>رنگ‌ها</TableCell>
                  {/* ✅ new */}
                  <TableCell sx={{ ...headCellSx, minWidth: 130 }}>تحویل زین</TableCell>
                  <TableCell align="left" sx={{ ...headCellSx, minWidth: 140 }}>
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6, color: INK_SOFT }}>
                      در حال دریافت محصولات...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6, color: INK_SOFT }}>
                      محصولی پیدا نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => {
                    const colorsStr = normalizeArray(product.colors).join('، ');
                    const finalPrice = product.final_price ?? product.price ?? 0;

                    return (
                      <TableRow key={product.id} hover sx={{ '&:hover': { bgcolor: alpha(ACCENT_ORANGE, 0.04) } }}>
                        <TableCell sx={bodyCellSx}>
                          <Stack direction="row" alignItems="center" gap={1.2}>
                            {/* ✅ was: همیشه آیکون جعبه. حالا اگه تصویر بندانگشتی هست همون نشون داده میشه */}
                            {product.thumbnail ? (
                              <Box component="img" src={product.thumbnail} alt={product.title} sx={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover', flexShrink: 0, ...neoSoft }} />
                            ) : (
                              <Box sx={{ width: 40, height: 40, borderRadius: '10px', flexShrink: 0, bgcolor: alpha(ACCENT_ORANGE, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT_ORANGE }}>
                                <Box1 size={18} variant="Bold" />
                              </Box>
                            )}

                            <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, sm: 13.5 }, color: INK, lineHeight: 1.5 }}>{product.title}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: INK_SOFT }}>{product.category_fa}</Typography>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{ConvertToPersianDigit(Number(finalPrice).toLocaleString())}</Typography>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{ConvertToPersianDigit(product.discount ?? 0)}٪</Typography>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{product.brand}</Typography>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{product.model}</Typography>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: INK_SOFT, whiteSpace: 'nowrap' }}>{colorsStr}</Typography>
                        </TableCell>

                        {/* ✅ new */}
                        <TableCell sx={bodyCellSx}>{product.requires_physical_item === 1 ? <Chip size="small" icon={<Truck size={14} color={ACCENT_ORANGE} />} label="نیاز دارد" sx={{ fontWeight: 700, fontSize: 12, color: ACCENT_ORANGE, bgcolor: alpha(ACCENT_ORANGE, 0.12), '& .MuiChip-icon': { mr: 0.5, ml: -0.3 } }} /> : <Chip size="small" label="ندارد" sx={{ fontSize: 12, color: INK_SOFT, bgcolor: alpha(INK_SOFT, 0.1) }} />}</TableCell>

                        <TableCell align="left" sx={bodyCellSx}>
                          <Stack direction="row" gap={0.5}>
                            <IconButton size="small" onClick={() => openModal('view', product)} aria-label="مشاهده">
                              <Eye size={17} color={INK_SOFT} />
                            </IconButton>

                            <IconButton size="small" onClick={() => openModal('edit', product)} aria-label="ویرایش">
                              <Edit2 size={17} color={ACCENT_ORANGE} />
                            </IconButton>

                            <IconButton size="small" onClick={() => handleDelete(product.id)} aria-label="حذف">
                              <Trash size={17} color="#E53E3E" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* EDIT / VIEW MODAL */}
        {renderModal()}
      </Box>

      {/* NEW PRODUCT MODAL */}
      <NewProductModal open={openNewModal} onClose={() => setOpenNewModal(false)} onSave={handleNewProduct} />
    </AdminLayout>
  );
}
