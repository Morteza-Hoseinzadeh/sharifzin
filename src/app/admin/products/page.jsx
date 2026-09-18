'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, Modal, Grid, Paper } from '@mui/material';

import { alpha } from '@mui/material/styles';

import { Add, SearchNormal1, Edit2, Trash, Eye, Box1, Filter } from 'iconsax-reactjs';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import NewProductModal from './NewProductModal';

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
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`,
};

const neoInset = {
  background: SURFACE,
  borderRadius: '12px',
  boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}`,
};

const PRODUCTS_ENDPOINT = '/api/v1/admin/products';

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
  };
};

/* -------------------------------------------------------------------------- */
/*                            ARRAY NORMALIZER                                */
/* -------------------------------------------------------------------------- */

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
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
});

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [mode, setMode] = useState('view');

  const [formData, setFormData] = useState({});

  const [specsText, setSpecsText] = useState('{}');

  const [specsError, setSpecsError] = useState(false);

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

  /* ------------------------------------------------------------------------ */
  /*                              INITIAL LOAD                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    getAllProducts(true);
  }, [getAllProducts]);

  /* ------------------------------------------------------------------------ */
  /*                       SET FORM WHEN PRODUCT CHANGES                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const nextFormData = productToFormData(selectedProduct);

    setFormData(nextFormData);

    const specifications = nextFormData.specifications || {};

    setSpecsText(JSON.stringify(specifications, null, 2));

    setSpecsError(false);
  }, [selectedProduct]);

  /* ------------------------------------------------------------------------ */
  /*                              CLOSE MODAL                                 */
  /* ------------------------------------------------------------------------ */

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setSelectedProduct(null);

    setMode('view');

    setFormData({});

    setSpecsText('{}');

    setSpecsError(false);
  };

  /* ------------------------------------------------------------------------ */
  /*                               OPEN MODAL                                 */
  /* ------------------------------------------------------------------------ */

  const openModal = (nextMode, product = null) => {
    setMode(nextMode);

    setSelectedProduct(product);

    setModalOpen(true);
  };

  /* ------------------------------------------------------------------------ */
  /*                              FIELD CHANGE                                */
  /* ------------------------------------------------------------------------ */

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /*                          SPECIFICATIONS CHANGE                           */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /*                              DELETE PRODUCT                              */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /*                           SAVE EDITED PRODUCT                            */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /*                         CREATE PRODUCT CALLBACK                           */
  /* ------------------------------------------------------------------------ */

  const handleNewProduct = async ({ productData, images = [] }) => {
    try {
      setSaving(true);

      /*
       * فعلاً create را بر اساس endpoint اصلی
       * products انجام می‌دهیم.
       *
       * اگر route آپلود تصاویر backend جدا باشد،
       * بعد از مشخص شدن route آن را نیز اینجا
       * به صورت multipart اضافه می‌کنیم.
       */

      const payload = buildProductPayload(productData);

      const response = await axiosInstance.post(PRODUCTS_ENDPOINT, payload);

      console.log('Created product:', response?.data);

      /*
       * images فعلاً فقط برای اینکه callback
       * اطلاعات آن را از Modal دریافت کند نگه داشته شده.
       *
       * چون API createProduct بر اساس controller
       * شما URL تصاویر را دریافت می‌کند،
       * برای آپلود واقعی باید route دقیق
       * uploadProductImages مشخص باشد.
       */

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
    if (!normalizedSearch) {
      return true;
    }

    return product.title?.toLowerCase().includes(normalizedSearch) || product.category_fa?.toLowerCase().includes(normalizedSearch) || product.brand?.toLowerCase().includes(normalizedSearch) || product.model?.toLowerCase().includes(normalizedSearch);
  });

  /* ------------------------------------------------------------------------ */
  /*                              RENDER MODAL                                */
  /* ------------------------------------------------------------------------ */

  const renderModal = () => (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="product-modal"
      sx={{
        overflowY: 'auto',
      }}>
      <Box
        sx={{
          width: {
            xs: '95%',
            sm: '90%',
            md: '80%',
            lg: '70%',
          },

          maxWidth: 1100,

          mx: 'auto',

          mt: 4,
          mb: 4,
        }}>
        <Paper
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          }}>
          {/* HEADER */}

          <Box
            sx={{
              bgcolor: SURFACE,
              p: 3,
              borderBottom: `1px solid ${INK_SOFT}20`,
            }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 24,
                color: INK,
              }}>
              {mode === 'create' ? 'اضافه کردن محصول جدید' : mode === 'edit' ? 'ویرایش محصول' : 'مشاهده محصول'}
            </Typography>
          </Box>

          {/* CONTENT */}

          <Box
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },

              maxHeight: '70vh',

              overflowY: 'auto',
            }}>
            <Grid container spacing={3}>
              {/* LEFT COLUMN */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField fullWidth label="عنوان محصول" value={formData.title || ''} disabled={mode === 'view'} onChange={handleFieldChange('title')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField fullWidth label="زیرعنوان" value={formData.subtitle || ''} disabled={mode === 'view'} onChange={handleFieldChange('subtitle')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField fullWidth label="برند" value={formData.brand || ''} disabled={mode === 'view'} onChange={handleFieldChange('brand')} />
                  </Grid>

                  <Grid size={12}>
                    <TextField fullWidth label="مدل" value={formData.model || ''} disabled={mode === 'view'} onChange={handleFieldChange('model')} />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}>
                    <TextField
                      fullWidth
                      label="قیمت"
                      type="number"
                      value={formData.price ?? ''}
                      disabled={mode === 'view'}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}>
                    <TextField
                      fullWidth
                      label="تخفیف (%)"
                      type="number"
                      value={formData.discount ?? ''}
                      disabled={mode === 'view'}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount: event.target.value,
                        }))
                      }
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}>
                    <TextField
                      fullWidth
                      label="قیمت نهایی"
                      type="number"
                      value={formData.final_price ?? ''}
                      disabled={mode === 'view'}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          final_price: event.target.value,
                        }))
                      }
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField fullWidth label="توضیحات" multiline rows={4} value={formData.description || ''} disabled={mode === 'view'} onChange={handleFieldChange('description')} />
                  </Grid>
                </Grid>
              </Grid>

              {/* RIGHT COLUMN */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}>
                <Stack spacing={2}>
                  <TextField fullWidth label="دسته‌بندی" value={formData.category || ''} disabled={mode === 'view'} onChange={handleFieldChange('category')} />

                  <TextField fullWidth label="دسته‌بندی فارسی" value={formData.category_fa || ''} disabled={mode === 'view'} onChange={handleFieldChange('category_fa')} />

                  <TextField fullWidth label="مواد" value={formData.material || ''} disabled={mode === 'view'} onChange={handleFieldChange('material')} />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      رنگ‌ها (جدا با کاما)
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={Array.isArray(formData.colors) ? formData.colors.join(', ') : formData.colors || ''}
                      disabled={mode === 'view'}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          colors: event.target.value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      ویژگی‌ها (جدا با کاما)
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || ''}
                      disabled={mode === 'view'}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          features: event.target.value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      مشخصات (JSON)
                    </Typography>

                    <TextField fullWidth multiline rows={7} value={specsText} disabled={mode === 'view'} onChange={(event) => handleSpecsChange(event.target.value)} error={specsError} helperText={specsError ? 'فرمت JSON معتبر نیست' : ' '} />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* FOOTER */}

          <Box
            sx={{
              p: 3,

              borderTop: `1px solid ${INK_SOFT}20`,

              display: 'flex',

              gap: 2,

              justifyContent: 'flex-end',
            }}>
            <Button
              onClick={handleCloseModal}
              disabled={saving}
              sx={{
                color: INK_SOFT,
              }}>
              لغو
            </Button>

            {mode !== 'view' && (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  bgcolor: ACCENT_ORANGE,

                  px: 4,

                  py: 1.2,

                  '&:hover': {
                    bgcolor: '#E06B10',
                  },
                }}>
                {saving ? 'در حال ذخیره...' : mode === 'create' ? 'ذخیره محصول جدید' : 'ذخیره تغییرات'}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <AdminLayout>
      <Box width="100%">
        {/* PAGE HEADER */}

        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          justifyContent="space-between"
          alignItems={{
            sm: 'center',
          }}
          gap={2}
          sx={{
            mb: 3.5,
          }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 22,
                color: INK,
              }}>
              مدیریت محصولات
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                color: INK_SOFT,
                mt: 0.5,
              }}>
              {ConvertToPersianDigit(products.length)} محصول ثبت‌شده
            </Typography>
          </Box>

          <Button
            onClick={() => setOpenNewModal(true)}
            startIcon={
              <Add
                size={18}
                style={{
                  marginLeft: 4,
                }}
              />
            }
            sx={{
              px: 2.5,
              py: 1.2,

              borderRadius: '12px',

              fontWeight: 600,

              fontSize: 14,

              color: '#fff',

              bgcolor: ACCENT_ORANGE,

              boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`,

              '&:hover': {
                bgcolor: '#E06B10',
              },
            }}>
            افزودن محصول
          </Button>
        </Stack>

        {/* SEARCH */}

        <Box
          sx={{
            ...neoSoft,
            p: 2,
            mb: 3,
          }}>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            gap={2}>
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
                  borderRadius: '12px',
                  ...neoInset,

                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />

            <Button
              startIcon={
                <Filter
                  size={16}
                  style={{
                    marginLeft: 4,
                  }}
                />
              }
              sx={{
                px: 2.5,

                borderRadius: '12px',

                fontWeight: 600,

                color: INK,

                ...neoSoft,

                whiteSpace: 'nowrap',
              }}>
              فیلتر
            </Button>
          </Stack>
        </Box>

        {/* TABLE */}

        <Box
          sx={{
            ...neoRaised,

            overflow: 'hidden',

            width: '100%',
          }}>
          <TableContainer
            sx={{
              overflowX: 'auto',
            }}>
            <Table
              sx={{
                minWidth: 1100,
              }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 180,
                    }}>
                    محصول
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 110,
                    }}>
                    دسته‌بندی
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 90,
                    }}>
                    قیمت نهایی
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 70,
                    }}>
                    تخفیف
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 110,
                    }}>
                    برند
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 110,
                    }}>
                    مدل
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 130,
                    }}>
                    رنگ‌ها
                  </TableCell>

                  <TableCell
                    align="left"
                    sx={{
                      fontWeight: 700,
                      color: INK_SOFT,
                      fontSize: {
                        xs: 11,
                        sm: 13,
                      },
                      minWidth: 140,
                    }}>
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{
                        py: 6,
                        color: INK_SOFT,
                      }}>
                      در حال دریافت محصولات...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{
                        py: 6,
                        color: INK_SOFT,
                      }}>
                      محصولی پیدا نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => {
                    const colorsStr = Array.isArray(product.colors) ? product.colors.join('، ') : product.colors || '';

                    const finalPrice = product.final_price ?? product.price ?? 0;

                    return (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,

                                borderRadius: '8px',

                                bgcolor: alpha(ACCENT_ORANGE, 0.1),

                                display: 'flex',

                                alignItems: 'center',

                                justifyContent: 'center',

                                color: ACCENT_ORANGE,
                              }}>
                              <Box1 size={18} variant="Bold" />
                            </Box>

                            <Typography
                              sx={{
                                fontWeight: 600,

                                fontSize: {
                                  xs: 12,
                                  sm: 13.5,
                                },

                                color: INK,

                                lineHeight: 1.2,
                              }}>
                              {product.title}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13,
                              },

                              color: INK_SOFT,
                            }}>
                            {product.category_fa}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: 600,

                              fontSize: {
                                xs: 12,
                                sm: 13.5,
                              },

                              color: INK,
                            }}>
                            {ConvertToPersianDigit(Number(finalPrice).toLocaleString())}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13.5,
                              },

                              color: INK,
                            }}>
                            {ConvertToPersianDigit(product.discount ?? 0)}٪
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13.5,
                              },

                              color: INK,
                            }}>
                            {product.brand}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13.5,
                              },

                              color: INK,
                            }}>
                            {product.model}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 13,
                              },

                              color: INK_SOFT,

                              whiteSpace: 'nowrap',
                            }}>
                            {colorsStr}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Stack direction="row" gap={0.5}>
                            <IconButton size="small" onClick={() => openModal('view', product)}>
                              <Eye size={17} color={INK_SOFT} />
                            </IconButton>

                            <IconButton size="small" onClick={() => openModal('edit', product)}>
                              <Edit2 size={17} color={ACCENT_ORANGE} />
                            </IconButton>

                            <IconButton size="small" onClick={() => handleDelete(product.id)}>
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
