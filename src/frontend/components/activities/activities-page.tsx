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
  ActivityDealOption,
  CreateActivityInput,
} from '../../modules/activities/activities.types';
import { ApiError } from '../../services/api';
import styles from './activities-page.module.css';
import CreateActivityModal from './create-activity-modal';
import UpdateActivityResultModal from './update-activity-result-modal';
import ActivityTable from './activity-table';
import ActivityDetailModal from './activity-detail-modal';

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
        <ActivityTable
          activities={activities}
          cancellingActivityId={cancellingActivityId}
          onSelect={setSelectedActivity}
          onUpdateResult={setUpdatingActivity}
          onCancel={handleCancelActivity}
        />
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
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </main>
  );
}