import { apiRequest } from '../../services/api';
import type {
  LoginRequest,
  LoginResponse,
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