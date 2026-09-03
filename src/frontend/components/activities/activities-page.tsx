'use client';

import { useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import {
  getActivities,
  createActivity,
  getActivityMeta,
  updateActivityResult,
  cancelActivity,
} from '../../modules/activities/activities.service';
import type {
  Activity,
  ActivityType,
  ActivityDealOption,
  CreateActivityInput,
  ActivityStatus,
} from '../../modules/activities/activities.types';
import { ApiError } from '../../services/api';
import styles from './activities-page.module.css';
import CreateActivityModal from './create-activity-modal';
import UpdateActivityResultModal from './update-activity-result-modal';

function getActivityTypeLabel(type: ActivityType,): string {
  switch (type) {
    case 'Call':
      return 'Gọi điện';
    case 'Email':
      return 'Email';
    case 'Meeting':
      return 'Cuộc hẹn';
    default:
      return type;
  }
}

function getActivityStatusLabel(
  status: ActivityStatus,
): string {
  switch (status) {
    case 'Pending':
      return 'Chờ thực hiện';
    case 'Completed':
      return 'Hoàn thành';
    case 'Cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('vi-VN');
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [updatingActivity, setUpdatingActivity,] = useState<Activity | null>(null);
  const [isUpdatingResult, setIsUpdatingResult,] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dealOptions, setDealOptions] = useState<ActivityDealOption[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cancellingActivityId, setCancellingActivityId,] = useState<number | null>(null);
  useEffect(() => {
    async function loadActivities(): Promise<void> {
      const accessToken = getAccessToken();
      if (!accessToken) {
        router.replace('/login');
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const [activitiesResponse, metaResponse,] = await Promise.all([
          getActivities(accessToken),
          getActivityMeta(accessToken),
        ]);

        setActivities(activitiesResponse.data);
        setDealOptions(metaResponse.deals);
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

        setError('Đã xảy ra lỗi khi tải danh sách hoạt động.',);
      } finally {
        setIsLoading(false);
      }
    }

    void loadActivities();
  }, [router]);

  async function handleCreateActivity(input: CreateActivityInput,): Promise<string | null> {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace('/login');
      return null;
    }
    try {
      setIsCreating(true);
      const response = await createActivity(accessToken, input,);
      setActivities((current) =>
        [
          response.data,
          ...current,
        ].sort(
          (first, second) =>
            new Date(
              second.activityTime,
            ).getTime() -
            new Date(
              first.activityTime,
            ).getTime(),
        ),
      );
      setIsCreateOpen(false);
      window.alert(response.message);
      return null;
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        if (caughtError.statusCode === 401) {
          clearAuth();
          router.replace('/login');
          return null;
        }
        if (caughtError.statusCode === 403) {
          router.replace('/unauthorized');
          return null;
        }
        return caughtError.message;
      }
      return 'Đã xảy ra lỗi khi tạo hoạt động chăm sóc.';
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateResult(activityId: number, result: string,): Promise<string | null> {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace('/login');
      return null;
    }
    try {
      setIsUpdatingResult(true);

      const response = await updateActivityResult(
        accessToken,
        activityId,
        {
          result,
        },
      );
      setActivities((current) =>
        current.map((activity) =>
          activity.activityId === activityId
            ? response.data
            : activity,
        ),
      );
      setSelectedActivity((current) =>
        current?.activityId === activityId
          ? response.data
          : current,
      );
      setUpdatingActivity(null);
      window.alert(response.message);
      return null;
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        if (caughtError.statusCode === 401) {
          clearAuth();
          router.replace('/login');
          return null;
        }
        if (caughtError.statusCode === 403) {
          router.replace('/unauthorized');
          return null;
        }
        return caughtError.message;
      }
      return 'Đã xảy ra lỗi khi cập nhật kết quả chăm sóc.';
    } finally {
      setIsUpdatingResult(false);
    }
  }

  async function handleCancelActivity(activity: Activity,): Promise<void> {
    const confirmed = window.confirm(
      `Bạn có chắc muốn hủy ${activity.activityCode} không?`,
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
      setCancellingActivityId(activity.activityId,);
      const response = await cancelActivity(accessToken, activity.activityId,);
      setActivities((current) =>
        current.map((item) =>
          item.activityId === activity.activityId ? response.data : item,
        ),
      );

      setSelectedActivity((current) =>
        current?.activityId === activity.activityId ? response.data : current,
      );

      window.alert(response.message);
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
        window.alert(caughtError.message);
        return;
      }
      window.alert('Không thể hủy Activity.',);
    } finally {
      setCancellingActivityId(null);
    }
  }

  if (isLoading) {
    return (
      <div className={styles.state}>
        Đang tải danh sách hoạt động...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateError}>
        {error}
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Hoạt động chăm sóc</h1>
          <p>
            Theo dõi lịch sử gọi điện, email và
            cuộc hẹn với khách hàng.
          </p>
        </div>

        <button type="button" className={styles.createButton}
          disabled={dealOptions.length === 0}
          title={dealOptions.length === 0 ? 'Bạn chưa có Deal được phân công chăm sóc.' : undefined}
          onClick={() => setIsCreateOpen(true)}
        >
          Thêm hoạt động
        </button>
      </div>
      {dealOptions.length === 0 && (
        <p className={styles.metaNotice}>
          Hiện tại bạn chưa có Deal phù hợp để
          ghi nhận hoạt động chăm sóc.
        </p>
      )}
      {activities.length === 0 ? (
        <div className={styles.empty}>
          Chưa có hoạt động chăm sóc nào.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Loại</th>
                <th>Nội dung</th>
                <th>Khách hàng</th>
                <th>Deal</th>
                <th>Thời gian</th>
                <th>Kết quả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity) => (
                <tr key={activity.activityId}>
                  <td>
                    {activity.activityCode}
                  </td>

                  <td>
                    <span className={styles.typeBadge}>
                      {getActivityTypeLabel(
                        activity.activityType,
                      )}
                    </span>
                  </td>

                  <td>
                    {activity.subject || '-'}
                  </td>

                  <td>
                    <strong>
                      {activity.customer.fullName}
                    </strong>

                    {activity.customer.company && (
                      <span className={styles.subText}>
                        {activity.customer.company}
                      </span>
                    )}
                  </td>

                  <td>
                    {activity.deal.dealName}
                  </td>

                  <td>
                    {formatDate(activity.activityTime,)}
                  </td>

                  <td>
                    {activity.result || 'Chưa cập nhật'}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[
                        `status${activity.status}`
                      ]
                        }`}
                    >
                      {getActivityStatusLabel(
                        activity.status,
                      )}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" className={styles.detailButton}
                        onClick={() => setSelectedActivity(activity)}
                      >
                        Chi tiết
                      </button>

                      {activity.status !== 'Cancelled' && (
                        <button type="button" className={styles.resultButton}
                          onClick={() => setUpdatingActivity(activity)}
                        >
                          Cập nhật kết quả
                        </button>
                      )}

                      {activity.status === 'Pending' && (
                        <button type="button" className={styles.cancelButton}
                          disabled={cancellingActivityId === activity.activityId}
                          onClick={() => { void handleCancelActivity(activity,); }}
                        >
                          {cancellingActivityId === activity.activityId ? 'Đang hủy...' : 'Hủy'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateOpen && (
        <CreateActivityModal
          deals={dealOptions}
          isSaving={isCreating}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateActivity}
        />
      )}

      {updatingActivity && (
        <UpdateActivityResultModal
          key={updatingActivity.activityId}
          activity={updatingActivity}
          isSaving={isUpdatingResult}
          onClose={() => setUpdatingActivity(null)}
          onSubmit={handleUpdateResult}
        />
      )}

      {selectedActivity && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2>
                  {selectedActivity.activityCode}
                </h2>

                <p>
                  {getActivityTypeLabel(
                    selectedActivity.activityType,
                  )}
                </p>
              </div>

              <button type="button" className={styles.closeButton}
                onClick={() => setSelectedActivity(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.detailGrid}>
              <span>Nội dung</span>
              <strong>
                {selectedActivity.subject || '-'}
              </strong>

              <span>Mô tả</span>
              <strong>
                {selectedActivity.description || '-'}
              </strong>

              <span>Khách hàng</span>
              <strong>
                {selectedActivity.customer.fullName}
              </strong>

              <span>Công ty</span>
              <strong>
                {selectedActivity.customer.company ||
                  '-'}
              </strong>

              <span>Deal</span>
              <strong>
                {selectedActivity.deal.dealName}
              </strong>

              <span>Người thực hiện</span>
              <strong>
                {selectedActivity.user.fullName}
              </strong>

              <span>Thời gian</span>
              <strong>
                {formatDate(
                  selectedActivity.activityTime,
                )}
              </strong>

              <span>Kết quả</span>
              <strong>
                {selectedActivity.result || 'Chưa cập nhật'}
              </strong>
              <span>Trạng thái</span>
              <strong>
                {getActivityStatusLabel(selectedActivity.status,)}
              </strong>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() =>
                  setSelectedActivity(null)
                }
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}