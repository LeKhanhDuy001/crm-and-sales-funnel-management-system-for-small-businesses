export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Kiểm tra dữ liệu người dùng nhập trên form đăng nhập.
 *
 * @param email Email người dùng nhập.
 * @param password Mật khẩu người dùng nhập.
 * @returns Các lỗi tương ứng với từng input.
 */
export function validateLoginForm(
  email: string,
  password: string,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.email = 'Email không đúng định dạng.';
  }

  if (!password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  }

  return errors;
}