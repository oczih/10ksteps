'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SubscriptionGuard({ children, fallback }: SubscriptionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      toast.error('Please sign in to access this feature');
      router.replace('/login');
      return;
    }

    if (!session.user.membership && !session.user.hasAccess) {
      toast.error('Premium subscription required to access this feature!', {
        duration: 4000,
        style: {
          border: '1px solid #ef4444',
          padding: '16px',
          color: '#dc2626',
          background: '#fef2f2',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      });
      router.replace('/subscribe');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a]">
        <div className="text-white text-xl">Loading...</div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    );
  }

  // Show fallback or redirect if not authenticated or subscribed
  if (!session?.user || (!session.user.membership && !session.user.hasAccess)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181f2a] via-[#232b39] to-[#10141a]">
        {fallback || <div className="text-white text-xl">Redirecting...</div>}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    );
  }

  // Render children if user is authenticated and subscribed
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </>
  );
} 