import { clearAuth } from '../../modules/auth/auth.storage';
import { ApiError } from '../../services/api';

interface RouterLike {
  replace: (href: string) => void;
}

export function handleLeadPageApiError(
  error: unknown,
  router: RouterLike,
  setError: (value: string) => void,
): void {
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

  setError('Đã xảy ra lỗi khi tải danh sách Lead');
}