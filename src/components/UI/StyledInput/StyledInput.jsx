'use client';

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Eye, EyeSlash } from 'iconsax-reactjs';

export default function StyledInput({ name, value, onChange, placeholder, type = 'input', inputIcon: Icon, options = [], rows = 7, ...props }) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const softShadow = '0px 0px 30px #00000010';

  const commonStyles = {
    width: '100%',
    height: 'auto',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
    outline: 'none',
    padding: '16px 18px',
    paddingRight: Icon || isPassword ? '52px' : '18px',
    borderRadius: '16px',
    boxShadow: softShadow,
    backgroundColor: alpha(theme.palette.background.paper, 0.1),
    color: theme.palette.text.primary,
    fontFamily: 'Dana',
    fontSize: 15,
    transition: '.25s',
    textAlign: 'right',

    '&:focus': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  };

  return (
    <Box position="relative">
      {/* INPUT / PASSWORD */}
      {(type === 'input' || type === 'password' || type === 'tel' || type === 'input') && <Box component="input" type={inputType} name={name} value={value} onChange={onChange} placeholder={placeholder} sx={commonStyles} {...props} />}

      {/* LEFT ICON */}
      {Icon && (
        <Box sx={{ position: 'absolute', right: isPassword ? 52 : 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
          <Icon size={20} variant="Bulk" color={theme.palette.primary.main} />
        </Box>
      )}

      {/* PASSWORD TOGGLE */}
      {isPassword && (
        <IconButton onClick={() => setShowPassword((prev) => !prev)} sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          {showPassword ? <EyeSlash size={20} color={theme.palette.primary.main} variant="Bulk" /> : <Eye size={20} color={theme.palette.primary.main} variant="Bulk" />}
        </IconButton>
      )}

      {/* SELECT */}
      {type === 'select' && (
        <Box component="select" name={name} value={value} onChange={onChange} sx={{ ...commonStyles, '& option': { backgroundColor: theme.palette.background.default, color: theme.palette.primary.main } }} {...props}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Box>
      )}

      {/* TEXTAREA */}
      {type === 'textarea' && <Box component="textarea" rows={rows} name={name} value={value} onChange={onChange} placeholder={placeholder} sx={{ ...commonStyles, resize: 'none' }} {...props} />}
    </Box>
  );
}
