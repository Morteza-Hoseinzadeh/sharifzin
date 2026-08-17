'use client';

import React from 'react';
import { Box, alpha, Stack, Typography, keyframes } from '@mui/material';

// ==================== Neomorphism Tokens (match project) ====================
const BG = '#E8ECF1';
const SURFACE = '#F0F4F8';
const INK = '#2D3748';
const INK_SOFT = '#718096';
const ACCENT_ORANGE = '#F57C1F';
const SHADOW_LIGHT = 'rgba(255, 255, 255, 0.9)';
const SHADOW_DARK = 'rgba(163, 177, 198, 0.55)';

// ==================== Animations ====================
const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT};
  }
  50% {
    box-shadow: inset 2px 2px 4px ${SHADOW_DARK}, inset -2px -2px 4px ${SHADOW_LIGHT};
  }
`;

const dotBlink = keyframes`
  0%, 80%, 100% { opacity: 0.25; }
  40% { opacity: 1; }
`;

export default function Loading() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'rtl', bgcolor: BG, gap: 3.5 }}>
      {/* Neomorphic ring — raised outer track, spinning orange arc, inset core */}
      <Box sx={{ position: 'relative', width: 84, height: 84, borderRadius: '50%', background: SURFACE, boxShadow: `8px 8px 18px ${SHADOW_DARK}, -8px -8px 18px ${SHADOW_LIGHT}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Spinning accent arc */}
        <Box sx={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '3px solid transparent', borderTopColor: ACCENT_ORANGE, borderRightColor: alpha(ACCENT_ORANGE, 0.25), animation: `${spin} 0.9s linear infinite` }} />

        {/* Inset core, gently pulsing */}
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: SURFACE, animation: `${pulse} 1.8s ease-in-out infinite` }} />
      </Box>

      {/* Label + animated dots */}
      <Stack direction="row" alignItems="baseline" spacing={0.4}>
        <Typography sx={{ fontWeight: 700, fontSize: 15.5, color: INK }}>درحال بارگذاری</Typography>
        {[0, 1, 2].map((i) => (
          <Box key={i} component="span" sx={{ fontWeight: 700, fontSize: 15.5, color: ACCENT_ORANGE, animation: `${dotBlink} 1.4s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
            .
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
