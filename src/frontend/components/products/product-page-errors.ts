import { clearAuth } from '../../modules/auth/auth.storage';
import { ApiError } from '../../services/api';

interface RouterLike {
  replace: (href: string) => void;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function handleLoadError(error: unknown, router: RouterLike, setError: (value: string) => void): void {
  if (error instanceof ApiError) {
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
    return;
  }

  setError('Không thể tải danh sách sản phẩm.');
}

export function handleMutationError(error: unknown, router: RouterLike): string | null {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      clearAuth();
      router.replace('/login');
      return null;
    }

    if (error.statusCode === 403) {
      router.replace('/unauthorized');
      return null;
    }

    return error.message;
  }

  return 'Không thể lưu thông tin sản phẩm.';
}