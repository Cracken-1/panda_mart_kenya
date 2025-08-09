'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import AuthLayout from '@/components/auth/AuthLayout';
import { AddressManagement } from '@/components/account/AddressManagement';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AddressesPage() {
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
        subtitle="Please sign in to manage your addresses"
        showBackButton={true}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to manage your addresses.</p>
        </div>
      </AuthLayout>
    );
  }

  return <AddressManagement />;
}