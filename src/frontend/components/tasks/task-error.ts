import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { clearAuth } from '../../modules/auth/auth.storage';
import { ApiError } from '../../services/api';

export function handleTaskLoadError(error: unknown, router: AppRouterInstance, setError: (message: string) => void,): void {
  if (!(error instanceof ApiError)) {
    setError('Không thể tải danh sách Task.',);
    return;
  }

  if (error.statusCode === 401) {
    clearAuth();
    router.replace('/login');
    return;
  }

  if (error.statusCode === 403) {
    router.replace('/unauthorized');
    return;
  }

  setError(error.message);
}

export function showTaskMutationError(error: unknown, fallback: string,): void {
  window.alert(error instanceof ApiError ? error.message : fallback,);
}