'use client';

import { useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, } from '../../modules/notifications/notifications.service';
import type { Notification } from '../../modules/notifications/notifications.types';
import { ApiError } from '../../services/api';
import styles from './notifications-page.module.css';

interface Props {
    taskPath?: string;
}

export default function SalesNotificationsPage({ taskPath = '/sales/tasks', }: Props) {
    const router = useRouter();
    const [notifications, setNotifications,] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMarkingAll, setIsMarkingAll,] = useState(false);

    useEffect(() => {
        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        async function loadNotifications(accessToken: string,): Promise<void> {
            try {
                const data = await getNotifications(accessToken,);
                setNotifications(data);
            } catch (caughtError) {
                handleLoadError(caughtError, router.replace, setError,);
            } finally {
                setIsLoading(false);
            }
        }
        void loadNotifications(token);
    }, [router]);

    async function handleRead(notification: Notification,): Promise<void> {
        if (notification.isRead) {
            openNotification(notification,);
            return;
        }

        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        try {
            await markNotificationAsRead(token, notification.notificationId,);

            setNotifications(
                (current) =>
                    current.map((item) =>
                        item.notificationId ===
                            notification.notificationId
                            ? { ...item, isRead: true, } : item,
                    ),
            );

            openNotification(notification,);
        } catch (caughtError) {
            showMutationError(caughtError,);
        }
    }

    async function handleReadAll(): Promise<void> {
        const token = getAccessToken();
        if (!token) {
            router.replace('/login');
            return;
        }

        setIsMarkingAll(true);

        try {
            await markAllNotificationsAsRead(token,);

            setNotifications(
                (current) => current.map((item) => ({ ...item, isRead: true, })),
            );
        } catch (caughtError) {
            showMutationError(caughtError,);
        } finally {
            setIsMarkingAll(false);
        }
    }

    function openNotification(notification: Notification,): void {
        if (notification.type === 'Task' || notification.type === 'TaskReminder') {
            router.push(taskPath);
        }
    }

    if (isLoading) {
        return (
            <main className={styles.page}>
                <p>
                    Đang tải thông báo...
                </p>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>Thông báo</h1>
                    <p>
                        Theo dõi các công việc
                        được phân công cho bạn.
                    </p>
                </div>

                {notifications.some(
                    (item) => !item.isRead,
                ) && (
                        <button type="button"
                            className={styles.readAllButton}
                            onClick={() => void handleReadAll()}
                            disabled={isMarkingAll}
                        >
                            {isMarkingAll ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
                        </button>
                    )}
            </header>

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {!error &&
                notifications.length === 0 && (
                    <div className={styles.emptyState}>
                        Bạn chưa có thông báo nào.
                    </div>
                )}

            {!error &&
                notifications.length > 0 && (
                    <div className={styles.notificationList}>
                        {notifications.map(
                            (notification) => (
                                <button key={notification.notificationId}
                                    type="button"
                                    className={notification.isRead ? styles.notification : styles.unreadNotification}
                                    onClick={() => void handleRead(notification,)}
                                >
                                    <div className={styles.notificationIcon}>
                                        🔔
                                    </div>

                                    <div className={styles.notificationContent}>
                                        <div className={styles.notificationHeader}>
                                            <strong>
                                                {notification.title ?? 'Thông báo'}
                                            </strong>

                                            {!notification.isRead && (
                                                <span className={styles.unreadBadge}>
                                                    Chưa đọc
                                                </span>
                                            )}
                                        </div>

                                        <p>
                                            {notification.content ?? 'Không có nội dung.'}
                                        </p>

                                        <time>
                                            {formatDateTime(notification.createdDate,)}
                                        </time>
                                    </div>
                                </button>
                            ),
                        )}
                    </div>
                )}
        </main>
    );
}

function formatDateTime(value: string | null,): string {
    if (!value) {
        return '';
    }

    return new Date(value,).toLocaleString('vi-VN',);
}

function showMutationError(caughtError: unknown,): void {
    if (caughtError instanceof ApiError) {
        window.alert(caughtError.message,);
        return;
    }

    window.alert('Đã xảy ra lỗi khi cập nhật thông báo.',);
}

function handleLoadError(caughtError: unknown, replace: (href: string) => void, setError: (message: string) => void,): void {
    if (caughtError instanceof ApiError) {
        if (caughtError.statusCode === 401) {
            clearAuth();
            replace('/login');
            return;
        }

        if (caughtError.statusCode === 403) {
            replace('/unauthorized');
            return;
        }

        setError(caughtError.message);
        return;
    }

    setError('Đã xảy ra lỗi khi tải thông báo.',);
}