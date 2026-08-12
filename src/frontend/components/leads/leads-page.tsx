'use client';

import { type FormEvent, useCallback, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../layout/app-shell';
import { clearAuth, getAccessToken, getStoredUser, } from '../../modules/auth/auth.storage';
import { createLead, deleteLead, getLeads, getLeadSources, updateLead, } from '../../modules/leads/leads.service';
import type { CreateLeadInput, Lead, LeadSource, } from '../../modules/leads/leads.types';
import { ApiError } from '../../services/api';
import LeadDetailModal from './lead-detail-modal';
import LeadFormModal from './lead-form-modal';
import LeadTable from './lead-table';

export default function LeadsPage() {
    const router = useRouter();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [sources, setSources] = useState<LeadSource[]>([]);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sourceId, setSourceId] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const user = getStoredUser();
    const canManage = user?.role === 'Marketing';

    const handleApiError = useCallback(
        (caughtError: unknown) => {
            if (caughtError instanceof ApiError) {
                if (caughtError.statusCode === 401) {
                    clearAuth();
                    router.replace('/login');
                    return;
                }

                if (caughtError.statusCode === 403) {
                    router.replace('/unauthorized',);
                    return;
                }

                setError(caughtError.message,);
                return;
            }

            setError('Đã xảy ra lỗi khi tải danh sách Lead',);
        },
        [router],
    );

    const loadLeads = useCallback(
        async (): Promise<void> => {
            const accessToken = getAccessToken();

            if (!accessToken) {
                router.replace('/login');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const response = await getLeads(accessToken,
                    {
                        search: search || undefined,
                        status: status || undefined,
                        sourceId: sourceId ? Number(sourceId) : undefined,
                        page,
                        limit: pageSize,
                    },
                );

                setLeads(response.data);
                setTotal(response.total);
            } catch (caughtError) {
                handleApiError(caughtError);
            } finally {
                setIsLoading(false);
            }
        },
        [
            handleApiError,
            page,
            pageSize,
            router,
            search,
            sourceId,
            status,
        ],
    );

    useEffect(() => {
        const currentUser = getStoredUser();
        const accessToken = getAccessToken();

        if (!currentUser || !accessToken) {
            router.replace('/login');
            return;
        }

        if (currentUser.role !== 'Marketing' && currentUser.role !== 'Sales') {
            router.replace('/unauthorized');
            return;
        }

        let isCancelled = false;

        getLeads(accessToken, {
            search: search || undefined,
            status: status || undefined,
            sourceId: sourceId ? Number(sourceId) : undefined,
            page,
            limit: pageSize,
        })
            .then((response) => {
                if (isCancelled) {
                    return;
                }

                setLeads(response.data);
                setTotal(response.total);
                setError('');
            })
            .catch((caughtError: unknown) => {
                if (isCancelled) {
                    return;
                }

                handleApiError(caughtError);
            })
            .finally(() => {
                if (isCancelled) {
                    return;
                }

                setIsLoading(false);
            });

        return () => { isCancelled = true; };
    }, [
        handleApiError,
        page,
        pageSize,
        router,
        search,
        sourceId,
        status,
    ]);

    useEffect(() => {
        async function loadSources(): Promise<void> {
            const accessToken = getAccessToken();

            if (!accessToken) {
                return;
            }

            try {
                const result = await getLeadSources(accessToken,);
                setSources(result);
            } catch {
                setSources([]);
            }
        }

        void loadSources();
    }, []);

    function handleSearch(event: FormEvent<HTMLFormElement>,): void {
        event.preventDefault();

        setPage(1);
        setSearch(searchInput);
    }

    function openCreateForm(): void {
        setEditingLead(null);
        setFormError('');
        setIsFormOpen(true);
    }

    function openEditForm(lead: Lead,): void {
        setEditingLead(lead);
        setFormError('');
        setIsFormOpen(true);
    }

    async function handleSave(input: CreateLeadInput,): Promise<void> {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError('');

            if (editingLead) {
                await updateLead(
                    accessToken,
                    editingLead.leadId,
                    input,
                );
            } else {
                await createLead(accessToken, input,);
            }

            setIsFormOpen(false);
            setEditingLead(null);

            await loadLeads();
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                if (caughtError.statusCode === 401) {
                    clearAuth();
                    router.replace('/login');
                    return;
                }

                if (caughtError.statusCode === 403) {
                    router.replace('/unauthorized',);
                    return;
                }

                setFormError(caughtError.message,);
                return;
            }

            setFormError('Không thể lưu thông tin Lead',);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(lead: Lead,): Promise<void> {
        const shouldDelete = window.confirm(`Bạn có chắc muốn xóa Lead "${lead.fullName}"?`,);

        if (!shouldDelete) {
            return;
        }

        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        try {
            await deleteLead(accessToken, lead.leadId,);

            if (leads.length === 1 && page > 1) {
                setPage((currentPage) => currentPage - 1,);
                return;
            }

            await loadLeads();
        } catch (caughtError) {
            handleApiError(caughtError);
        }
    }

    const totalPages = Math.max(Math.ceil(total / pageSize), 1,
    );

    return (
        <AppShell title="Quản lý khách hàng tiềm năng"
            description="Theo dõi và quản lý toàn bộ khách hàng tiềm năng">
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Tổng Lead
                    </p>

                    <p className="mt-2 text-3xl font-bold">{total}</p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Trang hiện tại
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {page}/{totalPages}
                    </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Số Lead đang hiển thị
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {leads.length}
                    </p>
                </article>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <form onSubmit={handleSearch}
                            className="flex flex-1 flex-col gap-3 lg:flex-row">
                            <input type="search" value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value,)}
                                placeholder="Tìm theo tên, email, SĐT hoặc công ty..."
                                className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-600" />

                            <select value={status}
                                onChange={(event) => { setPage(1); setStatus(event.target.value,); }}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
                                <option value="">
                                    Tất cả trạng thái
                                </option>
                                <option value="New">
                                    Mới
                                </option>
                                <option value="Contacted">
                                    Đã liên hệ
                                </option>
                                <option value="Qualified">
                                    Đủ điều kiện
                                </option>
                                <option value="Unqualified">
                                    Không phù hợp
                                </option>
                                <option value="Converted">
                                    Đã chuyển đổi
                                </option>
                            </select>

                            <select value={sourceId} onChange={(event) => { setPage(1); setSourceId(event.target.value,); }}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
                                <option value="">
                                    Tất cả nguồn
                                </option>

                                {sources.map(
                                    (source) => (
                                        <option key={source.sourceId} value={source.sourceId}>
                                            {source.sourceName}
                                        </option>
                                    ),
                                )}
                            </select>

                            <button type="submit"
                                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium">
                                Tìm kiếm
                            </button>
                        </form>

                        {canManage && (
                            <button type="button" onClick={openCreateForm}
                                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
                                + Thêm Lead
                            </button>
                        )}
                    </div>
                </div>

                {isLoading && (
                    <div className="p-10 text-center text-slate-500">
                        Đang tải danh sách
                        Lead...
                    </div>
                )}

                {!isLoading && error && (
                    <div className="p-10 text-center">
                        <p className="text-red-600">
                            {error}
                        </p>

                        <button type="button" onClick={() => void loadLeads()}
                            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm">
                            Thử lại
                        </button>
                    </div>
                )}

                {!isLoading && !error && leads.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                        Không có Lead phù hợp.
                    </div>)}

                {!isLoading && !error && leads.length > 0 && (
                    <LeadTable
                        leads={leads}
                        canManage={canManage}
                        onView={setSelectedLead}
                        onEdit={openEditForm}
                        onDelete={(lead) => void handleDelete(lead,)
                        }
                    />
                )}

                {!isLoading && !error && total > 0 && (
                    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Tổng cộng {total}{' '}
                            Lead
                        </p>

                        <div className="flex items-center gap-2">
                            <button type="button" disabled={page <= 1}
                                onClick={() => setPage((current) => current - 1,)}
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
                            >
                                Trước
                            </button>

                            <span className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
                                {page} /{' '}
                                {totalPages}
                            </span>

                            <button type="button" disabled={page >= totalPages}
                                onClick={() => setPage((current) => current + 1,)}
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
                    onClose={() => {
                        if (isSubmitting) {
                            return;
                        }

                        setIsFormOpen(false);
                        setEditingLead(null);
                        setFormError('');
                    }}
                    onSubmit={handleSave}
                />
            )}

            <LeadDetailModal
                lead={selectedLead}
                onClose={() => { setSelectedLead(null); }}
            />

        </AppShell>
    );
}