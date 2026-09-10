import { apiRequest } from '../../services/api';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './auth.types';

/**
 * Gửi thông tin đăng nhập đến backend.
 *
 * @param request Email và mật khẩu của người dùng.
 * @returns Access token và thông tin người dùng.
 */
export async function login(
  request: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: request,
    },
  );
}

/**
 * Kiểm tra email trước khi đặt lại mật khẩu.
 */
export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>(
    '/auth/forgot-password',
    {
      method: 'POST',
      body: request,
    },
  );
}

/**
 * Gửi yêu cầu đặt lại mật khẩu.
 */
export async function resetPassword(
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>(
    '/auth/reset-password',
    {
      method: 'POST',
      body: request,
    },
  );
}

/**
 * Gửi yêu cầu đăng xuất đến backend để ghi Activity Log.
 */
export async function logout(
  accessToken: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    '/auth/logout',
    {
      method: 'POST',
      accessToken,
    },
  );
}