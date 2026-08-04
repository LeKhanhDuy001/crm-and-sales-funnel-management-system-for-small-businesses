export type UserRole =
  | 'Admin'
  | 'Sales Manager'
  | 'Sales'
  | 'Marketing'
  | 'Customer Care';

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}