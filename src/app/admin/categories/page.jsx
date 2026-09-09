'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, TextField, IconButton, Grid, alpha, CircularProgress } from '@mui/material';

import { Add, Edit2, Trash, Category, CloseCircle, TickCircle, Danger } from 'iconsax-reactjs';

import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';
import axiosInstance from '@/utils/API/axiosInstance';
import Customdialog from '@/components/custom/CustomDialog';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';

const ACCENT_ORANGE = '#F57C1F';
const RED = '#E53E3E';
const GREEN = '#38A169';

const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = {
  background: SURFACE,
  borderRadius: '22px',
  boxShadow: `
    8px 8px 18px ${SHADOW_DARK},
    -8px -8px 18px ${SHADOW_LIGHT}
  `,
};

const neoSoft = {
  background: SURFACE,
  borderRadius: '16px',
  boxShadow: `
    5px 5px 12px ${SHADOW_DARK},
    -5px -5px 12px ${SHADOW_LIGHT}
  `,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: SURFACE,
    color: INK,
    fontSize: 14,
    '& fieldset': { border: 'none' },
    boxShadow: `inset 3px 3px 7px ${SHADOW_DARK},inset -3px -3px 7px ${SHADOW_LIGHT}`,
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: `1px solid ${alpha(ACCENT_ORANGE, 0.35)}` },
  },
  '& .MuiInputLabel-root': { color: INK_SOFT, fontSize: 14 },
  '& .MuiInputLabel-root.Mui-focused': { color: ACCENT_ORANGE },
};

/* =========================================================
   MODAL HEADER
========================================================= */

function ModalHeader({ icon, title, subtitle, onClose }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
      <Stack direction="row" gap={1.5} alignItems="center">
        <Box sx={{ width: 48, height: 48, borderRadius: '15px', bgcolor: alpha(ACCENT_ORANGE, 0.1), color: ACCENT_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: INK }}>{title}</Typography>
          <Typography sx={{ mt: 0.4, fontSize: 13, color: INK_SOFT }}>{subtitle}</Typography>
        </Box>
      </Stack>

      <IconButton onClick={onClose} sx={{ width: 38, height: 38, color: INK_SOFT, '&:hover': { color: INK, bgcolor: alpha(INK, 0.04) } }}>
        <CloseCircle size={22} />
      </IconButton>
    </Stack>
  );
}

/* =========================================================
   MODAL ACTIONS
========================================================= */

function ModalActions({ onCancel, submitText, submitColor = ACCENT_ORANGE, loading = false, danger = false }) {
  return (
    <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 3 }}>
      <Button onClick={onCancel} disabled={loading} sx={{ minWidth: 100, px: 2, py: 1.1, borderRadius: '12px', color: INK_SOFT, fontWeight: 600, fontSize: 13, '&:hover': { bgcolor: alpha(INK, 0.04) } }}>
        انصراف
      </Button>

      <Button type="submit" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <TickCircle size={17} />} sx={{ minWidth: 125, px: 2.2, py: 1.1, borderRadius: '12px', color: '#fff', bgcolor: submitColor, fontWeight: 700, fontSize: 13, boxShadow: `4px 4px 12px ${alpha(submitColor, 0.28)}`, '&:hover': { bgcolor: danger ? '#C53030' : '#E06B10' } }}>
        {loading ? 'در حال انجام...' : submitText}
      </Button>
    </Stack>
  );
}

/* =========================================================
   CREATE CATEGORY
========================================================= */

function CreateCategoryForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ name_fa: '', name: '', description_fa: '', color: ACCENT_ORANGE });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name_fa.trim()) return;

    try {
      setLoading(true);

      await onSubmit({ name_fa: form.name_fa.trim(), name: form.name.trim(), description_fa: form.description_fa.trim(), color: form.color });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} dir="rtl" sx={{ p: { xs: 1, sm: 1.5 } }}>
      <ModalHeader icon={<Add size={23} variant="Bold" />} title="افزودن دسته‌بندی" subtitle="یک دسته‌بندی جدید به فروشگاه اضافه کنید" onClose={onClose} />

      <Stack gap={2.2}>
        <TextField fullWidth label="نام فارسی" name="name_fa" value={form.name_fa} onChange={handleChange} placeholder="مثلاً زین کلاسیک" required sx={inputSx} />

        <TextField fullWidth label="نام انگلیسی" name="name" value={form.name} onChange={handleChange} placeholder="مثلاً classic-seat" sx={inputSx} />

        <TextField fullWidth multiline minRows={3} label="توضیحات" name="description_fa" value={form.description_fa} onChange={handleChange} placeholder="توضیح کوتاهی درباره این دسته‌بندی..." sx={inputSx} />

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>رنگ دسته‌بندی</Typography>

          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box component="input" type="color" name="color" value={form.color} onChange={handleChange} sx={{ width: 48, height: 48, p: 0.5, border: 'none', borderRadius: '12px', background: SURFACE, cursor: 'pointer', boxShadow: `3px 3px 8px ${SHADOW_DARK},-3px -3px 8px ${SHADOW_LIGHT}` }} />

            <Typography sx={{ fontSize: 13, color: INK_SOFT, direction: 'ltr' }}>{form.color}</Typography>
          </Stack>
        </Box>
      </Stack>

      <ModalActions onCancel={onClose} submitText="افزودن دسته‌بندی" loading={loading} />
    </Box>
  );
}

/* =========================================================
   EDIT CATEGORY
========================================================= */

function EditCategoryForm({ category, onSubmit, onClose }) {
  const [form, setForm] = useState({ name_fa: category?.name_fa || '', name: category?.name || '', description_fa: category?.description_fa || '', color: category?.color || ACCENT_ORANGE });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;

    setForm({
      name_fa: category.name_fa || '',
      name: category.name || '',
      description_fa: category.description_fa || '',
      color: category.color || ACCENT_ORANGE,
    });
  }, [category]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name_fa.trim()) return;

    try {
      setLoading(true);

      await onSubmit(category.id, {
        name_fa: form.name_fa.trim(),
        name: form.name.trim(),
        description_fa: form.description_fa.trim(),
        color: form.color,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} dir="rtl" sx={{ p: { xs: 1, sm: 1.5 } }}>
      <ModalHeader icon={<Edit2 size={21} variant="Bold" />} title="ویرایش دسته‌بندی" subtitle="اطلاعات دسته‌بندی را ویرایش کنید" onClose={onClose} />

      <Stack gap={2.2}>
        <TextField fullWidth label="نام فارسی" name="name_fa" value={form.name_fa} onChange={handleChange} required sx={inputSx} />

        <TextField fullWidth label="نام انگلیسی" name="name" value={form.name} onChange={handleChange} sx={inputSx} />

        <TextField fullWidth multiline minRows={3} label="توضیحات" name="description_fa" value={form.description_fa} onChange={handleChange} sx={inputSx} />

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK, mb: 1 }}>رنگ دسته‌بندی</Typography>

          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box component="input" type="color" name="color" value={form.color} onChange={handleChange} sx={{ width: 48, height: 48, p: 0.5, border: 'none', borderRadius: '12px', background: SURFACE, cursor: 'pointer', boxShadow: `3px 3px 8px ${SHADOW_DARK},-3px -3px 8px ${SHADOW_LIGHT}` }} />

            <Typography sx={{ fontSize: 13, color: INK_SOFT, direction: 'ltr' }}>{form.color}</Typography>
          </Stack>
        </Box>
      </Stack>

      <ModalActions onCancel={onClose} submitText="ذخیره تغییرات" loading={loading} />
    </Box>
  );
}

/* =========================================================
   DELETE CATEGORY
========================================================= */

function DeleteCategoryForm({ category, onSubmit, onClose }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      await onSubmit(category.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box dir="rtl" sx={{ p: { xs: 1, sm: 1.5 } }}>
      <ModalHeader icon={<Danger size={23} variant="Bold" />} title="حذف دسته‌بندی" subtitle="این عملیات قابل بازگشت نیست" onClose={onClose} />

      <Box sx={{ ...neoSoft, p: 2.2, mb: 2 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: '13px', bgcolor: alpha(category?.color || RED, 0.12), color: category?.color || RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Category size={21} variant="Bold" />
          </Box>

          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: INK }}>{category?.name_fa}</Typography>

            {category?.name && <Typography sx={{ mt: 0.3, fontSize: 12, color: INK_SOFT, direction: 'ltr', textAlign: 'right' }}>{category.name}</Typography>}
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderRadius: '14px', bgcolor: alpha(RED, 0.07), border: `1px solid ${alpha(RED, 0.12)}` }}>
        <Typography sx={{ fontSize: 13, lineHeight: 1.9, color: INK }}>
          آیا از حذف این دسته‌بندی مطمئن هستید؟
          <br />
          <strong>تمام اطلاعات مرتبط با این دسته‌بندی ممکن است تحت تأثیر قرار بگیرد.</strong>
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: 100, px: 2, py: 1.1, borderRadius: '12px', color: INK_SOFT, fontWeight: 600, fontSize: 13 }}>
          انصراف
        </Button>

        <Button onClick={handleDelete} disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Trash size={17} />} sx={{ minWidth: 125, px: 2.2, py: 1.1, borderRadius: '12px', color: '#fff', bgcolor: RED, fontWeight: 700, fontSize: 13, boxShadow: `4px 4px 12px ${alpha(RED, 0.25)}`, '&:hover': { bgcolor: '#C53030' } }}>
          {loading ? 'در حال حذف...' : 'حذف دسته‌بندی'}
        </Button>
      </Stack>
    </Box>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);

  const [openModal, setOpenModal] = useState({ open: false, mode: '', categoryId: null });

  async function fetchCategories() {
    try {
      const res = await axiosInstance.get('/api/v1/admin/categories');

      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  function closeModal() {
    setOpenModal({ open: false, mode: '', categoryId: null });
  }

  function openCategoryModal(categoryId, mode) {
    setOpenModal({ open: true, mode, categoryId });
  }

  async function handleActionCategory(categoryId, payload) {
    try {
      if (openModal.mode === 'create') {
        await axiosInstance.post('/api/v1/admin/categories', categoryId);
      }

      if (openModal.mode === 'edit') {
        await axiosInstance.patch(`/api/v1/admin/categories/${categoryId}`, payload);
      }

      if (openModal.mode === 'delete') {
        await axiosInstance.delete(`/api/v1/admin/categories/${categoryId}`);
      }

      await fetchCategories();

      closeModal();
    } catch (error) {
      console.error('Error handling category action:', error);

      throw error;
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const selectedCategory = categories.find((cat) => cat.id === openModal.categoryId);

  return (
    <AdminLayout>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>مدیریت دسته‌بندی‌ها</Typography>
          <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(categories.length)} دسته‌بندی</Typography>
        </Box>

        <Button onClick={() => openCategoryModal(null, 'create')} startIcon={<Add size={18} style={{ marginLeft: 4 }} />} sx={{ px: 2.5, py: 1.2, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' } }}>
          افزودن دسته‌بندی
        </Button>
      </Stack>

      {/* =====================================================
          CATEGORY GRID
      ====================================================== */}

      <Grid container spacing={2.5}>
        {categories.map((cat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
            <Box sx={{ ...neoRaised, p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" gap={1.5} alignItems="center">
                  <Box sx={{ width: 46, height: 46, borderRadius: '14px', bgcolor: alpha(cat.color, 0.12), color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Category size={22} variant="Bold" />
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>{cat.name_fa}</Typography>

                    <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.3 }}>{cat.description_fa}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <IconButton size="small" onClick={() => openCategoryModal(cat.id, 'edit')}>
                    <Edit2 size={16} color={ACCENT_ORANGE} />
                  </IconButton>

                  <IconButton size="small" onClick={() => openCategoryModal(cat.id, 'delete')}>
                    <Trash size={16} color={RED} />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* =====================================================
          MODALS
      ====================================================== */}

      <Customdialog open={openModal.open} onClose={closeModal}>
        {openModal.mode === 'create' && <CreateCategoryForm onSubmit={(payload) => handleActionCategory(payload, null)} onClose={closeModal} />}

        {openModal.mode === 'edit' && selectedCategory && <EditCategoryForm category={selectedCategory} onSubmit={handleActionCategory} onClose={closeModal} />}

        {openModal.mode === 'delete' && selectedCategory && <DeleteCategoryForm category={selectedCategory} onSubmit={handleActionCategory} onClose={closeModal} />}
      </Customdialog>
    </AdminLayout>
  );
}
