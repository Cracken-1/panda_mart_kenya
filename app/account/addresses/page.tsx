'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AddressManagement } from '@/components/account/AddressManagement';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AddressesPage() {
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

  return <AddressManagement />;
}