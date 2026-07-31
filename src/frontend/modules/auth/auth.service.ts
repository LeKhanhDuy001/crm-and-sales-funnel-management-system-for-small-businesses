import type {
  LoginRequest,
  LoginResponse,
} from './auth.types';

interface ErrorResponse {
  message?: string | string[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export async function login(
  request: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const errorData =
      (await response.json()) as ErrorResponse;

    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;

    throw new Error(
      message ?? 'Đăng nhập thất bại',
    );
  }

  const data =
    (await response.json()) as LoginResponse;

  return data;
}