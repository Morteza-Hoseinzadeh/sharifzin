'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, Modal, Grid, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, SearchNormal1, Edit2, Trash, Eye, Box1, Filter } from 'iconsax-reactjs';
import Link from 'next/link';
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

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };
const neoInset = { background: SURFACE, borderRadius: '12px', boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}` };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('view'); // view / edit / create
  const [formData, setFormData] = useState({});
  // raw text for the specifications JSON textarea, kept separate from the
  // parsed formData.specifications so invalid/in-progress JSON doesn't crash the form
  const [specsText, setSpecsText] = useState('{}');
  const [specsError, setSpecsError] = useState(false);

  const [openNewModal, setOpenNewModal] = useState(false);

  const handleNewProduct = (data) => {
    console.log('New Product:', data);
    setOpenNewModal(false);
  };

  // فیلتر
  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    return p.title?.toLowerCase().includes(term) || p.category_fa?.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term) || p.model?.toLowerCase().includes(term);
  });

  // بارگذاری محصولات
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/api/v1/admin/products');
        setProducts(data?.data || []);
      } catch (err) {
        console.error('خطا در دریافت محصولات:', err);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, []);

  // تنظیم فرم وقتی محصول انتخاب شد
  useEffect(() => {
    if (selectedProduct) {
      const specs = selectedProduct.specifications || {};
      setFormData({
        id: selectedProduct.id,
        title: selectedProduct.title || '',
        subtitle: selectedProduct.subtitle || '',
        brand: selectedProduct.brand || '',
        category: selectedProduct.category || '',
        category_fa: selectedProduct.category_fa || '',
        model: selectedProduct.model || '',
        price: selectedProduct.price || 0,
        discount: selectedProduct.discount || 0,
        final_price: selectedProduct.final_price || selectedProduct.price || 0,
        stock: selectedProduct.stock || 0,
        sold: selectedProduct.sold || 0,
        thumbnail: selectedProduct.thumbnail || '',
        images: Array.isArray(selectedProduct.images) ? selectedProduct.images : [selectedProduct.thumbnail || ''],
        colors: Array.isArray(selectedProduct.colors) ? selectedProduct.colors : [],
        material: selectedProduct.material || '',
        best_for: selectedProduct.best_for || '',
        description: selectedProduct.description || '',
        features: Array.isArray(selectedProduct.features) ? selectedProduct.features : [],
        specifications: specs,
      });
      setSpecsText(JSON.stringify(specs, null, 2));
      setSpecsError(false);
    }
  }, [selectedProduct]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setMode('view');
    setFormData({});
    setSpecsText('{}');
    setSpecsError(false);
  };

  const openModal = (mode, product = null) => {
    setMode(mode);
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleSpecsChange = (value) => {
    setSpecsText(value);
    try {
      const parsed = JSON.parse(value);
      setFormData((prev) => ({ ...prev, specifications: parsed }));
      setSpecsError(false);
    } catch {
      // leave formData.specifications untouched until the JSON is valid again
      setSpecsError(true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
    try {
      await axiosInstance.delete(`/api/v1/admin/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert('محصول با موفقیت حذف شد');
    } catch (err) {
      console.error(err);
      alert('حذف محصول با مشکل مواجه شد');
    }
  };

  const handleSave = async () => {
    if (specsError) {
      alert('فرمت JSON مشخصات معتبر نیست');
      return;
    }
    try {
      if (mode === 'create') {
        await axiosInstance.post('/api/v1/admin/products', formData);
        alert('محصول جدید با موفقیت اضافه شد');
      } else if (mode === 'edit') {
        await axiosInstance.put(`/api/v1/admin/products/${formData.id}`, formData);
        alert('محصول با موفقیت ویرایش شد');
      }
      handleCloseModal();
      // رفرش محصولات
      const { data } = await axiosInstance.get('/api/v1/admin/products');
      setProducts(data?.data || []);
    } catch (err) {
      console.error(err);
      alert('عملیات با مشکل مواجه شد');
    }
  };

  const renderModal = () => (
    <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="product-modal" sx={{ overflowY: 'auto' }}>
      <Box sx={{ width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' }, maxWidth: 1100, mx: 'auto', mt: 4, mb: 4 }}>
        <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
          {/* Header */}
          <Box sx={{ bgcolor: SURFACE, p: 3, borderBottom: `1px solid ${INK_SOFT}20` }}>
            <Typography sx={{ fontWeight: 800, fontSize: 24, color: INK }}>{mode === 'create' ? 'اضافه کردن محصول جدید' : mode === 'edit' ? 'ویرایش محصول' : 'مشاهده محصول'}</Typography>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 }, maxHeight: '70vh', overflowY: 'auto' }}>
            <Grid container spacing={3}>
              {/* ستون چپ */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField fullWidth label="عنوان محصول" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="زیرعنوان" value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="برند" value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="مدل" value={formData.model || ''} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="قیمت" type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="تخفیف (%)" type="number" value={formData.discount || 0} onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="قیمت نهایی" type="number" value={formData.final_price || 0} onChange={(e) => setFormData({ ...formData, final_price: Number(e.target.value) })} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="توضیحات" multiline rows={3} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </Grid>
                </Grid>
              </Grid>

              {/* ستون راست */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <TextField fullWidth label="دسته‌بندی فارسی" value={formData.category_fa || ''} onChange={(e) => setFormData({ ...formData, category_fa: e.target.value })} />
                  <TextField fullWidth label="مواد" value={formData.material || ''} onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                  <TextField fullWidth label="مناسب برای" value={formData.best_for || ''} onChange={(e) => setFormData({ ...formData, best_for: e.target.value })} />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      رنگ‌ها (جدا با کاما)
                    </Typography>
                    <TextField fullWidth multiline rows={2} value={formData.colors?.join(', ') || ''} onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map((c) => c.trim()) })} />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      ویژگی‌ها (جدا با کاما)
                    </Typography>
                    <TextField fullWidth multiline rows={2} value={formData.features?.join(', ') || ''} onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map((f) => f.trim()) })} />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      مشخصات (JSON)
                    </Typography>
                    <TextField fullWidth multiline rows={4} value={specsText} onChange={(e) => handleSpecsChange(e.target.value)} error={specsError} helperText={specsError ? 'فرمت JSON معتبر نیست' : ' '} />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 3, borderTop: `1px solid ${INK_SOFT}20`, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} sx={{ color: INK_SOFT }}>
              لغو
            </Button>
            <Button variant="contained" onClick={handleSave} sx={{ bgcolor: ACCENT_ORANGE, px: 4, py: 1.2 }}>
              {mode === 'create' ? 'ذخیره محصول جدید' : 'ذخیره تغییرات'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );

  return (
    <AdminLayout>
      <Box width={'100%'}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>مدیریت محصولات</Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(products.length)} محصول ثبت‌شده</Typography>
          </Box>
          <Button onClick={() => setOpenNewModal(true)} startIcon={<Add size={18} style={{ marginLeft: 4 }} />} sx={{ px: 2.5, py: 1.2, borderRadius: '12px', fontWeight: 600, fontSize: 14, color: '#fff', bgcolor: ACCENT_ORANGE, boxShadow: `4px 4px 12px ${alpha(ACCENT_ORANGE, 0.35)}`, '&:hover': { bgcolor: '#E06B10' } }}>
            افزودن محصول
          </Button>
        </Stack>

        {/* Search */}
        <Box sx={{ ...neoSoft, p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              fullWidth
              placeholder="جستجو در محصولات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={18} color={INK_SOFT} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', ...neoInset, '& fieldset': { border: 'none' } } }}
            />
            <Button startIcon={<Filter size={16} style={{ marginLeft: 4 }} />} sx={{ px: 2.5, borderRadius: '12px', fontWeight: 600, color: INK, ...neoSoft, whiteSpace: 'nowrap' }}>
              فیلتر
            </Button>
          </Stack>
        </Box>

        {/* Table - Responsive */}
        <Box sx={{ ...neoRaised, overflow: 'hidden', width: '100%' }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 180 }}>محصول</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 110 }}>دسته‌بندی</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 90 }}>قیمت نهایی</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 70 }}>تخفیف</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 110 }}>برند</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 110 }}>مدل</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 130 }}>رنگ‌ها</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 700, color: INK_SOFT, fontSize: { xs: 11, sm: 13 }, minWidth: 140 }}>
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((p) => {
                  const colorsStr = Array.isArray(p.colors) ? p.colors.join('، ') : p.colors || '';
                  const finalPrice = p.final_price ?? p.price ?? 0;

                  return (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: alpha(ACCENT_ORANGE, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT_ORANGE }}>
                            <Box1 size={18} variant="Bold" />
                          </Box>
                          <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, sm: 13.5 }, color: INK, lineHeight: 1.2 }}>{p.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: INK_SOFT }}>{p.category_fa}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{ConvertToPersianDigit(finalPrice.toLocaleString())}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{ConvertToPersianDigit(p.discount ?? 0)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{p.brand}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: INK }}>{p.model}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: INK_SOFT, whiteSpace: 'nowrap' }}>{colorsStr}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Stack direction="row" gap={0.5}>
                          <IconButton size="small" onClick={() => openModal('view', p)}>
                            <Eye size={17} color={INK_SOFT} />
                          </IconButton>
                          <IconButton size="small" onClick={() => openModal('edit', p)}>
                            <Edit2 size={17} color={ACCENT_ORANGE} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(p.id)}>
                            <Trash size={17} color="#E53E3E" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Modal */}
        {renderModal()}
      </Box>
      <NewProductModal open={openNewModal} onClose={() => setOpenNewModal(false)} onSave={handleNewProduct} />
    </AdminLayout>
  );
}

430140040000410016658818