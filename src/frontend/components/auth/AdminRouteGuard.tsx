'use client';

import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  getAccessToken,
  getStoredUser,
} from '../../modules/auth/auth.storage';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({
  children,
}: AdminRouteGuardProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] =
    useState(true);

  useEffect(() => {
    const accessToken = getAccessToken();
    const user = getStoredUser();

    if (!accessToken || !user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'Admin') {
      router.replace('/unauthorized');
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <main
        style={{
          padding: '32px',
        }}
      >
        Đang kiểm tra quyền truy cập...
      </main>
    );
  }

  return children;
}