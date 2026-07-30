'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TickCircle, CloseCircle, InfoCircle, Warning2 } from 'iconsax-reactjs';
import AnimatedMotion from '@/components/UI/AnimatedMotion/AnimatedMotion';

const variantStyles = {
  success: { bg: '#4caf50', Icon: TickCircle },
  error: { bg: '#f44336', Icon: CloseCircle },
  info: { bg: '#2196f3', Icon: InfoCircle },
  warning: { bg: '#ff9800', Icon: Warning2 },
};

const CustomSnackbar = ({ open, onClose, autoHideDuration = 2000, variant = 'success', children }) => {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    let hideTimer;

    if (open) {
      setIsVisible(true);
      hideTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation
      }, autoHideDuration);
    }

    return () => clearTimeout(hideTimer);
  }, [open, autoHideDuration, onClose]);

  const { bg, Icon } = variantStyles[variant] || {};

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div key="snackbar" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', damping: 20, stiffness: 100 }} style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999, backgroundColor: bg, color: '#fff', padding: '12px 20px', borderRadius: '8px', minWidth: '240px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <AnimatedMotion>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
              {/* 🎯 Icon with entrance animation */}
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.4, 0.9, 1], opacity: [0, 1], rotate: [0, 15, -10, 0] }} exit={{ opacity: 0, scale: 0.9, rotate: 0, transition: { duration: 0.3, ease: 'easeOut' } }} transition={{ duration: 0.5, ease: 'easeOut', times: [0, 0.3, 0.6, 1] }}>
                <Icon size={24} color="white" variant="Bulk" /> {/* Explicit Bulk – safe */}
              </motion.div>

              {/* Snackbar message */}
              <div style={{ flex: 1 }}>{children}</div>
            </div>
          </AnimatedMotion>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomSnackbar;
