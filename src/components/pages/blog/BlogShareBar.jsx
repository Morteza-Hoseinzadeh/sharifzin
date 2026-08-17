'use client';

import React, { useEffect, useState } from 'react';
import { Box, Stack, IconButton, Tooltip, LinearProgress } from '@mui/material';
import { Link1, MessageText, Send2 } from 'iconsax-reactjs';

const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

const neoSoft = {
  background: SURFACE,
  borderRadius: '14px',
  boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
};

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 3 }}>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 3, bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: ACCENT_ORANGE } }} />
    </Box>
  );
}

export default function BlogShareBar({ title }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard API unavailable, ignore silently
    }
  };

  const handleTelegramShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title || '');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsappShare = () => {
    const text = encodeURIComponent(`${title || ''} ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Stack direction="row" spacing={1.2}>
      <Tooltip title="کپی لینک">
        <IconButton onClick={handleCopyLink} sx={{ ...neoSoft, width: 40, height: 40, color: INK }}>
          <Link1 size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="اشتراک‌گذاری در تلگرام">
        <IconButton onClick={handleTelegramShare} sx={{ ...neoSoft, width: 40, height: 40, color: INK }}>
          <Send2 size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="اشتراک‌گذاری در واتساپ">
        <IconButton onClick={handleWhatsappShare} sx={{ ...neoSoft, width: 40, height: 40, color: INK }}>
          <MessageText size={18} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
