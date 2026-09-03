'use client';

import type { FormEvent } from 'react';
import type { CreateUserInput, UpdateUserInput, UserListItem, UserRoleOption, UsersPagination, } from '../../modules/users/users.types';
import AdminDashboardLayout from '../dashboard/admin-dashboard-layout';
import DashboardHeader from '../dashboard/dashboard-header';
import styles from '../dashboard/role-dashboard.module.css';
import CreateUserModal from './create-user-modal';
import EditUserModal from './edit-user-modal';
import UserDetailModal from './user-detail-modal';

interface AdminUsersState {
  users: UserListItem[];
  pagination: UsersPagination;
  searchInput: string;
  statusFilter: string;
  page: number;
  isLoading: boolean;
  error: string;
  selectedUser: UserListItem | null;
  editingUser: UserListItem | null;
  roles: UserRoleOption[];
  isCreateOpen: boolean;
  isSaving: boolean;
}

interface AdminUsersActions {
  search: (event: FormEvent<HTMLFormElement>) => void;
  searchInputChange: (value: string) => void;
  statusChange: (value: string) => void;
  createOpen: () => void;
  view: (userId: number) => Promise<void>;
  edit: (userId: number) => Promise<void>;
  delete: (user: UserListItem) => Promise<void>;
  pageChange: (page: number) => void;
  detailClose: () => void;
  createClose: () => void;
  createSubmit: (input: CreateUserInput) => Promise<void>;
  editClose: () => void;
  editSubmit: (userId: number, input: UpdateUserInput) => Promise<void>;
}

interface AdminUsersPageContentProps {
  state: AdminUsersState;
  actions: AdminUsersActions;
}

function formatUserDate(value: string | null): string {
  if (!value) {
    return 'Không có';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export default function AdminUsersPageContent({ state, actions }: AdminUsersPageContentProps) {
  const {
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
  } = state;

  return (
    <AdminDashboardLayout activePage="users">
      <main className={styles.page}>
        <DashboardHeader
          title="Quản lý người dùng"
          description="Quản lý tài khoản và vai trò của nhân viên trong hệ thống CRM."
        />

        <section className={`${styles.panel} ${styles.fullWidth}`}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Danh sách người dùng</h2>
              <p>Tổng cộng {pagination.total} tài khoản</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <form onSubmit={actions.search} style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="search" value={searchInput}
                placeholder="Tìm theo họ tên, email hoặc số điện thoại..."
                onChange={(event) => actions.searchInputChange(event.target.value)}
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                }}
              />

              <button type="submit"
                style={{ padding: '10px 16px', border: 0, borderRadius: '8px', cursor: 'pointer' }}
              >
                Tìm kiếm
              </button>
            </form>

            <select value={statusFilter}
              onChange={(event) => actions.statusChange(event.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã khóa</option>
            </select>

            <button type="button" onClick={actions.createOpen}
              style={{ padding: '10px 16px', border: 0, borderRadius: '8px', cursor: 'pointer' }}
            >
              + Thêm người dùng
            </button>
          </div>

          {isLoading ? (
            <p className={styles.empty}>Đang tải danh sách người dùng...</p>
          ) : error ? (
            <p className={styles.empty}>{error}</p>
          ) : users.length === 0 ? (
            <p className={styles.empty}>Không tìm thấy người dùng phù hợp.</p>
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
                      <td>US{String(user.userId).padStart(3, '0')}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone ?? 'Không có'}</td>

                      <td>
                        <span className={styles.badge}>{user.role.roleName}</span>
                      </td>

                      <td>{user.status ? 'Đang hoạt động' : 'Đã khóa'}</td>
                      <td>{formatUserDate(user.createdAt)}</td>

                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="button" onClick={() => void actions.view(user.userId)}>
                            Xem
                          </button>

                          <button type="button" onClick={() => void actions.edit(user.userId)}>
                            Sửa
                          </button>

                          <button type="button"
                            onClick={() => void actions.delete(user)}
                            style={{ color: '#dc2626' }}
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <span>
                Trang {pagination.page} / {Math.max(pagination.totalPages, 1)}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" disabled={page <= 1}
                  onClick={() => actions.pageChange(page - 1)}
                >
                  Trước
                </button>

                <button type="button" disabled={page >= pagination.totalPages}
                  onClick={() => actions.pageChange(page + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </section>

        {selectedUser && (
          <UserDetailModal user={selectedUser} onClose={actions.detailClose} />
        )}

        {isCreateOpen && (
          <CreateUserModal
            isOpen={isCreateOpen}
            roles={roles}
            isSaving={isSaving}
            onClose={actions.createClose}
            onSubmit={actions.createSubmit}
          />
        )}

        {editingUser && (
          <EditUserModal
            user={editingUser}
            roles={roles}
            isSaving={isSaving}
            onClose={actions.editClose}
            onSubmit={actions.editSubmit}
          />
        )}
      </main>
    </AdminDashboardLayout>
  );
}