'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface MockLoginButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export default function MockLoginButton({ 
  className = '', 
  variant = 'primary',
  size = 'md',
  children
}: MockLoginButtonProps) {
  const { mockLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
      outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const handleMockLogin = async () => {
    setLoading(true);
    try {
      await mockLogin();
    } catch (error) {
      console.error('Mock login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMockLogin}
      disabled={loading}
      className={getButtonClasses()}
      title="Mock login for testing purposes"
    >
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Signing In...
        </div>
      ) : (
        children || '🧪 Mock Login'
      )}
    </button>
  );
}