'use client';

import { type FormEvent, useCallback, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, getStoredUser, } from '../../modules/auth/auth.storage';
import { createLead, deleteLead, getLeads, getLeadSources, updateLead, } from '../../modules/leads/leads.service';
import type { CreateLeadInput, Lead, LeadSource, } from '../../modules/leads/leads.types';
import { ApiError } from '../../services/api';
import LeadsPageContent from './leads-page-content';
import { handleLeadPageApiError } from './lead-page-errors';

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
        (caughtError: unknown): void => {
            handleLeadPageApiError(caughtError, router, setError);
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
    return (
        <LeadsPageContent
            state={{
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
            }}
            actions={{
                onSearch: handleSearch,
                onSearchInputChange: setSearchInput,
                onStatusChange: (value) => {
                    setPage(1);
                    setStatus(value);
                },
                onSourceChange: (value) => {
                    setPage(1);
                    setSourceId(value);
                },
                onCreate: openCreateForm,
                onRetry: () => {
                    void loadLeads();
                },
                onView: setSelectedLead,
                onEdit: openEditForm,
                onDelete: (lead) => {
                    void handleDelete(lead);
                },
                onPageChange: setPage,
                onFormClose: () => {
                    if (isSubmitting) {
                        return;
                    }

                    setIsFormOpen(false);
                    setEditingLead(null);
                    setFormError('');
                },
                onFormSubmit: handleSave,
                onDetailClose: () => setSelectedLead(null),
            }}
        />
    );
}