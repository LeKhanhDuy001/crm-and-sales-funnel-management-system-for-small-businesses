'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { assignLead, getLeadAssignmentMeta, getLeadAssignments, } from '../../modules/leads/lead-assignment.service';
import type { LeadAssignment, LeadAssignmentPagination, LeadAssignmentUser, } from '../../modules/leads/lead-assignment.types';
import { ApiError } from '../../services/api';
import LeadAssignmentModal from './lead-assignment-modal';
import styles from './lead-assignment-page.module.css';

const DEFAULT_PAGINATION:
    LeadAssignmentPagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
};

export default function LeadAssignmentPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<LeadAssignment[]>([]);
    const [assignees, setAssignees] = useState<LeadAssignmentUser[]>([]);
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput,] = useState('');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [assigningLead, setAssigningLead,] = useState<LeadAssignment | null>(null,);
    const [isSubmitting, setIsSubmitting,] = useState(false);
    const [refreshKey, setRefreshKey,] = useState(0);

    useEffect(() => {
        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        async function loadData(accessToken: string,): Promise<void> {
            try {
                const [leadsResponse, metaResponse,] = await Promise.all([
                    getLeadAssignments(
                        accessToken,
                        {
                            search: search || undefined,
                            page,
                            limit: 20,
                        },
                    ),

                    getLeadAssignmentMeta(accessToken,),
                ]);

                setLeads(leadsResponse.data,);
                setPagination(leadsResponse.pagination,);
                setAssignees(metaResponse.assignees,);
                setError('');
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
                setError('Không thể tải danh sách Lead.');
            } finally {
                setIsLoading(false);
            }
        }

        void loadData(token);
    }, [
        page,
        refreshKey,
        router,
        search,
    ]);

    function handleSearch(event: FormEvent<HTMLFormElement>,): void {
        event.preventDefault();
        setIsLoading(true);
        setPage(1);
        setSearch(searchInput.trim(),);
    }

    function changePage(nextPage: number,): void { setIsLoading(true); setPage(nextPage); }

    async function handleAssign(assignedUserId: number,): Promise<void> {
        if (!assigningLead) {
            return;
        }
        const token = getAccessToken();
        if (!token) {
            router.replace('/login');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await assignLead(
                token,
                assigningLead.leadId,
                {
                    assignedUserId,
                },
            );
            window.alert(response.message,);

            setAssigningLead(null);
            setIsLoading(true);

            setRefreshKey((value) => value + 1,);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message,);
            } else {
                window.alert('Không thể phân công Lead.',);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Quản lý Lead</h1>
                    <p>
                        Phân công Lead cho nhân viên
                        Sales phụ trách.
                    </p>
                </div>
            </div>

            <section className={styles.panel}>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <input value={searchInput}
                        placeholder="Tìm theo tên, email hoặc công ty..."
                        onChange={(event) => setSearchInput(event.target.value,)}
                    />

                    <button type="submit">
                        Tìm kiếm
                    </button>
                </form>

                {isLoading && (
                    <p>
                        Đang tải danh sách Lead...
                    </p>
                )}

                {!isLoading &&
                    error && (
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}

                {!isLoading && !error && leads.length === 0 && (
                    <p>
                        Không tìm thấy Lead.
                    </p>
                )}

                {!isLoading && !error && leads.length > 0 && (
                    <div className={styles.tableWrapper}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Họ tên</th>
                                    <th>Công ty</th>
                                    <th>Nguồn</th>
                                    <th>Trạng thái</th>
                                    <th>
                                        Người phụ trách
                                    </th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {leads.map(
                                    (lead) => (
                                        <tr key={lead.leadId}>
                                            <td>
                                                {
                                                    lead.leadCode
                                                }
                                            </td>
                                            <td>
                                                {
                                                    lead.fullName
                                                }
                                            </td>
                                            <td>
                                                {lead.company ??
                                                    '-'}
                                            </td>
                                            <td>
                                                {lead.sourceName ??
                                                    '-'}
                                            </td>
                                            <td>
                                                {lead.status ??
                                                    '-'}
                                            </td>
                                            <td>
                                                {lead.assignedUser?.fullName ?? 'Chưa phân công'}
                                            </td>

                                            <td>
                                                {lead.status === 'Converted' ? (
                                                    <span>
                                                        Đã chuyển đổi
                                                    </span>
                                                ) : (
                                                    <button type="button" className={styles.primaryButton}
                                                        onClick={() => setAssigningLead(lead,)}
                                                    >
                                                        {lead.assignedUser ? 'Đổi Sales' : 'Phân công'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading &&
                    pagination.totalPages >
                    1 && (
                        <div className={styles.pagination}>
                            <button type="button" disabled={pagination.page <= 1}
                                onClick={() => changePage(pagination.page - 1,)}
                            >
                                Trước
                            </button>

                            <span>
                                Trang{' '}
                                {pagination.page}
                                {' / '}
                                {pagination.totalPages}
                            </span>

                            <button type="button"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => changePage(pagination.page + 1,)}
                            >
                                Sau
                            </button>
                        </div>
                    )}
            </section>

            {assigningLead && (
                <LeadAssignmentModal
                    lead={assigningLead}
                    assignees={assignees}
                    isSubmitting={isSubmitting}
                    onClose={() => setAssigningLead(null)}
                    onSubmit={handleAssign}
                />
            )}
        </main>
    );
}