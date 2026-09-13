// app/checkout/[status]/page.jsx
import axiosInstance from '@/utils/API/axiosInstance';
import Link from 'next/link';

async function getOrder(orderCode) {
  if (!orderCode) return null;
  try {
    const res = await axiosInstance.get(`/api/v1/orders/${orderCode}`, { cache: 'no-store' });
    if (!res.data) return null;
    const data = await res.data;
    return data.order;
  } catch (e) {
    console.error('Failed to fetch order:', e);
    return null;
  }
}

const STATUS_CONFIG = {
  paid: {
    icon: '✅',
    color: '#16a34a',
    title: 'پرداخت با موفقیت انجام شد',
  },
  pending_payment: {
    icon: '⏳',
    color: '#d97706',
    title: 'پرداخت هنوز تکمیل نشده است',
  },
  cancelled: {
    icon: '❌',
    color: '#dc2626',
    title: 'پرداخت لغو یا ناموفق بود',
  },
  not_found: {
    icon: '⚠️',
    color: '#dc2626',
    title: 'خطا در بررسی سفارش',
  },
};

export default async function CheckoutStatusPage({ params, searchParams }) {
  const { status: urlStatus } = params; // 'success' | 'failed' | 'error' — used only for a fallback message
  const { order: orderCode, ref } = searchParams;

  const order = await getOrder(orderCode);

  // Ground truth comes from the DB, not the URL segment
  const dbStatus = order ? order.status : 'not_found';
  const config = STATUS_CONFIG[dbStatus] || STATUS_CONFIG.not_found;

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: 56 }}>{config.icon}</div>
      <h1 style={{ color: config.color, marginTop: 12 }}>{config.title}</h1>

      {order ? (
        <div style={{ marginTop: 24, textAlign: 'right', background: '#f9fafb', borderRadius: 12, padding: 16 }}>
          <p>
            کد سفارش: <strong>{order.orderCode}</strong>
          </p>
          {dbStatus === 'paid' && ref && (
            <p>
              کد پیگیری تراکنش: <strong>{ref}</strong>
            </p>
          )}
          <p>
            مبلغ قابل پرداخت: <strong>{order.payableAmount.toLocaleString('fa-IR')} تومان</strong>
          </p>
        </div>
      ) : (
        <p style={{ marginTop: 16 }}>سفارشی با این مشخصات یافت نشد.</p>
      )}

      <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center' }}>
        {dbStatus === 'pending_payment' && orderCode && (
          <Link href={`/checkout?retry=${orderCode}`} style={{ padding: '10px 20px', background: '#111827', color: '#fff', borderRadius: 8 }}>
            تلاش مجدد برای پرداخت
          </Link>
        )}
        <Link href="/" style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 8 }}>
          بازگشت به فروشگاه
        </Link>
        {dbStatus === 'paid' && order && (
          <Link href={`/orders/${order.orderCode}`} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', borderRadius: 8 }}>
            مشاهده جزئیات سفارش
          </Link>
        )}
      </div>
    </div>
  );
}
