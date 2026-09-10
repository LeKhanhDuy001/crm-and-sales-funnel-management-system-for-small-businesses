'use client';

import { type FormEvent, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getForecast } from '../../modules/dashboard/dashboard.service';
import type { ForecastData } from '../../modules/dashboard/dashboard.types';
import { ApiError } from '../../services/api';
import { formatCurrency } from './dashboard-formatters';
import styles from './forecast-panel.module.css';

export default function ForecastPanel() {
    const router = useRouter();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
        event.preventDefault();
        setError('');

        if (!fromDate || !toDate) {
            setError('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.',);
            return;
        }

        if (fromDate > toDate) {
            setError('Ngày bắt đầu không được sau ngày kết thúc.',);
            return;
        }
        const accessToken = getAccessToken();
        if (!accessToken) {
            router.replace('/login');
            return;
        }
        try {
            setIsLoading(true);
            const data = await getForecast(
                accessToken,
                {
                    fromDate,
                    toDate,
                },
            );
            setForecast(data);
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

            setError('Đã xảy ra lỗi khi tải Forecast.',);
        } finally {
            setIsLoading(false);
        }
    }

    function handleFromDateChange(value: string,): void {
        setFromDate(value);
        setForecast(null);
        setError('');
    }

    function handleToDateChange(value: string,): void {
        setToDate(value);
        setForecast(null);
        setError('');
    }

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <div>
                    <h2>Dự báo doanh thu</h2>
                    <p>
                        Tổng hợp Expected Revenue của
                        các Deal đang mở trong kỳ.
                    </p>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <span>Từ ngày</span>
                    <input type="date" value={fromDate}
                        onChange={(event) => handleFromDateChange(event.target.value,)}
                    />
                </label>

                <label className={styles.field}>
                    <span>Đến ngày</span>
                    <input type="date" value={toDate}
                        onChange={(event) => handleToDateChange(event.target.value,)}
                    />
                </label>

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Đang tính...' : 'Xem dự báo'}
                </button>
            </form>

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {forecast && (
                <div className={styles.resultGrid}>
                    <ForecastStat
                        title="Deal đang mở trong kỳ"
                        value={forecast.totalOpenDeals}
                    />

                    <ForecastStat
                        title="Giá trị Pipeline"
                        value={formatCurrency(forecast.pipelineValue,)}
                    />

                    <ForecastStat
                        title="Doanh thu dự báo"
                        value={formatCurrency(forecast.forecastRevenue,)}
                    />
                </div>
            )}
        </section>
    );
}

interface ForecastStatProps {
    title: string;
    value: string | number;
}

function ForecastStat({ title, value, }: ForecastStatProps) {
    return (
        <article className={styles.stat}>
            <p className={styles.statTitle}>
                {title}
            </p>

            <strong className={styles.statValue}>
                {value}
            </strong>
        </article>
    );
}