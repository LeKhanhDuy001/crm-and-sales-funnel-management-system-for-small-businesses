'use client';

import type { FormEvent } from 'react';
import type { CreateLeadInput, Lead, LeadSource } from '../../modules/leads/leads.types';
import AppShell from '../layout/app-shell';
import LeadDetailModal from './lead-detail-modal';
import LeadFormModal from './lead-form-modal';
import LeadTable from './lead-table';

interface LeadsPageContentState {
  leads: Lead[];
  sources: LeadSource[];
  page: number;
  pageSize: number;
  total: number;
  searchInput: string;
  status: string;
  sourceId: string;
  isLoading: boolean;
  error: string;
  selectedLead: Lead | null;
  editingLead: Lead | null;
  isFormOpen: boolean;
  isSubmitting: boolean;
  formError: string;
  canManage: boolean;
}

interface LeadsPageContentActions {
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onSearchInputChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onCreate: () => void;
  onRetry: () => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onPageChange: (page: number) => void;
  onFormClose: () => void;
  onFormSubmit: (input: CreateLeadInput) => Promise<void>;
  onDetailClose: () => void;
}

interface LeadsPageContentProps {
  state: LeadsPageContentState;
  actions: LeadsPageContentActions;
}

export default function LeadsPageContent({ state, actions }: LeadsPageContentProps) {
  const {
    leads,
    sources,
    page,
    pageSize,
    total,
    searchInput,
    status,
    sourceId,
    isLoading,
    error,
    selectedLead,
    editingLead,
    isFormOpen,
    isSubmitting,
    formError,
    canManage,
  } = state;

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <AppShell
      title="Quản lý khách hàng tiềm năng"
      description="Theo dõi và quản lý toàn bộ khách hàng tiềm năng"
    >
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Tổng Lead</p>
          <p className="mt-2 text-3xl font-bold">{total}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Trang hiện tại</p>
          <p className="mt-2 text-3xl font-bold">
            {page}/{totalPages}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Số Lead đang hiển thị</p>
          <p className="mt-2 text-3xl font-bold">{leads.length}</p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <form onSubmit={actions.onSearch} className="flex flex-1 flex-col gap-3 lg:flex-row">
              <input type="search" value={searchInput}
                onChange={(event) => actions.onSearchInputChange(event.target.value)}
                placeholder="Tìm theo tên, email, SĐT hoặc công ty..."
                className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-600"
              />

              <select value={status}
                onChange={(event) => actions.onStatusChange(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="New">Mới</option>
                <option value="Contacted">Đã liên hệ</option>
                <option value="Qualified">Đủ điều kiện</option>
                <option value="Unqualified">Không phù hợp</option>
                <option value="Converted">Đã chuyển đổi</option>
              </select>

              <select value={sourceId}
                onChange={(event) => actions.onSourceChange(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm"
              >
                <option value="">Tất cả nguồn</option>

                {sources.map((source) => (
                  <option key={source.sourceId} value={source.sourceId}>
                    {source.sourceName}
                  </option>
                ))}
              </select>

              <button type="submit"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
              >
                Tìm kiếm
              </button>
            </form>

            {canManage && (
              <button type="button" onClick={actions.onCreate}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                + Thêm Lead
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="p-10 text-center text-slate-500">
            Đang tải danh sách Lead...
          </div>
        )}

        {!isLoading && error && (
          <div className="p-10 text-center">
            <p className="text-red-600">{error}</p>

            <button type="button" onClick={actions.onRetry}
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              Thử lại
            </button>
          </div>
        )}

        {!isLoading && !error && leads.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            Không có Lead phù hợp.
          </div>
        )}

        {!isLoading && !error && leads.length > 0 && (
          <LeadTable
            leads={leads}
            canManage={canManage}
            onView={actions.onView}
            onEdit={actions.onEdit}
            onDelete={actions.onDelete}
          />
        )}

        {!isLoading && !error && total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Tổng cộng {total} Lead
            </p>

            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1}
                onClick={() => actions.onPageChange(page - 1)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
              >
                Trước
              </button>

              <span className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
                {page} / {totalPages}
              </span>

              <button type="button" disabled={page >= totalPages}
                onClick={() => actions.onPageChange(page + 1)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>

      {isFormOpen && (
        <LeadFormModal
          lead={editingLead}
          sources={sources}
          isSubmitting={isSubmitting}
          error={formError}
          onClose={actions.onFormClose}
          onSubmit={actions.onFormSubmit}
        />
      )}

      <LeadDetailModal lead={selectedLead} onClose={actions.onDetailClose} />
    </AppShell>
  );
}