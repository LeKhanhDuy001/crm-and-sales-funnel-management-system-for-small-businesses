'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getUsers, createUser, deleteUser, getUserById, getUserRoles, updateUser, } from '../../modules/users/users.service'
import type { UserListItem, UsersPagination, CreateUserInput, UpdateUserInput, UserRoleOption, } from '../../modules/users/users.types';
import { ApiError } from '../../services/api';
import DashboardHeader from '../dashboard/dashboard-header';
import styles from '../dashboard/role-dashboard.module.css';
import AdminDashboardLayout from '../dashboard/admin-dashboard-layout';
import CreateUserModal from './create-user-modal';
import EditUserModal from './edit-user-modal';
import UserDetailModal from './user-detail-modal';


const DEFAULT_PAGE_SIZE = 20;

const DEFAULT_PAGINATION: UsersPagination = {
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
};

function formatUserDate(value: string | null,): string {
    if (!value) {
        return 'Không có';
    }

    return new Intl.DateTimeFormat(
        'vi-VN',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        },
    ).format(new Date(value));
}

export default function AdminUsersPage() {
    const router = useRouter();

    const [users, setUsers] = useState<UserListItem[]>([]);

    const [pagination, setPagination] = useState<UsersPagination>(DEFAULT_PAGINATION,);

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

                const response = await getUsers(
                    accessToken,
                    {
                        search: search || undefined,
                        status,
                        page,
                        limit: DEFAULT_PAGE_SIZE,
                    },
                );

                setUsers(response.data);

                setPagination(response.pagination,);
            } catch (caughtError) {
                if (caughtError instanceof ApiError) {
                    if (caughtError.statusCode === 401) {
                        clearAuth();

                        router.replace('/login');
                        return;
                    }

                    if (caughtError.statusCode === 403) {
                        router.replace('/unauthorized',);

                        return;
                    }

                    setError(caughtError.message,);

                    return;
                }

                setError('Không thể tải danh sách người dùng.',);
            } finally {
                setIsLoading(false);
            }
        }

        void loadUsers();
    }, [
        page,
        router,
        search,
        statusFilter,
        refreshKey,
    ]);

    useEffect(() => {
        async function loadRoles(): Promise<void> {
            const accessToken = getAccessToken();

            if (!accessToken) {
                return;
            }

            try {
                const response = await getUserRoles(accessToken,);
                setRoles(response);
            } catch (caughtError) {
                if (caughtError instanceof ApiError) {
                    if (caughtError.statusCode === 401) {
                        clearAuth();
                        router.replace('/login');
                        return;
                    }

                    if (caughtError.statusCode === 403) {
                        router.replace('/unauthorized',);
                        return;
                    }

                    setError(caughtError.message,);
                    return;
                }

                setError('Không thể tải danh sách vai trò.',);
            }
        }
        void loadRoles();
    }, [router]);

    async function handleCreateUser(input: CreateUserInput,): Promise<void> {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            setIsSaving(true);

            const response = await createUser(accessToken, input,);

            window.alert(response.message);

            setIsCreateOpen(false);

            setRefreshKey((current) => current + 1,);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message);
                return;
            }

            window.alert('Không thể thêm người dùng.',);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleUpdateUser(userId: number, input: UpdateUserInput,): Promise<void> {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            setIsSaving(true);

            const response = await updateUser(accessToken, userId, input,);

            window.alert(response.message);

            setEditingUser(null);

            setRefreshKey((current) => current + 1,);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message,);
                return;
            }

            window.alert('Không thể cập nhật người dùng.',);
        } finally {
            setIsSaving(false);
        }
    }

    function handleSearch(event: FormEvent<HTMLFormElement>,): void {
        event.preventDefault();

        setPage(1);
        setSearch(searchInput.trim(),);
    }

    function handleStatusChange(value: string,): void {
        setPage(1);
        setStatusFilter(value);
    }

    async function handleViewUser(userId: number,): Promise<void> {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            const user = await getUserById(accessToken, userId,);

            setSelectedUser(user);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message,);
                return;
            }

            window.alert('Không thể tải thông tin người dùng.',);
        }
    }

    async function handleEditUser(userId: number,): Promise<void> {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            const user = await getUserById(accessToken, userId,);

            setEditingUser(user);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message,);
                return;
            }

            window.alert('Không thể tải thông tin người dùng.',);
        }
    }

    async function handleDeleteUser(user: UserListItem,): Promise<void> {
        const confirmed = window.confirm(`Bạn có chắc muốn xóa tài khoản "${user.fullName}" không?`,);

        if (!confirmed) {
            return;
        }

        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            const response = await deleteUser(accessToken, user.userId,);

            window.alert(response.message,);

            setRefreshKey((current) => current + 1,);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message,);
                return;
            }

            window.alert('Không thể xóa người dùng.',);
        }
    }

    return (
        <AdminDashboardLayout activePage='users'>
            <main className={styles.page}>
                <DashboardHeader title="Quản lý người dùng"
                    description="Quản lý tài khoản và vai trò của nhân viên trong hệ thống CRM." />

                <section className={`${styles.panel} ${styles.fullWidth}`}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2>Danh sách người dùng</h2>
                            <p>
                                Tổng cộng{' '}
                                {pagination.total}{' '}
                                tài khoản
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', }}>
                        <form onSubmit={handleSearch}
                            style={{ display: 'flex', gap: '8px', flex: 1, }}>
                            <input type="search" value={searchInput}
                                placeholder="Tìm theo họ tên, email hoặc số điện thoại..."
                                onChange={(event) => setSearchInput(event.target.value,)}
                                style={{
                                    flex: 1, minWidth: '260px',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                }} />

                            <button type="submit"
                                style={{ padding: '10px 16px', border: 0, borderRadius: '8px', cursor: 'pointer', }}
                            >
                                Tìm kiếm
                            </button>
                        </form>

                        <select value={statusFilter}
                            onChange={(event) => handleStatusChange(event.target.value,)
                            }
                            style={{
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                            }}
                        >
                            <option value="">
                                Tất cả trạng thái
                            </option>

                            <option value="true">
                                Đang hoạt động
                            </option>

                            <option value="false">
                                Đã khóa
                            </option>
                        </select>

                        <button type="button"
                            onClick={() => setIsCreateOpen(true)}
                            style={{ padding: '10px 16px', border: 0, borderRadius: '8px', cursor: 'pointer', }}>
                            + Thêm người dùng
                        </button>
                    </div>

                    {isLoading ? (
                        <p className={styles.empty}>
                            Đang tải danh sách người dùng...
                        </p>
                    ) : error ? (
                        <p className={styles.empty}>
                            {error}
                        </p>
                    ) : users.length === 0 ? (
                        <p className={styles.empty}>
                            Không tìm thấy người dùng phù hợp.
                        </p>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Họ tên</th>
                                        <th>Email</th>
                                        <th>Điện thoại</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tạo</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.userId}>
                                            <td>
                                                US
                                                {String(user.userId,).padStart(3, '0',)}
                                            </td>

                                            <td>
                                                {user.fullName}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                {user.phone ?? 'Không có'}
                                            </td>

                                            <td>
                                                <span className={styles.badge}
                                                >
                                                    {
                                                        user.role.roleName
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {user.status ? 'Đang hoạt động' : 'Đã khóa'}
                                            </td>

                                            <td>
                                                {formatUserDate(user.createdAt,)}
                                            </td>

                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', }}>
                                                    <button type="button"
                                                        onClick={() => void handleViewUser(user.userId,)}
                                                    >
                                                        Xem
                                                    </button>

                                                    <button type="button"
                                                        onClick={() => void handleEditUser(user.userId,)}
                                                    >
                                                        Sửa
                                                    </button>

                                                    <button type="button"
                                                        onClick={() => void handleDeleteUser(user,)}
                                                        style={{ color: '#dc2626', }}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoading && !error && users.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', }}>
                            <span>
                                Trang{' '}
                                {pagination.page}
                                {' / '}
                                {Math.max(pagination.totalPages, 1,)}
                            </span>

                            <div style={{ display: 'flex', gap: '8px', }}>
                                <button type="button" disabled={page <= 1}
                                    onClick={() => setPage((currentPage,) => currentPage - 1,)}
                                >
                                    Trước
                                </button>

                                <button type="button" disabled={page >= pagination.totalPages}
                                    onClick={() => setPage((currentPage,) => currentPage + 1,)}>
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </section>
                {selectedUser && (
                    <UserDetailModal
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                    />
                )}

                {isCreateOpen && (
                    <CreateUserModal
                        isOpen={isCreateOpen}
                        roles={roles}
                        isSaving={isSaving}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateUser}
                    />
                )}

                {editingUser && (
                    <EditUserModal
                        user={editingUser}
                        roles={roles}
                        isSaving={isSaving}
                        onClose={() => setEditingUser(null)}
                        onSubmit={handleUpdateUser}
                    />
                )}
            </main>
        </AdminDashboardLayout>
    );
}