'use client';

import React, { useState } from 'react';
import { alpha, Box, Divider, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import StyledInput from '../StyledInput/StyledInput';
import { LocationDiscover, Mobile, SearchNormal } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

function SubHeader() {
  const theme = useTheme();

  const [searchValue, setSearchValue] = useState('');
  return (
    <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
      <Box width={'100%'} display={'flex'} alignItems={'center'} gap={2}>
        <Box>
          <Image src="/assets/logo/sharifzin-logo.webp" alt="خرید زین موتور - شریف زین" width={80} height={80} priority />
        </Box>
        <Box width={400}>
          <StyledInput name={'search-product'} placeholder={'محصول مورد نظر خود را جستجو کنید...'} type="input" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} inputIcon={SearchNormal} />
        </Box>
      </Box>

      <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'left'} gap={6}>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row-reverse'} gap={2}>
          <Box>
            <LocationDiscover variant="Bulk" size={32} color={theme.palette.primary.main} />
          </Box>
          <Box>
            <Box sx={{ width: '1px', height: 30, backgroundColor: alpha(theme.palette.text.disabled, 0.1), display: 'inline-block' }} />
          </Box>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="body2" color="secondary.main">
              ایران، تهران، میدان رازی (کمرگ)، خیابان مولوی،
            </Typography>
            <Typography variant="body2" color="text.disabled">
              روبه روی پاساژ بهمن، کوچه خسجته، پلاک 6 ، طبقه بالا
            </Typography>
          </Box>
        </Box>

        <Box display={'flex'} alignItems={'center'} flexDirection={'row-reverse'} gap={2}>
          <Box>
            <Mobile variant="Bulk" size={32} color={theme.palette.primary.main} />
          </Box>
          <Box>
            <Box sx={{ width: '1px', height: 30, backgroundColor: alpha(theme.palette.text.disabled, 0.1), display: 'inline-block' }} />
          </Box>
          <Box>
            <Typography variant="body1">
              <a href="tel:02199887766" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>
                {ConvertToPersianDigit('021-99887766')}
              </a>
            </Typography>
            <Typography variant="caption" color="text.disabled">
              آماده پاسخ گویی 24 ساعته
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Navbar() {
  return (
    <Box>
      <Box></Box>
    </Box>
  );
}

export default function DesktopNavbar() {
  return (
    <Box sx={styles?.container}>
      <SubHeader />
      <Navbar />
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
