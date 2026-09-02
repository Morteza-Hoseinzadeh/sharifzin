'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Button } from '@mui/material';
import { TickCircle } from 'iconsax-reactjs';
import ChildrenLayout from '@/components/ChildrenLayout';
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderCode = searchParams.get('order');
  const refId = searchParams.get('ref');

  return (
    <ChildrenLayout>
      <Box sx={{ bgcolor: '#E8ECF1', minHeight: '100vh', py: 10 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', p: 5, borderRadius: '24px', bgcolor: '#F0F4F8', boxShadow: '8px 8px 20px rgba(163,177,198,0.4)' }}>
            <TickCircle size={70} color="#2F9E44" variant="Bold" />
            <Typography sx={{ mt: 3, fontWeight: 800, fontSize: 24 }}>پرداخت با موفقیت انجام شد</Typography>

            <Typography sx={{ mt: 2, color: '#718096' }}>
              کد سفارش: <strong>{orderCode}</strong>
            </Typography>
            {refId && (
              <Typography sx={{ mt: 1, color: '#718096' }}>
                کد پیگیری زرین‌پال: <strong>{refId}</strong>
              </Typography>
            )}

            <Button fullWidth sx={{ mt: 4, py: 1.8, bgcolor: '#F57C1F', color: '#fff', borderRadius: '14px', fontWeight: 700 }} onClick={() => router.push(`/orders/${orderCode}`)}>
              پیگیری سفارش
            </Button>
          </Box>
        </Container>
      </Box>
    </ChildrenLayout>
  );
}
