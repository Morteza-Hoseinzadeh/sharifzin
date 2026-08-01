import { alpha, Box, Button, Divider, IconButton, Typography, useTheme } from '@mui/material';
import { Share } from 'iconsax-reactjs';
import React from 'react';

export default function ProductCard({ item }) {
  const theme = useTheme();
  const overlay = '/assets/svg-overlays/hero-section-center.svg';

  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} gap={2} alignItems={'center'} sx={{ width: '100%', height: 'fit-content', backgroundColor: '#fff', borderRadius: '32px' }}>
      <Box sx={{ backgroundColor: '#D7E0E6', p: 2, mt: 2, borderRadius: '16px' }}>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '16px' }}>
          <img src={item?.thumbnail} alt={item?.title} width={250} />
        </Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mt={2} gap={1}>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={2} p={'8px 12px'} sx={{ backgroundColor: '#fff', borderRadius: '12px' }}>
            <Box textAlign={'right'}>
              <Typography variant="body2">دسته‌بندی</Typography>
              <Typography variant="body2">{item?.category}</Typography>
            </Box>
            <Box sx={{ width: '1px', height: 25, display: 'inline-block', backgroundColor: '#eee' }} />
            <Box textAlign={'right'}>
              <Typography variant="body2">مدل</Typography>
              <Typography variant="body2">{item?.model}</Typography>
            </Box>
          </Box>
          <Box>
            <Button sx={{ backgroundColor: theme.palette.primary.main, borderRadius: '16px', width: 55, height: 55 }}>
              <Share size={26} variant="Bulk" color={theme.palette.primary.contrastText} />
            </Button>
          </Box>
        </Box>
      </Box>
      <Box width={'100%'} textAlign={'right'} px={2} pb={2} display={'flex'} flexDirection={'column'}>
        <Typography variant="h6" component={'h1'}>
          {item?.title}
        </Typography>
        <Typography variant="body2" component={'span'} color="text.disabled">
          {item?.description}
        </Typography>
        <Box my={0.5}>
          <Box sx={{ width: '100%', height: 1.5, backgroundColor: alpha(theme.palette.text.disabled, 0.1), display: 'inline-block' }} />
        </Box>
        <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant="body1" color="text.disabled">
            قیمت:
          </Typography>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {item?.finalPrice.toLocaleString('fa-IR')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
