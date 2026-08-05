export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiErrorBody {
  message?: string | string[];
  error?: {
    message?: string | string[];
  };
}

interface ApiRequestOptions
  extends Omit<RequestInit, 'body'> {
  accessToken?: string;
  body?: unknown;
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL chưa được cấu hình trong file .env.local',
  );
}

const API_URL = apiUrl.replace(/\/+$/, '');

function getDefaultErrorMessage(
  statusCode: number,
): string {
  if (statusCode === 401) {
    return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn';
  }

  if (statusCode === 403) {
    return 'Bạn không có quyền thực hiện chức năng này';
  }

  if (statusCode === 404) {
    return 'Không tìm thấy dữ liệu yêu cầu';
  }

  return 'Không thể kết nối đến máy chủ';
}

function extractErrorMessage(
  errorBody: ApiErrorBody | null,
  statusCode: number,
): string {
  const message =
    errorBody?.error?.message ??
    errorBody?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return (
    message ??
    getDefaultErrorMessage(statusCode)
  );
}

/**
 * Gửi yêu cầu đến backend thông qua API client chung.
 *
 * @param endpoint Đường dẫn API không bao gồm URL backend.
 * @param options Cấu hình request, token và dữ liệu gửi lên.
 * @returns Dữ liệu phản hồi đã được chuyển sang kiểu T.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    accessToken,
    body,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined) {
    requestHeaders.set(
      'Content-Type',
      'application/json',
    );
  }

  if (accessToken) {
    requestHeaders.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorBody =
      (await response
        .json()
        .catch(() => null)) as ApiErrorBody | null;

    throw new ApiError(
      extractErrorMessage(
        errorBody,
        response.status,
      ),
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}