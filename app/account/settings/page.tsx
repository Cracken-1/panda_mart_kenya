'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import AuthLayout from '@/components/auth/AuthLayout';
import { AccountSettings } from '@/components/account/AccountSettings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function SettingsPage() {
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
        subtitle="Please sign in to access your settings"
        showBackButton={true}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to manage your settings.</p>
        </div>
      </AuthLayout>
    );
  }

  return <AccountSettings />;
}