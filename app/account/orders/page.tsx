'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import AuthLayout from '@/components/auth/AuthLayout';
import { OrderHistory } from '@/components/account/OrderHistory';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function OrdersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthLayout 
        title="Sign In Required" 
        subtitle="Please sign in to view your orders"
        showBackButton={true}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to view your order history.</p>
        </div>
      </AuthLayout>
    );
  }

  return <OrderHistory />;
}