'use client';

import {
  useEffect,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAccessToken,
  getStoredUser,
} from '../../modules/auth/auth.storage';

interface AdminRouteGuardProps {
  children: ReactNode;
}

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function AdminRouteGuard({
  children,
}: AdminRouteGuardProps) {
  const router = useRouter();

  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const accessToken = isClient
    ? getAccessToken()
    : null;

  const user = isClient
    ? getStoredUser()
    : null;

  const redirectPath = !isClient
    ? null
    : !accessToken || !user
      ? '/login'
      : user.role !== 'Admin'
        ? '/unauthorized'
        : null;

  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  if (!isClient || redirectPath) {
    return (
      <main style={{ padding: '32px' }}>
        Đang kiểm tra quyền truy cập...
      </main>
    );
  }

  return children;
}