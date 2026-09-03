'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '../../modules/auth/auth.storage';
import LoginForm from './login-form';

function getDashboardPath(role: string): string {
  switch (role) {
    case 'Admin':
      return '/admin/dashboard';

    case 'Sales Manager':
      return '/sales-manager/dashboard';

    case 'Sales':
      return '/sales/dashboard';

    case 'Marketing':
      return '/marketing/dashboard';

    case 'Customer Care':
      return '/customer-care/dashboard';

    default:
      return '/unauthorized';
  }
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();

    if (user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [router]);

  function handleLoginSuccess(role: string): void {
    router.replace(getDashboardPath(role));
  }

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}