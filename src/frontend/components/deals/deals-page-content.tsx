'use client';

import type { FormEvent } from 'react';
import type { Customer } from '../../modules/customers/customers.types';
import type { Deal, DealPagination, DealSalesUserOption, PipelineStageOption } from '../../modules/deals/deals.types';
import { getDealStageLabel } from '../../modules/deals/deal-stage-labels';
import AssignDealModal from './assign-deal-modal';
import CreateDealModal from './create-deal-modal';
import DealsTable from './deals-table';
import EditDealModal from './edit-deal-modal';
import PipelineBoard from './pipeline-board';
import styles from './deals-page.module.css';

export type DealViewMode = 'list' | 'pipeline';

interface DealsPageContentState {
  isManager: boolean;
  token: string | null;
  deals: Deal[];
  customers: Customer[];
  stages: PipelineStageOption[];
  salesUsers: DealSalesUserOption[];
  pagination: DealPagination;
  searchInput: string;
  stageFilter: string;
  viewMode: DealViewMode;
  page: number;
  isLoading: boolean;
  error: string;
  isCreateOpen: boolean;
  selectedDeal: Deal | null;
  editingDeal: Deal | null;
  assigningDeal: Deal | null;
  isAssigning: boolean;
  assignError: string;
}

interface DealsPageContentActions {
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onSearchInputChange: (value: string) => void;
  onCreateOpen: () => void;
  onViewModeChange: (mode: DealViewMode) => void;
  onStageFilterChange: (value: string) => void;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onAssignOpen: (deal: Deal) => void;
  onPageChange: (page: number) => void;
  onDealChanged: (deal: Deal) => void;
  onCreateClose: () => void;
  onCreateSuccess: () => void;
  onDetailClose: () => void;
  onEditClose: () => void;
  onEditSuccess: () => void;
  onAssignClose: () => void;
  onAssignSubmit: (assignedUserId: number) => void;
}

interface DealsPageContentProps {
  state: DealsPageContentState;
  actions: DealsPageContentActions;
}

export default function DealsPageContent({ state, actions }: DealsPageContentProps) {
  const {
    isManager,
    token,
    deals,
    customers,
    stages,
    salesUsers,
    pagination,
    searchInput,
    stageFilter,
    viewMode,
    page,
    isLoading,
    error,
    isCreateOpen,
    selectedDeal,
    editingDeal,
    assigningDeal,
    isAssigning,
    assignError,
  } = state;

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Quản lý Deal</h1>
          <p>
            {isManager
              ? 'Quản lý Deal và phân công cho nhân viên Sales.'
              : 'Quản lý các cơ hội bán hàng được phân cho bạn.'}
          </p>
        </div>

        <button type="button" className={styles.primaryButton} onClick={actions.onCreateOpen}>
          + Thêm Deal
        </button>
      </div>

      <section className={styles.panel}>
        {!isManager && (
          <div className={styles.viewTabs}>
            <button type="button"
              className={viewMode === 'list' ? styles.viewTabActive : styles.viewTab}
              onClick={() => actions.onViewModeChange('list')}
            >
              Danh sách
            </button>

            <button type="button"
              className={viewMode === 'pipeline' ? styles.viewTabActive : styles.viewTab}
              onClick={() => actions.onViewModeChange('pipeline')}
            >
              Pipeline
            </button>
          </div>
        )}

        <div className={styles.filters}>
          <form className={styles.searchForm} onSubmit={actions.onSearch}>
            <input type="search" placeholder="Tìm theo tên Deal, Customer, công ty..."
              value={searchInput} onChange={(event) => actions.onSearchInputChange(event.target.value)}
            />

            <button type="submit">Tìm kiếm</button>
          </form>

          {viewMode === 'list' && (
            <select value={stageFilter}
              onChange={(event) => actions.onStageFilterChange(event.target.value)}
            >
              <option value="">Tất cả giai đoạn</option>

              {stages.map((stage) => (
                <option key={stage.stageId} value={stage.stageId}>
                  {getDealStageLabel(stage.stageName)}
                </option>
              ))}
            </select>
          )}
        </div>

        {isLoading && (
          <p className={styles.stateMessage}>
            Đang tải danh sách Deal...
          </p>
        )}

        {!isLoading && error && (
          <p className={styles.errorMessage}>
            {error}
          </p>
        )}

        {!isLoading && !error && deals.length === 0 && viewMode === 'list' && (
          <p className={styles.stateMessage}>
            Không tìm thấy Deal phù hợp.
          </p>
        )}

        {!isLoading && !error && deals.length > 0 && viewMode === 'list' && (
          <>
            <DealsTable
              deals={deals}
              onView={actions.onView}
              onEdit={actions.onEdit}
              onDelete={actions.onDelete}
              showAssignedUser={isManager}
              onAssign={isManager ? actions.onAssignOpen : undefined}
            />

            <div className={styles.pagination}>
              <button type="button" disabled={page <= 1}
                onClick={() => actions.onPageChange(page - 1)}
              >
                Trước
              </button>

              <span>
                Trang {pagination.page} {' / '} {Math.max(pagination.totalPages, 1)}
              </span>

              <button type="button" disabled={page >= pagination.totalPages}
                onClick={() => actions.onPageChange(page + 1)}
              >
                Sau
              </button>
            </div>
          </>
        )}

        {!isManager && !isLoading && !error && viewMode === 'pipeline' && token && (
          <PipelineBoard
            token={token}
            deals={deals}
            stages={stages}
            onDealChanged={actions.onDealChanged}
          />
        )}
      </section>

      {isCreateOpen && token && (
        <CreateDealModal
          token={token}
          customers={customers}
          stages={stages}
          salesUsers={salesUsers}
          requireAssignee={isManager}
          onClose={actions.onCreateClose}
          onSuccess={actions.onCreateSuccess}
        />
      )}

      {selectedDeal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết {selectedDeal.dealCode}</h2>

              <button type="button" className={styles.closeButton} onClick={actions.onDetailClose}>
                ×
              </button>
            </div>

            <div className={styles.detailGrid}>
              <span>Tên Deal</span>
              <strong>{selectedDeal.dealName}</strong>

              <span>Customer</span>
              <strong>{selectedDeal.customer.fullName}</strong>

              <span>Người phụ trách</span>
              <strong>{selectedDeal.assignedUser.fullName}</strong>

              <span>Giai đoạn</span>
              <strong>{getDealStageLabel(selectedDeal.stage.stageName)}</strong>

              <span>Xác suất</span>
              <strong>{selectedDeal.probability ?? 0}%</strong>

              <span>Giá trị</span>
              <strong>{selectedDeal.dealValue.toLocaleString('vi-VN')} đ</strong>

              <span>Doanh thu kỳ vọng</span>
              <strong>{(selectedDeal.expectedRevenue ?? 0).toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>
        </div>
      )}

      {editingDeal && token && (
        <EditDealModal
          token={token}
          deal={editingDeal}
          customers={customers}
          onClose={actions.onEditClose}
          onSuccess={actions.onEditSuccess}
        />
      )}

      {isManager && assigningDeal && (
        <AssignDealModal
          deal={assigningDeal}
          salesUsers={salesUsers}
          isSubmitting={isAssigning}
          submitError={assignError}
          onClose={actions.onAssignClose}
          onSubmit={actions.onAssignSubmit}
        />
      )}
    </main>
  );
}