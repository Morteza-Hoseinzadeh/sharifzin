'use client';

import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { CloseCircle } from 'iconsax-reactjs';

export default function Customdialog({ open, onClose, children, maxWidth = 'sm', fullWidth = true, title }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} sx={style.dialog_background}>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <DialogTitle sx={{ m: 0, px: 2, display: 'flex', justifyContent: 'left' }}>
          {onClose && (
            <Box width="100%" display="flex" alignItems="center" justifyContent={title ? 'space-between' : 'left'}>
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>

              <IconButton aria-label="close" onClick={onClose} sx={{ '& svg': { color: 'primary.main' } }}>
                <CloseCircle size={26} variant="Bulk" />
              </IconButton>
            </Box>
          )}
        </DialogTitle>

        <DialogContent>{children}</DialogContent>
      </Box>
    </Dialog>
  );
}

const style = {
  dialog_background: {
    background: 'rgba(255, 255, 255, 0.0)',
    backdropFilter: 'blur(4px)',
    '& .MuiPaper-root': {
      borderRadius: '24px',
    },
  },
};
