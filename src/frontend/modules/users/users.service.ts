import { apiRequest } from '../../services/api';
import type {
  CreateUserInput,
  DeleteUserResponse,
  UpdateUserInput,
  UserListItem,
  UserMutationResponse,
  UserQuery,
  UserRoleOption,
  UsersResponse,
} from './users.types';

function buildUserQuery(query: UserQuery,): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search,);
  }

  if (query.roleId !== undefined) {
    params.set('roleId', String(query.roleId),);
  }

  if (query.status !== undefined) {
    params.set('status', String(query.status),);
  }

  if (query.page !== undefined) {
    params.set('page', String(query.page),);
  }

  if (query.limit !== undefined) {
    params.set('limit', String(query.limit),);
  }

  const queryString = params.toString();

  return queryString ? `/users?${queryString}` : '/users';
}

export async function getUsers(accessToken: string, query: UserQuery = {},): Promise<UsersResponse> {
  return apiRequest<UsersResponse>(
    buildUserQuery(query),
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getUserById(accessToken: string, userId: number,): Promise<UserListItem> {
  return apiRequest<UserListItem>(
    `/users/${userId}`,
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getUserRoles(accessToken: string,): Promise<UserRoleOption[]> {
  return apiRequest<UserRoleOption[]>(
    '/users/roles',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function createUser(accessToken: string, input: CreateUserInput,): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(
    '/users',
    {
      method: 'POST',
      accessToken,
      body: input,
    },
  );
}

export async function updateUser(
  accessToken: string,
  userId: number,
  input: UpdateUserInput,
): Promise<UserMutationResponse> {
  return apiRequest<UserMutationResponse>(
    `/users/${userId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}

export async function deleteUser(accessToken: string, userId: number,): Promise<DeleteUserResponse> {
  return apiRequest<DeleteUserResponse>(
    `/users/${userId}`,
    {
      method: 'DELETE',
      accessToken,
    },
  );
}