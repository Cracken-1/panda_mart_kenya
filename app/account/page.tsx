'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import AuthLayout from '@/components/auth/AuthLayout';
import { AccountDashboard } from '@/components/account/AccountDashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AccountPage() {
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
        subtitle="Please sign in to access your account"
        showBackButton={true}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to view your account.</p>
          <button className="w-full bg-panda-red-500 text-white py-2 px-4 rounded-lg hover:bg-panda-red-600 transition-colors">
            Sign In
          </button>
        </div>
      </AuthLayout>
    );
  }

  return <AccountDashboard />;
}