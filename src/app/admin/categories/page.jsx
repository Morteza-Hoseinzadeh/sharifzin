'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, TextField, IconButton, Grid, alpha } from '@mui/material';
import { Add, Edit2, Trash, Category } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AdminLayout from '@/components/admin/AdminLayout';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoRaised = { background: SURFACE, borderRadius: '22px', boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}` };
const neoSoft = { background: SURFACE, borderRadius: '16px', boxShadow: `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}` };

const initialCategories = [
  { id: 1, name: 'زین کلاسیک', productsCount: 24, color: '#F57C1F' },
  { id: 2, name: 'زین اسپرت', productsCount: 18, color: '#3B82F6' },
  { id: 3, name: 'زین آفرود', productsCount: 12, color: '#38A169' },
  { id: 4, name: 'رویه و کاور', productsCount: 31, color: '#805AD5' },
  { id: 5, name: 'لوازم جانبی', productsCount: 45, color: '#E53E3E' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);

  return (
    <AdminLayout>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: INK }}>مدیریت دسته‌بندی‌ها</Typography>
          <Typography sx={{ fontSize: 14, color: INK_SOFT, mt: 0.5 }}>{ConvertToPersianDigit(categories.length)} دسته‌بندی</Typography>
        </Box>
        <Button
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
          }}
        >
          افزودن دسته‌بندی
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {categories.map((cat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
            <Box sx={{ ...neoRaised, p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" gap={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '14px',
                      bgcolor: alpha(cat.color, 0.12),
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Category size={22} variant="Bold" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: INK }}>{cat.name}</Typography>
                    <Typography sx={{ fontSize: 13, color: INK_SOFT, mt: 0.3 }}>{ConvertToPersianDigit(cat.productsCount)} محصول</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap={0.5}>
                  <IconButton size="small">
                    <Edit2 size={16} color={ACCENT_ORANGE} />
                  </IconButton>
                  <IconButton size="small">
                    <Trash size={16} color="#E53E3E" />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}
