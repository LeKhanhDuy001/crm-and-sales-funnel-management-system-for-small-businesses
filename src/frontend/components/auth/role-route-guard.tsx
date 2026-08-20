'use client';

import { useEffect, useSyncExternalStore,} from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, getStoredUser, } from '../../modules/auth/auth.storage';

export type UserRole = | 'Admin' | 'Sales Manager' | 'Sales' | 'Marketing' | 'Customer Care';

interface RoleRouteGuardProps { children: ReactNode; allowedRole: UserRole; }

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function RoleRouteGuard({children, allowedRole, }: RoleRouteGuardProps) {
  const router = useRouter();

  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const accessToken = isClient ? getAccessToken() : null;

  const user = isClient ? getStoredUser() : null;

  const redirectPath = !isClient
    ? null
    : !accessToken || !user
      ? '/login'
      : user.role !== allowedRole
        ? '/unauthorized'
        : null;

  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  if (!isClient || redirectPath) {
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