import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { clearAuth } from '../../modules/auth/auth.storage';
import { ApiError } from '../../services/api';

export function handleLoadError(caughtError: unknown, router: AppRouterInstance, setError: (message: string) => void,): void {
  if (caughtError instanceof ApiError) {
    if (caughtError.statusCode === 401) {
      clearAuth();
      router.replace('/login');
      return;
    }

    if (caughtError.statusCode === 403) {
      router.replace('/unauthorized');
      return;
    }

    setError(caughtError.message);
    return;
  }

  setError('Không thể tải danh sách báo giá.',);
}

export function showMutationError(caughtError: unknown, fallbackMessage: string,): void {
  window.alert(caughtError instanceof ApiError ? caughtError.message : fallbackMessage,);
}