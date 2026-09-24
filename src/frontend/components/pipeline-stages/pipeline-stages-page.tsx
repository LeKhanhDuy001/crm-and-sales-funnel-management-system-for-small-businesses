'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken } from '../../modules/auth/auth.storage';
import {
  createPipelineStage,
  deletePipelineStage,
  getPipelineStages,
  updatePipelineStage,
} from '../../modules/pipeline-stages/pipeline-stages.service';
import type {
  CreatePipelineStageInput,
  PipelineStage,
} from '../../modules/pipeline-stages/pipeline-stages.types';
import { ApiError } from '../../services/api';
import AdminDashboardLayout from '../dashboard/admin-dashboard-layout';
import DashboardHeader from '../dashboard/dashboard-header';
import styles from './pipeline-stages-page.module.css';

interface StageFormValues {
  stageName: string;
  stageOrder: string;
  probability: string;
}

const EMPTY_FORM: StageFormValues = {
  stageName: '',
  stageOrder: '',
  probability: '',
};

export default function PipelineStagesPage() {
  const router = useRouter();

  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [createForm, setCreateForm] = useState<StageFormValues>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<StageFormValues>(EMPTY_FORM);
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [deletingStageId, setDeletingStageId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApiError = useCallback((caughtError: unknown): void => {
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

    setError('Không thể xử lý cấu hình Pipeline.');
  }, [router]);

  const loadStages = useCallback(async (): Promise<void> => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await getPipelineStages(accessToken);

      setStages([...response].sort((a, b) => a.stageOrder - b.stageOrder));
    } catch (caughtError) {
      handleApiError(caughtError);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadStages();
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadStages]);

  async function handleCreate(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const payload = buildPayload(createForm);

    if (!payload) {
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      setSuccess('');

      const response = await createPipelineStage(accessToken, payload);

      setSuccess(response.message);
      setCreateForm(EMPTY_FORM);
      await loadStages();
    } catch (caughtError) {
      handleApiError(caughtError);
    } finally {
      setIsCreating(false);
    }
  }

  function startEdit(stage: PipelineStage): void {
    setEditingStageId(stage.stageId);
    setEditForm({
      stageName: stage.stageName,
      stageOrder: String(stage.stageOrder),
      probability: String(stage.probability),
    });
    setError('');
    setSuccess('');
  }

  function cancelEdit(): void {
    setEditingStageId(null);
    setEditForm(EMPTY_FORM);
  }

  async function handleUpdate(stageId: number): Promise<void> {
    const payload = buildPayload(editForm);

    if (!payload) {
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      setIsUpdating(true);
      setError('');
      setSuccess('');

      const response = await updatePipelineStage(accessToken, stageId, payload);

      setSuccess(response.message);
      setEditingStageId(null);
      setEditForm(EMPTY_FORM);
      await loadStages();
    } catch (caughtError) {
      handleApiError(caughtError);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(stage: PipelineStage): Promise<void> {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa giai đoạn "${stage.stageName}" không?`,
    );

    if (!confirmed) {
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      setDeletingStageId(stage.stageId);
      setError('');
      setSuccess('');

      await deletePipelineStage(accessToken, stage.stageId);

      setSuccess('Xóa giai đoạn Pipeline thành công.');
      await loadStages();
    } catch (caughtError) {
      handleApiError(caughtError);
    } finally {
      setDeletingStageId(null);
    }
  }

  function buildPayload(form: StageFormValues): CreatePipelineStageInput | null {
    const stageName = form.stageName.trim();
    const stageOrder = Number(form.stageOrder);
    const probability = Number(form.probability);

    if (!stageName) {
      setError('Tên giai đoạn không được để trống.');
      return null;
    }

    if (stageName.length > 100) {
      setError('Tên giai đoạn không được vượt quá 100 ký tự.');
      return null;
    }

    if (!Number.isInteger(stageOrder) || stageOrder < 1) {
      setError('Thứ tự phải là số nguyên lớn hơn hoặc bằng 1.');
      return null;
    }

    if (
      !Number.isInteger(probability)
      || probability < 0
      || probability > 100
    ) {
      setError('Probability phải là số nguyên từ 0 đến 100.');
      return null;
    }

    return {
      stageName,
      stageOrder,
      probability,
    };
  }

  return (
    <AdminDashboardLayout activePage="pipeline-stages">
      <main className={styles.page}>
        <DashboardHeader
          title="Cấu hình Pipeline"
          description="Quản lý số lượng, tên, thứ tự và xác suất của các giai đoạn trong Pipeline."
        />

        <section className={styles.createCard}>
          <div className={styles.headingRow}>
            <div>
              <h2>Thêm giai đoạn</h2>
              <p>Tạo thêm một giai đoạn mới cho quy trình Deal.</p>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={(event) => void handleCreate(event)}>
            <label className={styles.field}>
              <span>Tên giai đoạn</span>
              <input
                type="text"
                maxLength={100}
                value={createForm.stageName}
                onChange={(event) => setCreateForm((current) => ({
                  ...current,
                  stageName: event.target.value,
                }))}
                placeholder="Ví dụ: Follow Up"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Thứ tự</span>
              <input
                type="number"
                min={1}
                step={1}
                value={createForm.stageOrder}
                onChange={(event) => setCreateForm((current) => ({
                  ...current,
                  stageOrder: event.target.value,
                }))}
                placeholder="7"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Probability (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={createForm.probability}
                onChange={(event) => setCreateForm((current) => ({
                  ...current,
                  probability: event.target.value,
                }))}
                placeholder="20"
                required
              />
            </label>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isCreating}
              >
                {isCreating ? 'Đang thêm...' : '+ Thêm giai đoạn'}
              </button>
            </div>
          </form>
        </section>

        {error ? <p className={styles.error}>{error}</p> : null}
        {success ? <p className={styles.success}>{success}</p> : null}

        <section className={styles.tableCard}>
          <div className={styles.headingRow}>
            <div>
              <h2>Danh sách giai đoạn</h2>
              <p>Won và Lost là giai đoạn hệ thống nên không thể thay đổi hoặc xóa.</p>
            </div>
          </div>

          {isLoading ? (
            <p className={styles.loading}>Đang tải cấu hình Pipeline...</p>
          ) : stages.length === 0 ? (
            <p className={styles.empty}>Chưa có giai đoạn Pipeline.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Thứ tự</th>
                    <th>Tên giai đoạn</th>
                    <th>Probability</th>
                    <th>Loại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {stages.map((stage) => {
                    const isEditing = editingStageId === stage.stageId;
                    const isSystemStage = ['won', 'lost'].includes(
                      stage.stageName.trim().toLowerCase(),
                    );

                    return (
                      <tr key={stage.stageId}>
                        <td>
                          {isEditing ? (
                            <input
                              className={styles.tableInput}
                              type="number"
                              min={1}
                              step={1}
                              value={editForm.stageOrder}
                              onChange={(event) => setEditForm((current) => ({
                                ...current,
                                stageOrder: event.target.value,
                              }))}
                            />
                          ) : (
                            stage.stageOrder
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className={styles.tableInput}
                              type="text"
                              maxLength={100}
                              value={editForm.stageName}
                              onChange={(event) => setEditForm((current) => ({
                                ...current,
                                stageName: event.target.value,
                              }))}
                            />
                          ) : (
                            stage.stageName
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className={styles.tableInput}
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={editForm.probability}
                              onChange={(event) => setEditForm((current) => ({
                                ...current,
                                probability: event.target.value,
                              }))}
                            />
                          ) : (
                            `${stage.probability}%`
                          )}
                        </td>

                        <td>
                          {isSystemStage ? (
                            <span className={styles.systemBadge}>Hệ thống</span>
                          ) : (
                            <span className={styles.badge}>Tùy chỉnh</span>
                          )}
                        </td>

                        <td>
                          <div className={styles.actionButtons}>
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className={styles.primaryButton}
                                  disabled={isUpdating}
                                  onClick={() => void handleUpdate(stage.stageId)}
                                >
                                  {isUpdating ? 'Đang lưu...' : 'Lưu'}
                                </button>

                                <button
                                  type="button"
                                  className={styles.secondaryButton}
                                  disabled={isUpdating}
                                  onClick={cancelEdit}
                                >
                                  Hủy
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className={styles.editButton}
                                  disabled={isSystemStage}
                                  onClick={() => startEdit(stage)}
                                >
                                  Sửa
                                </button>

                                <button
                                  type="button"
                                  className={styles.deleteButton}
                                  disabled={
                                    isSystemStage
                                    || deletingStageId === stage.stageId
                                  }
                                  onClick={() => void handleDelete(stage)}
                                >
                                  {deletingStageId === stage.stageId
                                    ? 'Đang xóa...'
                                    : 'Xóa'}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </AdminDashboardLayout>
  );
}