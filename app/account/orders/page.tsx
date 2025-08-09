'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OrderHistory } from '@/components/account/OrderHistory';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function OrdersPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthLayout />;
  }

  return <OrderHistory />;
}