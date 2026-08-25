export interface UserRole {
  roleId: number;
  roleName: string;
}

export interface UserRoleOption {
  roleId: number;
  roleName: string;
  description: string | null;
}

export interface UserListItem {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  status: boolean;
  createdAt: string | null;
  role: UserRole;
}

export interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  data: UserListItem[];
  pagination: UsersPagination;
}

export interface UserQuery {
  search?: string;
  roleId?: number;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  roleId: number;
  status?: boolean;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  phone?: string;
  roleId?: number;
  status?: boolean;
}

export interface UserMutationResponse {
  message: string;
  user: UserListItem;
}

export interface DeleteUserResponse {
  message: string;
  mode: 'deleted' | 'deactivated';
  userId?: number;
  user?: UserListItem;
}