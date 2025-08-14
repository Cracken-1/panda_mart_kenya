'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import EnhancedAccountDashboard from '@/components/account/EnhancedAccountDashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import AuthenticationForm from '@/components/auth/AuthenticationForm';

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
    return <AuthenticationForm />;
  }

  return <EnhancedAccountDashboard />;
}