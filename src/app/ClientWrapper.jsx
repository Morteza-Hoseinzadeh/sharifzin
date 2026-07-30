'use client';

import ClientThemeLayout from '@/components/ThemedLayout';

export default function ClientWrapper({ children }) {
  return <ClientThemeLayout>{children}</ClientThemeLayout>;
}
