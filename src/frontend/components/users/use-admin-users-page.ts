'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken } from '../../modules/auth/auth.storage';
import { createUser, deleteUser, getUserById, getUserRoles, getUsers, updateUser, } from '../../modules/users/users.service';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListItem,
  UserRoleOption,
  UsersPagination,
} from '../../modules/users/users.types';
import { ApiError } from '../../services/api';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGINATION: UsersPagination = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
};

export default function useAdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [pagination, setPagination] = useState<UsersPagination>(DEFAULT_PAGINATION);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [roles, setRoles] = useState<UserRoleOption[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      const accessToken = getAccessToken();
      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const status = statusFilter === '' ? undefined : statusFilter === 'true';
        const response = await getUsers(accessToken, {
          search: search || undefined,
          status,
          page,
          limit: DEFAULT_PAGE_SIZE,
        });

        setUsers(response.data);
        setPagination(response.pagination);
      } catch (caughtError) {
        if (caughtError instanceof ApiError) {
          if (caughtError.statusCode === 401) {
            clearAuth();
            router.replace('/login');
            return;
          }
          if (caughtError.statusCode === 403) {
            router.replace('/unauthorized');
            return;
          }
          setError(caughtError.message);
          return;
        }
        setError('Không thể tải danh sách người dùng.');
      } finally {
        setIsLoading(false);
      }
    }
    void loadUsers();
  }, [page, router, search, statusFilter, refreshKey]);

  useEffect(() => {
    async function loadRoles(): Promise<void> {
      const accessToken = getAccessToken();
      if (!accessToken) {
        return;
      }

      try {
        const response = await getUserRoles(accessToken);
        setRoles(response);
      } catch (caughtError) {
        if (caughtError instanceof ApiError) {
          if (caughtError.statusCode === 401) {
            clearAuth();
            router.replace('/login');
            return;
          }
          if (caughtError.statusCode === 403) {
            router.replace('/unauthorized');
            return;
          }
          setError(caughtError.message);
          return;
        }
        setError('Không thể tải danh sách vai trò.');
      }
    }
    void loadRoles();
  }, [router]);
  async function handleCreateUser(input: CreateUserInput): Promise<void> {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    try {
      setIsSaving(true);

      const response = await createUser(accessToken, input);
      window.alert(response.message);
      setIsCreateOpen(false);
      setRefreshKey((current) => current + 1);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        window.alert(caughtError.message);
        return;
      }

      window.alert('Không thể thêm người dùng.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateUser(userId: number, input: UpdateUserInput): Promise<void> {
    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }
    try {
      setIsSaving(true);

      const response = await updateUser(accessToken, userId, input);
      window.alert(response.message);
      setEditingUser(null);
      setRefreshKey((current) => current + 1);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        window.alert(caughtError.message);
        return;
      }
      window.alert('Không thể cập nhật người dùng.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleStatusChange(value: string): void {
    setPage(1);
    setStatusFilter(value);
  }

  async function handleViewUser(userId: number): Promise<void> {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    try {
      const user = await getUserById(accessToken, userId);
      setSelectedUser(user);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        window.alert(caughtError.message);
        return;
      }
      window.alert('Không thể tải thông tin người dùng.');
    }
  }

  async function handleEditUser(userId: number): Promise<void> {
    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      const user = await getUserById(accessToken, userId);
      setEditingUser(user);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        window.alert(caughtError.message);
        return;
      }

      window.alert('Không thể tải thông tin người dùng.');
    }
  }

  async function handleDeleteUser(user: UserListItem): Promise<void> {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa tài khoản "${user.fullName}" không?`);

    if (!confirmed) {
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }
    try {
      const response = await deleteUser(accessToken, user.userId);

      window.alert(response.message);
      setRefreshKey((current) => current + 1);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        window.alert(caughtError.message);
        return;
      }
      window.alert('Không thể xóa người dùng.');
    }
  }

  return {
    state: {
      users,
      pagination,
      searchInput,
      statusFilter,
      page,
      isLoading,
      error,
      selectedUser,
      editingUser,
      roles,
      isCreateOpen,
      isSaving,
    },
    actions: {
      search: handleSearch,
      searchInputChange: setSearchInput,
      statusChange: handleStatusChange,
      createOpen: () => setIsCreateOpen(true),
      view: handleViewUser,
      edit: handleEditUser,
      delete: handleDeleteUser,
      pageChange: setPage,
      detailClose: () => setSelectedUser(null),
      createClose: () => setIsCreateOpen(false),
      createSubmit: handleCreateUser,
      editClose: () => setEditingUser(null),
      editSubmit: handleUpdateUser,
    },
  };
}