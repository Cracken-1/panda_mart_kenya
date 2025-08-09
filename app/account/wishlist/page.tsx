'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Wishlist } from '@/components/account/Wishlist';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import AuthenticationForm from '@/components/auth/AuthenticationForm';

export default function WishlistPage() {
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

  return <Wishlist />;
}