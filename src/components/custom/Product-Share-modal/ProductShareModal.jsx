'use client';

import React, { useState } from 'react';

import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography, Tooltip } from '@mui/material';

import { Copy, TickCircle, CloseCircle, Share } from 'iconsax-reactjs';

export default function ProductShareModal({ open, onClose, item }) {
  const [copied, setCopied] = useState(false);

  const getProductUrl = () => {
    if (typeof window === 'undefined') return '';

    return `${window.location.origin}/product/${item?.category}/${item?.slug}`;
  };

  const handleCopy = async () => {
    try {
      const url = getProductUrl();

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleNativeShare = async () => {
    const url = getProductUrl();

    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({ title: item?.title || 'محصول', text: item?.description || 'مشاهده محصول', url });
    } catch (error) {
      // کاربر ممکن است پنجره Share را بسته باشد
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1, backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' } }}>
      <DialogContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              اشتراک‌گذاری محصول
            </Typography>

            <Typography variant="body2" color="text.disabled" mt={0.5}>
              این محصول را با دیگران به اشتراک بگذارید
            </Typography>
          </Box>

          <Tooltip title="بستن">
            <IconButton onClick={onClose} sx={{ backgroundColor: '#F3F5F7', '&:hover': { backgroundColor: '#E8EBEE' } }}>
              <CloseCircle size={24} variant="Bulk" color="#718096" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Product */}
        <Box sx={{ backgroundColor: '#F3F6F8', borderRadius: '20px', p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ width: 64, height: 64, flexShrink: 0, backgroundColor: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={item?.thumbnail} alt={item?.title || 'محصول'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>

          <Box minWidth={0} textAlign="right">
            <Typography fontWeight={700} noWrap>
              {item?.title}
            </Typography>

            <Typography variant="body2" color="text.disabled" noWrap mt={0.5}>
              {item?.category_fa}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5}>
          {/* Native Share */}
          <Button fullWidth onClick={handleNativeShare} startIcon={<Share size={21} style={{ marginLeft: '12px' }} variant="Bulk" />} sx={{ py: 1.5, borderRadius: '15px', fontWeight: 700, color: '#fff', backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
            اشتراک‌گذاری
          </Button>

          {/* Copy link */}
          <Button fullWidth variant="outlined" onClick={handleCopy} startIcon={copied ? <TickCircle size={21} style={{ marginLeft: '12px' }} variant="Bulk" /> : <Copy size={21} style={{ marginLeft: '12px' }} variant="Bulk" />} sx={{ py: 1.4, borderRadius: '15px', fontWeight: 700, borderWidth: 1.5 }}>
            {copied ? 'لینک کپی شد' : 'کپی لینک محصول'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
