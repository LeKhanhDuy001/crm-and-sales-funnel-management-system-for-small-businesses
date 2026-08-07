import type { AuthUser } from './auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

/**
 * Lưu thông tin đăng nhập.
 *
 * rememberMe = true:
 * - Token và user lưu trong localStorage.
 * - Đóng trình duyệt rồi mở lại vẫn còn phiên đăng nhập.
 * - Email được ghi nhớ cho lần đăng nhập sau.
 *
 * rememberMe = false:
 * - Token và user chỉ lưu trong sessionStorage.
 * - Đóng trình duyệt thì phiên đăng nhập bị xóa.
 */
export function saveAuth(
  accessToken: string,
  user: AuthUser,
  rememberMe: boolean,
  email: string,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Xóa phiên cũ để tránh token tồn tại đồng thời
  // trong localStorage và sessionStorage.
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  if (rememberMe) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken,
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user),
    );

    localStorage.setItem(
      REMEMBERED_EMAIL_KEY,
      email,
    );

    return;
  }

  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );

  // Khi bỏ chọn ghi nhớ thì không giữ email cũ.
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

/**
 * Lấy access token hiện tại.
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

/**
 * Lấy thông tin user đã đăng nhập.
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const userText =
    localStorage.getItem(USER_KEY) ??
    sessionStorage.getItem(USER_KEY);

  if (!userText) {
    return null;
  }

  try {
    return JSON.parse(userText) as AuthUser;
  } catch {
    clearAuth();
    return null;
  }
}

/**
 * Lấy email đã được ghi nhớ ở lần đăng nhập trước.
 */
export function getRememberedEmail(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return (
    localStorage.getItem(REMEMBERED_EMAIL_KEY) ??
    ''
  );
}

/**
 * Kiểm tra người dùng có đang chọn ghi nhớ đăng nhập không.
 */
export function isRememberedLogin(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
}

/**
 * Xóa phiên đăng nhập.
 *
 * Không xóa rememberedEmail để lần sau trang đăng nhập vẫn điền sẵn email.
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Xóa email đã ghi nhớ.
 */
export function clearRememberedEmail(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}