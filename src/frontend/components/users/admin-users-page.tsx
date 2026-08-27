'use client';

import AdminUsersPageContent from './admin-users-page-content';
import useAdminUsersPage from './use-admin-users-page';

export default function AdminUsersPage() {
  const { state, actions } = useAdminUsersPage();

  return <AdminUsersPageContent state={state} actions={actions} />;
}