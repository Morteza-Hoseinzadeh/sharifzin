'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Grid, InputLabel, InputAdornment, InputBase, IconButton, useTheme, alpha, LinearProgress } from '@mui/material';

import { CloseCircle, Add, Trash, DocumentUpload, TickCircle } from 'iconsax-reactjs';

const API_URL = 'https://sharifzin.ir/api/v1';

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const SectionTitle = ({ children, palette }) => (
  <Typography
    sx={{
      fontSize: 16,
      fontWeight: 800,
      color: palette.title,
      mb: 2,
    }}>
    {children}
  </Typography>
);

/* -------------------------------------------------------------------------- */
/*                                    FIELD                                   */
/* -------------------------------------------------------------------------- */

const Field = ({ label, field, placeholder, type = 'text', multiline = false, rows = 4, endAdornment, formData, handleChange, palette, inputSx, disabled = false }) => (
  <Box>
    <InputLabel sx={{ mb: 1, color: palette.label, fontSize: 13, fontWeight: 700 }}>{label}</InputLabel>

    <InputBase fullWidth type={type} multiline={multiline} rows={multiline ? rows : undefined} value={formData[field] ?? ''} onChange={handleChange(field)} placeholder={placeholder} disabled={disabled} endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined} sx={inputSx} />
  </Box>
);

/* -------------------------------------------------------------------------- */
/*                              NEW PRODUCT MODAL                             */
/* -------------------------------------------------------------------------- */

const NewProductModal = ({ open, onClose, onSave }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const palette = {
    background: isDark ? '#10131A' : '#FFFFFF',
    paper: isDark ? '#171B24' : '#FFFFFF',
    title: isDark ? '#FFFFFF' : '#111827',
    text: isDark ? '#D1D5DB' : '#374151',
    label: isDark ? '#CBD5E1' : '#374151',
    border: isDark ? '#2A3140' : '#E5E7EB',
    input: isDark ? '#11151D' : '#F9FAFB',
    primary: theme.palette.primary.main,
  };

  /* ------------------------------------------------------------------------ */
  /*                                FORM DATA                                 */
  /* ------------------------------------------------------------------------ */

  const initialFormData = {
    title: '',
    subtitle: '',
    brand: '',
    category: '',
    category_fa: '',
    model: '',
    price: '',
    discount: '',
    final_price: '',
    material: '',
    description: '',
    colors: '',
    best_for: '',
    features: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  /* ------------------------------------------------------------------------ */
  /*                              SPECIFICATIONS                              */
  /* ------------------------------------------------------------------------ */

  const [specifications, setSpecifications] = useState([
    {
      id: `${Date.now()}-initial`,
      key: '',
      value: '',
    },
  ]);

  /* ------------------------------------------------------------------------ */
  /*                                  IMAGES                                   */
  /* ------------------------------------------------------------------------ */

  const [images, setImages] = useState([]);

  /* ------------------------------------------------------------------------ */
  /*                                  STATES                                   */
  /* ------------------------------------------------------------------------ */

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  /* ------------------------------------------------------------------------ */
  /*                               RESET FORM                                 */
  /* ------------------------------------------------------------------------ */

  const resetForm = () => {
    images.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setFormData(initialFormData);

    setSpecifications([
      {
        id: `${Date.now()}-initial`,
        key: '',
        value: '',
      },
    ]);

    setImages([]);
    setUploadProgress(0);
    setError('');
  };

  /* ------------------------------------------------------------------------ */
  /*                               CLOSE MODAL                                */
  /* ------------------------------------------------------------------------ */

  const handleClose = () => {
    if (uploading) return;

    resetForm();

    if (onClose) {
      onClose();
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              INPUT HANDLER                               */
  /* ------------------------------------------------------------------------ */

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError('');
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                         SPECIFICATION HANDLERS                           */
  /* ------------------------------------------------------------------------ */

  const addSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        key: '',
        value: '',
      },
    ]);
  };

  const updateSpecification = (id, field, value) => {
    setSpecifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeSpecification = (id) => {
    setSpecifications((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                              BUILD SPECS                                 */
  /* ------------------------------------------------------------------------ */

  const buildSpecifications = () => {
    return specifications
      .filter((item) => String(item.key || '').trim() || String(item.value || '').trim())
      .map((item) => ({
        key: String(item.key || '').trim(),
        value: String(item.value || '').trim(),
      }));
  };

  /* ------------------------------------------------------------------------ */
  /*                              ARRAY PARSER                                */
  /* ------------------------------------------------------------------------ */

  const parseCommaSeparated = (value) => {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  /* ------------------------------------------------------------------------ */
  /*                              IMAGE HANDLER                               */
  /* ------------------------------------------------------------------------ */

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}-${file.name}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((prev) => [...prev, ...newImages]);

    event.target.value = '';

    if (error) {
      setError('');
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              REMOVE IMAGE                                */
  /* ------------------------------------------------------------------------ */

  const removeImage = (id) => {
    setImages((prev) => {
      const image = prev.find((item) => item.id === id);

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                           CLEANUP OBJECT URLS                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                            VALIDATE FORM                                 */
  /* ------------------------------------------------------------------------ */

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'عنوان محصول را وارد کنید.';
    }

    if (!formData.category.trim()) {
      return 'دسته‌بندی محصول را وارد کنید.';
    }

    if (!formData.price.trim()) {
      return 'قیمت محصول را وارد کنید.';
    }

    return '';
  };

  /* ------------------------------------------------------------------------ */
  /*                    ✅ NEW: ACTUALLY UPLOAD IMAGES                        */
  /* ------------------------------------------------------------------------ */
  const uploadImages = async (files) => {
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const form = new FormData();
      form.append('attachment', file);

      const res = await fetch(`${API_URL}/admin/products/upload-images`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.message || `آپلود تصویر «${file.name}» ناموفق بود`);
      }

      const data = await res.json();
      // بک‌اند { image, thumbnail } برمی‌گردونه (هر دو یکسان‌اند تو کنترلر فعلی)
      uploadedUrls.push(data.image || data.thumbnail);

      // پیشرفت آپلود عکس‌ها رو بین ۴۰٪ تا ۸۰٪ نمایش بده
      setUploadProgress(40 + Math.round(((i + 1) / files.length) * 40));
    }

    return uploadedUrls;
  };

  /* ------------------------------------------------------------------------ */
  /*                              SUBMIT HANDLER                              */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async () => {
    try {
      setError('');

      const validationError = validateForm();

      if (validationError) {
        setError(validationError);
        return;
      }

      setUploading(true);
      setUploadProgress(10);

      // ✅ NEW: اول عکس‌ها رو واقعاً آپلود کن و URL نهایی‌شون رو بگیر
      let uploadedImageUrls = [];
      if (images.length > 0) {
        uploadedImageUrls = await uploadImages(images.map((item) => item.file));
      }

      setUploadProgress(85);

      const productData = {
        ...formData,

        price: Number(formData.price) || 0,

        discount: Number(formData.discount) || 0,

        final_price: Number(formData.final_price) || Math.max(0, Number(formData.price || 0) - (Number(formData.price || 0) * Number(formData.discount || 0)) / 100),

        colors: parseCommaSeparated(formData.colors),

        best_for: parseCommaSeparated(formData.best_for),

        features: parseCommaSeparated(formData.features),

        specifications: buildSpecifications(),

        // ✅ NEW: دیگه فایل خام فرستاده نمیشه - URL واقعی که از سرور برگشته
        images: uploadedImageUrls,
        thumbnail: uploadedImageUrls[0] || null,
      };

      setUploadProgress(95);

      // ✅ CHANGED: onSave دیگه لازم نیست خودش آپلود کنه - فقط باید محصول رو
      // با این productData (که already شامل URL عکس‌هاست) بسازه، یعنی چیزی شبیه:
      //   await axiosInstance.post('/api/v1/admin/products', productData)
      if (onSave) {
        await onSave({
          productData,
          images: images.map((item) => item.file),
        });
      }

      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);

        resetForm();

        if (onClose) {
          onClose();
        }
      }, 400);
    } catch (error) {
      console.error('Error creating product:', error);

      setUploading(false);
      setUploadProgress(0);

      setError(error?.message || 'در هنگام ثبت محصول خطایی رخ داد.');
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                  STYLES                                  */
  /* ------------------------------------------------------------------------ */

  const inputSx = {
    minHeight: 46,
    px: 1.5,
    py: 0.5,
    borderRadius: 2,
    backgroundColor: palette.input,
    border: `1px solid ${palette.border}`,
    color: palette.text,
    fontSize: 14,
    transition: 'all 0.2s ease',

    '& input': {
      color: palette.text,
      padding: '10px 0',
      fontSize: 14,
    },

    '& textarea': {
      color: palette.text,
      padding: '10px 0',
      fontSize: 14,
    },

    '& input::placeholder': {
      color: isDark ? '#64748B' : '#9CA3AF',
      opacity: 1,
    },

    '& textarea::placeholder': {
      color: isDark ? '#64748B' : '#9CA3AF',
      opacity: 1,
    },

    '&:hover': {
      borderColor: alpha(palette.primary, 0.5),
    },

    '&:focus-within': {
      borderColor: palette.primary,
      boxShadow: `0 0 0 3px ${alpha(palette.primary, 0.12)}`,
    },

    '&.Mui-disabled': {
      opacity: 0.6,
    },
  };

  /* ------------------------------------------------------------------------ */
  /*                                    UI                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: palette.paper,
          borderRadius: 4,
          border: `1px solid ${palette.border}`,
          boxShadow: theme.shadows[24],
          outline: 'none',
          '&::-webkit-scrollbar': {
            width: 7,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(palette.primary, 0.4),
            borderRadius: 10,
          },
        }}>
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <Box sx={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, backgroundColor: palette.paper, borderBottom: `1px solid ${palette.border}` }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: palette.title }}>افزودن محصول جدید</Typography>

            <Typography sx={{ mt: 0.5, fontSize: 12, color: palette.text }}>اطلاعات محصول جدید را وارد کنید</Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            disabled={uploading}
            sx={{
              color: palette.text,
              borderRadius: 2,

              '&:hover': {
                backgroundColor: alpha(palette.primary, 0.08),
              },
            }}>
            <CloseCircle size={24} variant="Bold" />
          </IconButton>
        </Box>

        {/* ---------------------------------------------------------------- */}
        {/* CONTENT                                                          */}
        {/* ---------------------------------------------------------------- */}

        <Box sx={{ p: 3 }}>
          {/* BASIC INFORMATION */}

          <SectionTitle palette={palette}>اطلاعات اصلی محصول</SectionTitle>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="عنوان محصول" field="title" placeholder="مثلاً زین موتور سیکلت" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="زیرعنوان" field="subtitle" placeholder="توضیح کوتاه درباره محصول" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Field label="برند" field="brand" placeholder="نام برند" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Field label="دسته‌بندی" field="category" placeholder="مثلاً زین موتور" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Field label="دسته‌بندی فارسی" field="category_fa" placeholder="مثلاً زین موتور سیکلت" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="مدل" field="model" placeholder="مدل محصول" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="جنس" field="material" placeholder="مثلاً چرم مصنوعی" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
            </Grid>
          </Grid>

          {/* PRICING */}

          <Box sx={{ mt: 4 }}>
            <SectionTitle palette={palette}>اطلاعات قیمت</SectionTitle>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field label="قیمت اصلی" field="price" type="text" placeholder="980000" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Field label="درصد تخفیف" field="discount" type="text" placeholder="15" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Field label="قیمت نهایی" field="final_price" type="text" placeholder="833000" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
              </Grid>
            </Grid>
          </Box>

          {/* DESCRIPTION */}

          <Box sx={{ mt: 4 }}>
            <SectionTitle palette={palette}>توضیحات محصول</SectionTitle>

            <Field label="توضیحات" field="description" multiline rows={7} placeholder="توضیحات کامل محصول را وارد کنید..." formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />
          </Box>

          {/* FEATURES */}

          <Box sx={{ mt: 4 }}>
            <SectionTitle palette={palette}>ویژگی‌های محصول</SectionTitle>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field label="رنگ‌ها" field="colors" multiline rows={4} placeholder="مشکی، قرمز، آبی" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />

                <Typography sx={{ mt: 0.8, fontSize: 11, color: palette.text }}>موارد را با کاما جدا کنید.</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Field label="مناسب برای" field="best_for" multiline rows={4} placeholder="موتور شهری، موتور اسپرت" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />

                <Typography sx={{ mt: 0.8, fontSize: 11, color: palette.text }}>موارد را با کاما جدا کنید.</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Field label="ویژگی‌ها" field="features" multiline rows={4} placeholder="ضد آب، مقاوم، سبک" formData={formData} handleChange={handleChange} palette={palette} inputSx={inputSx} />

                <Typography sx={{ mt: 0.8, fontSize: 11, color: palette.text }}>موارد را با کاما جدا کنید.</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* SPECIFICATIONS */}

          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <SectionTitle palette={palette}>مشخصات فنی</SectionTitle>

              <Button variant="outlined" startIcon={<Add size={18} variant="Bold" />} onClick={addSpecification} disabled={uploading} sx={{ borderRadius: 2, fontSize: 12, fontWeight: 700 }}>
                افزودن مشخصه
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {specifications.map((spec) => (
                <Box key={spec.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <InputBase fullWidth value={spec.key ?? ''} onChange={(event) => updateSpecification(spec.id, 'key', event.target.value)} placeholder="عنوان مشخصه" disabled={uploading} sx={inputSx} />

                  <InputBase fullWidth value={spec.value ?? ''} onChange={(event) => updateSpecification(spec.id, 'value', event.target.value)} placeholder="مقدار" disabled={uploading} sx={inputSx} />

                  <IconButton
                    onClick={() => removeSpecification(spec.id)}
                    disabled={specifications.length === 1 || uploading}
                    sx={{
                      flexShrink: 0,
                      color: '#EF4444',

                      '&:hover': {
                        backgroundColor: 'rgba(239,68,68,0.08)',
                      },

                      '&.Mui-disabled': {
                        opacity: 0.3,
                      },
                    }}>
                    <Trash size={20} variant="Bold" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          {/* IMAGES */}

          <Box sx={{ mt: 4 }}>
            <SectionTitle palette={palette}>تصاویر محصول</SectionTitle>

            <Box sx={{ border: `1px dashed ${palette.border}`, borderRadius: 3, p: 3 }}>
              <input id="product-images" type="file" multiple accept="image/*" hidden onChange={handleImageChange} disabled={uploading} />

              <label htmlFor="product-images">
                <Box
                  sx={{
                    cursor: uploading ? 'not-allowed' : 'pointer',

                    minHeight: 150,

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',

                    borderRadius: 3,

                    backgroundColor: alpha(palette.primary, 0.04),

                    transition: 'all 0.2s ease',

                    '&:hover': {
                      backgroundColor: alpha(palette.primary, 0.08),
                    },
                  }}>
                  <DocumentUpload size={42} variant="Bold" color={palette.primary} />

                  <Typography sx={{ mt: 1.5, fontSize: 14, fontWeight: 800, color: palette.title }}>انتخاب تصاویر محصول</Typography>

                  <Typography sx={{ mt: 0.5, fontSize: 11, color: palette.text }}>می‌توانید چند تصویر انتخاب کنید</Typography>
                </Box>
              </label>

              {images.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {images.map((image) => (
                    <Grid
                      key={image.id}
                      size={{
                        xs: 6,
                        sm: 4,
                        md: 3,
                      }}>
                      <Box sx={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 2, border: `1px solid ${palette.border}` }}>
                        <Box component="img" src={image.preview} alt={image.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                        <IconButton
                          onClick={() => removeImage(image.id)}
                          disabled={uploading}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,

                            width: 32,
                            height: 32,

                            backgroundColor: 'rgba(0,0,0,0.6)',

                            color: '#FFFFFF',

                            '&:hover': {
                              backgroundColor: 'rgba(239,68,68,0.9)',
                            },
                          }}>
                          <Trash size={16} variant="Bold" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>

          {/* ERROR */}

          {error && (
            <Box sx={{ mt: 3, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Typography sx={{ color: '#EF4444', fontSize: 13, fontWeight: 700 }}>{error}</Typography>
            </Box>
          )}

          {/* PROGRESS */}

          {uploading && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: 12, color: palette.text }}>در حال ذخیره محصول...</Typography>

                <Typography sx={{ fontSize: 12, fontWeight: 800, color: palette.primary }}>{uploadProgress}%</Typography>
              </Box>

              <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 6, borderRadius: 10 }} />
            </Box>
          )}
        </Box>

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 20,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',

            gap: 1.5,

            px: 3,
            py: 2,

            backgroundColor: palette.paper,

            borderTop: `1px solid ${palette.border}`,
          }}>
          <Button variant="outlined" onClick={handleClose} disabled={uploading} sx={{ minWidth: 120, height: 44, borderRadius: 2, fontWeight: 700 }}>
            انصراف
          </Button>

          <Button variant="contained" onClick={handleSubmit} disabled={uploading} startIcon={<TickCircle size={19} variant="Bold" />} sx={{ minWidth: 150, height: 44, borderRadius: 2, fontWeight: 800 }}>
            {uploading ? 'در حال ذخیره...' : 'ثبت محصول'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewProductModal;
