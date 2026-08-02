import { alpha, Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { Share } from 'iconsax-reactjs';
import React from 'react';

export default function ProductCard({ item }) {
  const theme = useTheme();
  const overlay = '/assets/svg-overlays/product-card.svg';

  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '32px', py: 1, px: 1.5, boxShadow: '0 0 30px #00000015' }}>
      <Box sx={{ backgroundColor: '#D7E0E6', p: 2, borderRadius: '24px' }}>
        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={item?.thumbnail} alt={item?.title} width="100%" style={{ maxWidth: 250, maxHeight: 250 }} />
        </Box>

        <Box width={'100%'} position={'relative'}>
          <Box width={'75%'} display="flex" alignItems="center" justifyContent="space-between" mt={2} gap={1}>
            <Box textAlign="center" sx={{ backgroundColor: '#fff', borderRadius: '12px', px: 2, py: 1, flex: 1 }}>
              <Typography variant="caption" color="text.disabled" display="block">
                دسته‌بندی
              </Typography>
              <Typography variant="body2" fontWeight={500} noWrap>
                {item?.category}
              </Typography>
            </Box>

            <Box textAlign="center" sx={{ backgroundColor: '#fff', borderRadius: '12px', px: 2, py: 1, flex: 1 }}>
              <Typography variant="caption" color="text.disabled" display="block">
                مدل
              </Typography>
              <Typography variant="body2" fontWeight={500} noWrap>
                {item?.model}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box position={'absolute'} bottom={-25} left={-17} zIndex={1}>
              <img src={overlay} alt={`${item?.title} اشتراک گذاری محصول`} style={{ maxWidth: 85 }} />
            </Box>
            <Box position={'absolute'} bottom={-5} left={-15} zIndex={2}>
              <Tooltip title="اشتراک گذاری محصول" placement="top" arrow>
                <IconButton sx={{ backgroundColor: theme.palette.primary.main, borderRadius: '16px', width: 55, height: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all ease 0.2s', '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
                  <Share size={26} variant="Bulk" color="#fff" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box width="100%" textAlign="right" p={1} display="flex" flexDirection="column">
        <Typography variant="h6" component="h1" fontWeight={700}>
          {item?.title}
        </Typography>
        <Typography variant="body2" component="span" color="text.disabled">
          {item?.description}
        </Typography>

        <Box my={1.5}>
          <Box sx={{ width: '100%', height: 1.5, backgroundColor: alpha(theme.palette.text.disabled, 0.1), display: 'inline-block' }} />
        </Box>

        <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body1" color="text.disabled">
            قیمت:
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
            <Typography variant="h5" fontWeight={700}>
              {item?.finalPrice?.toLocaleString('fa-IR')}
            </Typography>
            <img src="/assets/svg-overlays/toman-overlay.svg" width={22} height={22} alt="تومان" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
