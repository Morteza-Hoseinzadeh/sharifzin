'use client';

import React, { useState } from 'react';
import { alpha, Box, Button, Tooltip, Typography, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import StyledInput from '../StyledInput/StyledInput';
import { LocationDiscover, Mobile, Receipt1, SearchNormal, ShoppingCart, UserOctagon } from 'iconsax-reactjs';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import { links } from '@/utils/data/links';
import Link from 'next/link';

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
  const theme = useTheme();
  const pathname = usePathname();

  const actions = [
    { title: 'ثبت سفارش', href: 'https://example.com', icon: Receipt1, backgroundColor: theme.palette.primary.main },
    { title: 'سبد خرید', href: 'https://example.com/cart', icon: ShoppingCart, backgroundColor: theme.palette.secondary.main },
    { title: null, href: 'https://example.com/account', icon: UserOctagon, backgroundColor: theme.palette.text.primary },
  ];

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={4} width={'100%'}>
      <Box display={'flex'} alignItems={'center'} gap={4}>
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <Link key={index} href={link.href} style={{ fontWeight: isActive ? 600 : 500, textDecoration: 'none', color: isActive ? theme.palette.secondary.main : alpha(theme.palette.secondary.main, 0.5) }}>
              {link.title}
            </Link>
          );
        })}
      </Box>
      <Box width={'fit-content'} display={'flex'} alignItems={'center'} gap={2}>
        {actions.map((action, index) => {
          const contrastColor = theme.palette.primary.contrastText;
          const hasTitle = Boolean(action.title);
          const icon = React.createElement(action.icon, { size: hasTitle ? 22 : 25, color: contrastColor, variant: 'Bulk' });

          return (
            <Tooltip title={action.title} key={index}>
              <Button size={'large'} href={action.href} startIcon={hasTitle ? icon : undefined} sx={{ ...styles?.actionButtons, boxShadow: `0 0 30px ${alpha(action.backgroundColor, 0.5)}`, color: contrastColor, backgroundColor: action.backgroundColor, '&:hover': { backgroundColor: alpha(action.backgroundColor, 0.8) }, borderRadius: 2, padding: '10px 16px', textTransform: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minWidth: hasTitle ? undefined : 0 }}>
                {hasTitle ? action.title : icon}
              </Button>
            </Tooltip>
          );
        })}
      </Box>
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
  actionButtons: {},
};
