'use client';

import React, { useState } from 'react';

import { Modal, Box, Typography, Button, Grid, InputLabel, InputAdornment, InputBase, IconButton, useTheme, alpha, Chip, LinearProgress } from '@mui/material';

import { Add, CloseCircle, Box1, Tag2, Money2, Archive, DocumentText, InfoCircle, Gallery, Trash, Star1, TickCircle } from 'iconsax-reactjs';

const ACCENT = '#F57C1F';

const API_URL = process.env.BASE_URL || 'https://sharifzin.ir/api/v1';

export default function NewProductModal({ open, onClose, onSave }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // =========================================================
  // FORM
  // =========================================================

  const [formData, setFormData] = useState({ title: '', subtitle: '', brand: '', category: '', category_fa: '', model: '', price: '', discount: '', final_price: '', material: '', description: '', colors: '', best_for: '', features: '' });

  // =========================================================
  // IMAGES
  // =========================================================

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadedImages, setUploadedImages] = useState([]);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  // =========================================================
  // SPECIFICATIONS
  // =========================================================

  const [specifications, setSpecifications] = useState([{ id: Date.now(), key: '', value: '', type: 'text' }]);

  // =========================================================
  // COLORS
  // =========================================================

  const palette = { background: isDark ? '#111827' : '#F8FAFC', card: isDark ? '#182131' : '#FFFFFF', input: isDark ? '#111827' : '#F8FAFC', border: isDark ? '#273449' : '#E5E7EB', text: isDark ? '#F1F5F9' : '#172033', muted: isDark ? '#94A3B8' : '#64748B', label: isDark ? '#CBD5E1' : '#475569' };

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type));

    const limitedFiles = validFiles.slice(0, 10);

    setSelectedFiles(limitedFiles);

    const previews = limitedFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));

    setPreviewImages(previews);

    setUploadedImages([]);

    setThumbnailIndex(0);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);

    const newPreviews = previewImages.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);

    if (thumbnailIndex >= newPreviews.length) {
      setThumbnailIndex(Math.max(0, newPreviews.length - 1));
    }
  };

  // =========================================================
  // UPLOAD
  // =========================================================

  const uploadImages = async () => {
    if (!selectedFiles.length) {
      return [];
    }

    setUploading(true);
    setUploadProgress(0);

    const formDataUpload = new FormData();

    selectedFiles.forEach((file) => {
      formDataUpload.append('attachments', file);
    });

    try {
      const response = await fetch(`${API_URL}/admin/products/upload-images`, { method: 'POST', body: formDataUpload });

      if (!response.ok) {
        throw new Error('خطا در آپلود تصاویر');
      }

      const result = await response.json();

      setUploadProgress(100);

      setUploadedImages(result.images || []);

      return result.images || [];
    } catch (error) {
      console.error(error);

      alert('آپلود تصاویر با خطا مواجه شد');

      return [];
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // SPECIFICATIONS
  // =========================================================

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { id: Date.now(), key: '', value: '', type: 'text' }]);
  };

  const removeSpecification = (id) => {
    setSpecifications((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSpecification = (id, field, value) => {
    setSpecifications((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // =========================================================
  // BUILD SPECIFICATIONS JSON
  // =========================================================

  const buildSpecifications = () => {
    const result = {};

    specifications.forEach((item) => {
      const key = item.key.trim();

      if (!key) return;

      let value = item.value;

      if (item.type === 'boolean') {
        value = value === true || value === 'true';
      }

      if (item.type === 'number') {
        value = Number(value);
      }

      result[key] = value;
    });

    return result;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    try {
      // -----------------------------
      // Upload images
      // -----------------------------

      let images = uploadedImages;

      if (selectedFiles.length && !uploadedImages.length) {
        images = await uploadImages();
      }

      if (selectedFiles.length && !images.length) {
        return;
      }

      // -----------------------------
      // Arrays
      // -----------------------------

      const colors = formData.colors
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const bestFor = formData.best_for
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const features = formData.features
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      // -----------------------------
      // Thumbnail
      // -----------------------------

      const thumbnail = images.length ? images[thumbnailIndex] || images[0] : null;

      // -----------------------------
      // Final Data
      // -----------------------------

      const data = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        brand: formData.brand.trim(),
        category: formData.category.trim(),
        category_fa: formData.category_fa.trim(),
        model: formData.model.trim(),
        price: Number(formData.price) || 0,
        discount: Number(formData.discount) || 0,
        final_price: Number(formData.final_price) || 0,
        thumbnail,
        images,
        colors,
        material: formData.material.trim(),
        best_for: bestFor,
        description: formData.description.trim(),
        features,
        specifications: buildSpecifications(),
      };

      onSave(data);
    } catch (error) {
      console.error(error);

      alert('خطایی هنگام ذخیره محصول رخ داد');
    }
  };

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputSx = {
    width: '100%',
    minHeight: 48,
    px: 1.7,
    borderRadius: '12px',
    backgroundColor: palette.input,
    border: `1px solid ${palette.border}`,
    color: palette.text,
    transition: 'all .2s ease',
    '& input': {
      color: palette.text,
      fontSize: 14,
      fontWeight: 500,
      textAlign: 'right',
    },

    '& textarea': {
      color: palette.text,
      fontSize: 14,
      fontWeight: 500,
      textAlign: 'right',
      lineHeight: 1.8,
    },

    '&:hover': {
      borderColor: alpha(ACCENT, 0.5),
    },

    '&:focus-within': {
      borderColor: ACCENT,
      boxShadow: `0 0 0 3px ${alpha(ACCENT, 0.1)}`,
      backgroundColor: isDark ? '#151E2D' : '#FFFFFF',
    },

    '& input::placeholder, & textarea::placeholder': {
      color: palette.muted,
      opacity: 0.7,
    },
  };

  // =========================================================
  // FIELD
  // =========================================================

  const Field = ({ label, field, placeholder, type = 'text', multiline = false, rows = 4, endAdornment }) => (
    <Box>
      <InputLabel sx={{ mb: 1, color: palette.label, fontSize: 13, fontWeight: 700 }}>{label}</InputLabel>

      <InputBase fullWidth type={type} multiline={multiline} rows={multiline ? rows : undefined} value={formData[field]} onChange={handleChange(field)} placeholder={placeholder} endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined} sx={inputSx} />
    </Box>
  );

  // =========================================================
  // SECTION
  // =========================================================

  const SectionTitle = ({ icon, title, description }) => (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: alpha(ACCENT, 0.1), color: ACCENT }}>{icon}</Box>

        <Typography sx={{ fontSize: 16, fontWeight: 800, color: palette.text }}>{title}</Typography>
      </Box>

      {description && <Typography sx={{ mr: 5.5, fontSize: 12, color: palette.muted }}>{description}</Typography>}
    </Box>
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box dir="rtl" sx={{ width: '100%', maxWidth: 1150, maxHeight: '94vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: palette.background, borderRadius: '20px', border: `1px solid ${palette.border}`, boxShadow: isDark ? '0 30px 80px rgba(0,0,0,.5)' : '0 30px 80px rgba(15,23,42,.16)', outline: 'none' }}>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: 2.5, backgroundColor: palette.card, borderBottom: `1px solid ${palette.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT, color: '#fff', boxShadow: `0 8px 20px ${alpha(ACCENT, 0.25)}` }}>
              <Add size={24} variant="Bold" />
            </Box>

            <Box>
              <Typography sx={{ fontSize: { xs: 18, md: 21 }, fontWeight: 800, color: palette.text }}>افزودن محصول جدید</Typography>
              <Typography sx={{ fontSize: 12, color: palette.muted }}>اطلاعات، تصاویر و مشخصات محصول</Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose} sx={{ width: 40, height: 40, color: palette.muted, border: `1px solid ${palette.border}`, borderRadius: '10px', '&:hover': { color: '#EF4444', backgroundColor: alpha('#EF4444', 0.08) } }}>
            <CloseCircle size={21} />
          </IconButton>
        </Box>

        {/* =====================================================
            BODY
        ====================================================== */}

        <Box sx={{ overflowY: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 3, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? '#334155' : '#CBD5E1', borderRadius: 10 } }}>
          <Grid container spacing={3}>
            {/* =================================================
                IMAGES
            ================================================== */}

            <Grid size={12}>
              <Box sx={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, borderRadius: '16px', p: { xs: 2, md: 2.8 } }}>
                <SectionTitle icon={<Gallery size={20} />} title="تصاویر محصول" description="حداکثر ۱۰ تصویر — فرمت نهایی همه تصاویر WebP خواهد بود" />

                {/* Upload Box */}

                <input id="product-images" type="file" hidden multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageSelect} />

                {!previewImages.length ? (
                  <label htmlFor="product-images">
                    <Box sx={{ minHeight: 180, border: `2px dashed ${alpha(ACCENT, 0.35)}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: alpha(ACCENT, 0.025), transition: 'all .2s ease', '&:hover': { backgroundColor: alpha(ACCENT, 0.06), borderColor: ACCENT } }}>
                      <Box sx={{ width: 55, height: 55, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: alpha(ACCENT, 0.1), color: ACCENT, mb: 1.5 }}>
                        <Gallery size={27} />
                      </Box>

                      <Typography sx={{ fontWeight: 800, color: palette.text, fontSize: 14 }}>انتخاب تصاویر محصول</Typography>
                      <Typography sx={{ mt: 0.5, fontSize: 12, color: palette.muted }}>JPG، PNG یا WebP — حداکثر ۱۰MB برای هر عکس</Typography>
                    </Box>
                  </label>
                ) : (
                  <Box>
                    <Grid container spacing={2}>
                      {previewImages.map((image, index) => (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={image.url}>
                          <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: '14px', overflow: 'hidden', border: index === thumbnailIndex ? `3px solid ${ACCENT}` : `1px solid ${palette.border}` }}>
                            <Box component="img" src={image.url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                            {index === thumbnailIndex && (
                              <Box sx={{ position: 'absolute', top: 8, right: 8, background: ACCENT, color: '#fff', borderRadius: '7px', px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 10, fontWeight: 800 }}>
                                <Star1 size={12} variant="Bold" />
                                اصلی
                              </Box>
                            )}

                            <IconButton onClick={() => removeImage(index)} sx={{ position: 'absolute', top: 7, left: 7, width: 30, height: 30, background: 'rgba(0,0,0,.55)', color: '#fff', '&:hover': { background: '#EF4444' } }}>
                              <Trash size={15} />
                            </IconButton>

                            {index !== thumbnailIndex && (
                              <Button onClick={() => setThumbnailIndex(index)} size="small" sx={{ position: 'absolute', bottom: 7, right: 7, left: 7, background: 'rgba(0,0,0,.65)', color: '#fff', fontSize: 10, borderRadius: '7px', '&:hover': { background: ACCENT } }}>
                                انتخاب به عنوان اصلی
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      ))}

                      {previewImages.length < 10 && (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                          <label htmlFor="product-images">
                            <Box sx={{ aspectRatio: '1 / 1', border: `2px dashed ${palette.border}`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: palette.muted, '&:hover': { borderColor: ACCENT, color: ACCENT } }}>
                              <Add size={25} />

                              <Typography sx={{ mt: 0.5, fontSize: 11, fontWeight: 700 }}>افزودن عکس</Typography>
                            </Box>
                          </label>
                        </Grid>
                      )}
                    </Grid>

                    {uploading && (
                      <Box sx={{ mt: 2 }}>
                        <Typography sx={{ fontSize: 11, color: palette.muted, mb: 0.7 }}>در حال آپلود و تبدیل تصاویر به WebP...</Typography>

                        <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 6, borderRadius: 10, '& .MuiLinearProgress-bar': { backgroundColor: ACCENT } }} />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* =================================================
                BASIC INFO
            ================================================== */}

            <Grid size={12}>
              <Box sx={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, borderRadius: '16px', p: { xs: 2, md: 2.8 } }}>
                <SectionTitle icon={<Box1 size={20} />} title="اطلاعات اصلی" description="اطلاعات پایه محصول" />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="عنوان محصول" field="title" placeholder="زین طبی هوندا CG125" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="زیرعنوان" field="subtitle" placeholder="روکش چرم دوخت لوزی" />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Field label="برند" field="brand" placeholder="Honda" />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Field label="مدل" field="model" placeholder="CG125" />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Field label="دسته‌بندی" field="category" placeholder="classic-seat" />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Field label="دسته‌بندی فارسی" field="category_fa" placeholder="زین کلاسیک" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="جنس / مواد" field="material" placeholder="چرم مصنوعی درجه یک" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="مناسب برای" field="best_for" placeholder="راحتی ستون فقرات، استفاده روزانه" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* =================================================
                PRICE
            ================================================== */}

            <Grid size={12}>
              <Box sx={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, borderRadius: '16px', p: { xs: 2, md: 2.8 } }}>
                <SectionTitle icon={<Money2 size={20} />} title="قیمت‌گذاری" description="قیمت اصلی، تخفیف و قیمت نهایی" />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field label="قیمت اصلی" field="price" type="number" placeholder="980000" endAdornment={<Typography sx={{ fontSize: 11, color: palette.muted }}>تومان</Typography>} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field label="درصد تخفیف" field="discount" type="number" placeholder="15" endAdornment={<Typography sx={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>%</Typography>} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field label="قیمت نهایی" field="final_price" type="number" placeholder="833000" endAdornment={<Typography sx={{ fontSize: 11, color: palette.muted }}>تومان</Typography>} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* =================================================
                COLORS / FEATURES
            ================================================== */}

            <Grid size={12}>
              <Box sx={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, borderRadius: '16px', p: { xs: 2, md: 2.8 } }}>
                <SectionTitle icon={<Tag2 size={20} />} title="ویژگی‌ها" description="رنگ‌ها، ویژگی‌ها و کاربرد محصول" />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field label="رنگ‌ها" field="colors" multiline rows={4} placeholder="مشکی، سفید، قهوه‌ای" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field label="مناسب برای" field="best_for" multiline rows={4} placeholder="راحتی ستون فقرات، استفاده روزانه" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Field label="ویژگی‌ها" field="features" multiline rows={4} placeholder="فوم سرد طبی، دوخت CNC، روکش ضد آب..." />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <Grid size={12}>
              <Box sx={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, borderRadius: '16px', p: { xs: 2, md: 2.8 } }}>
                <SectionTitle icon={<DocumentText size={20} />} title="توضیحات محصول" description="توضیحات کامل محصول" />

                <Field label="توضیحات" field="description" multiline rows={7} placeholder="زین طبی مناسب هوندا CG125 با فوم سرد، دوخت صنعتی و روکش ضدآب..." />
              </Box>
            </Grid>

            {/* =================================================
                SPECIFICATIONS
            ================================================== */}

            <Grid size={12}>
              <Box sx={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, borderRadius: '16px', p: { xs: 2, md: 2.8 } }}>
                <SectionTitle icon={<InfoCircle size={20} />} title="مشخصات فنی" description="مشخصات را به صورت ساده وارد کنید؛ سیستم خودش JSON می‌سازد" />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {specifications.map((spec) => (
                    <Grid container spacing={1.5} key={spec.id}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <InputBase fullWidth value={spec.key} onChange={(e) => updateSpecification(spec.id, 'key', e.target.value)} placeholder="نام مشخصات، مثال: وزن" sx={inputSx} />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <InputBase fullWidth value={spec.value} onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)} placeholder="مثال: 2.4kg" sx={inputSx} />
                      </Grid>

                      <Grid size={{ xs: 10, md: 3 }}>
                        <Box component="select" value={spec.type} onChange={(e) => updateSpecification(spec.id, 'type', e.target.value)} sx={{ width: '100%', height: 48, px: 1.5, borderRadius: '12px', border: `1px solid ${palette.border}`, background: palette.input, color: palette.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                          <option value="text">متن</option>

                          <option value="number">عدد</option>

                          <option value="boolean">بله / خیر</option>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 2, md: 1 }}>
                        <IconButton onClick={() => removeSpecification(spec.id)} sx={{ width: 48, height: 48, color: '#EF4444', border: `1px solid ${alpha('#EF4444', 0.2)}`, borderRadius: '12px', '&:hover': { background: alpha('#EF4444', 0.08) } }}>
                          <Trash size={18} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Box>

                <Button onClick={addSpecification} startIcon={<Add size={17} />} sx={{ mt: 2, color: ACCENT, fontWeight: 800, borderRadius: '10px', '&:hover': { background: alpha(ACCENT, 0.08) } }}>
                  افزودن مشخصات
                </Button>

                {/* Preview */}

                {Object.keys(buildSpecifications()).length > 0 && (
                  <Box sx={{ mt: 2, p: 2, borderRadius: '12px', background: isDark ? '#101827' : '#F8FAFC', border: `1px solid ${palette.border}` }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: palette.muted, mb: 1 }}>پیش‌نمایش اطلاعات ذخیره‌شده</Typography>

                    <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', direction: 'ltr', textAlign: 'left', fontSize: 12, color: palette.text, fontFamily: 'monospace' }}>
                      {JSON.stringify(buildSpecifications(), null, 2)}
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <Box sx={{ px: { xs: 2, md: 3.5 }, py: 2, backgroundColor: palette.card, borderTop: `1px solid ${palette.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexShrink: 0 }}>
          <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 12, color: palette.muted }}>{uploadedImages.length ? `${uploadedImages.length} تصویر آماده ذخیره است` : 'تصاویر محصول را انتخاب کنید'}</Typography>

          <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
            <Button onClick={onClose} sx={{ minWidth: { xs: 0, sm: 110 }, flex: { xs: 1, sm: 'unset' }, height: 44, borderRadius: '11px', color: palette.muted, fontWeight: 700, border: `1px solid ${palette.border}` }}>
              لغو
            </Button>

            <Button onClick={handleSubmit} variant="contained" startIcon={<TickCircle size={18} />} disabled={uploading} sx={{ minWidth: { xs: 0, sm: 160 }, flex: { xs: 1, sm: 'unset' }, height: 44, borderRadius: '11px', backgroundColor: ACCENT, color: '#fff', fontWeight: 800, boxShadow: `0 7px 18px ${alpha(ACCENT, 0.25)}`, '&:hover': { backgroundColor: '#E86F14' } }}>
              {uploading ? 'در حال آپلود...' : 'ذخیره محصول'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
