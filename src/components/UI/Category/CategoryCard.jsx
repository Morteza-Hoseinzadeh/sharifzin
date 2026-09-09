'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { ArrowLeft2, Category2 } from 'iconsax-reactjs';

export default function CategoryCard({ item, index = 0 }) {
  const theme = useTheme();

  const { slug, name_fa, description_fa } = item;
  const href = `/products?category=${slug}`;

  return (
    <Box
      component="a"
      href={href}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        width: '100%',
        minHeight: 150,
        p: 2,
        borderRadius: '30px',
        textDecoration: 'none',
        background: theme.palette.background.default,
        boxShadow: `8px 8px 20px rgba(163, 177, 198, 0.48),-8px -8px 20px rgba(255, 255, 255, 0.95)`,
        transition: 'all 0.25s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: `11px 11px 24px rgba(163, 177, 198, 0.5),-11px -11px 24px rgba(255, 255, 255, 1)`, '& .category-icon': { transform: 'scale(1.04)' }, '& .category-arrow': { transform: 'translateX(-3px)' } },
        '&:active': { transform: 'translateY(0)', boxShadow: `inset 5px 5px 10px rgba(163, 177, 198, 0.4),inset -5px -5px 10px rgba(255, 255, 255, 0.9)` },
      }}
    >
      {/* Number */}
      <Typography sx={{ position: 'absolute', top: 12, left: 22, fontSize: 46, lineHeight: 1, fontWeight: 800, color: theme.palette.text.primary, opacity: 0.035, userSelect: 'none', pointerEvents: 'none' }}>{String(index + 1).padStart(2, '0')}</Typography>

      {/* Icon */}
      <Box className="category-icon" sx={{ flexShrink: 0, width: 82, height: 82, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '26px', background: theme.palette.background.default, boxShadow: `inset 5px 5px 10px rgba(163, 177, 198, 0.32),inset -5px -5px 10px rgba(255, 255, 255, 0.95)`, transition: 'transform 0.25s ease' }}>
        <Category2 size={34} variant="Bulk" color={item?.color} />
      </Box>

      {/* Content */}
      <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
        <Typography sx={{ mb: 0.5, color: theme.palette.text.primary, fontSize: { xs: 17, sm: 18 }, fontWeight: 700, lineHeight: 1.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name_fa}</Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 13, lineHeight: 1.9, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{description_fa}</Typography>
      </Box>

      {/* Arrow Button */}
      <Box className="category-arrow" sx={{ flexShrink: 0, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '17px', background: theme.palette.background.default, boxShadow: `5px 5px 10px rgba(163, 177, 198, 0.38),-5px -5px 10px rgba(255, 255, 255, 0.9)`, transition: 'transform 0.25s ease' }}>
        <ArrowLeft2 size={20} variant="Linear" color={theme.palette.text.primary} />
      </Box>
    </Box>
  );
}
