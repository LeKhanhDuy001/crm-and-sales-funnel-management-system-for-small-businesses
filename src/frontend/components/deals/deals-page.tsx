'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getCustomers } from '../../modules/customers/customers.service';
import type { Customer } from '../../modules/customers/customers.types';
import { assignDeal, deleteDeal, getDealMeta, getDeals, } from '../../modules/deals/deals.service';
import type { Deal, DealPagination, PipelineStageOption, DealSalesUserOption, } from '../../modules/deals/deals.types';
import { ApiError } from '../../services/api';
import DealsPageContent, { type DealViewMode } from './deals-page-content';

const DEFAULT_PAGINATION: DealPagination = { page: 1, limit: 20, total: 0, totalPages: 0, };

interface DealsPageProps {
    mode?: 'sales' | 'manager';
}

export default function DealsPage({ mode = 'sales', }: DealsPageProps) {
    const router = useRouter();
    const isManager = mode === 'manager';

    const [deals, setDeals] = useState<Deal[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stages, setStages] = useState<PipelineStageOption[]>([]);
    const [salesUsers, setSalesUsers] = useState<DealSalesUserOption[]>([]);
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [viewMode, setViewMode,] = useState<DealViewMode>('list',);
    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateOpen, setIsCreateOpen,] = useState(false);

    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

    const [assigningDeal, setAssigningDeal] = useState<Deal | null>(null);

    const [isAssigning, setIsAssigning] = useState(false);

    const [assignError, setAssignError] = useState('');

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        async function loadData(): Promise<void> {
            const token = getAccessToken();

            if (!token) {
                router.replace('/login');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const [
                    dealsResponse,
                    metaResponse,
                    customersResponse,
                ] = await Promise.all([
                    getDeals(token, {
                        search: search || undefined,
                        stageId: viewMode === 'list' && stageFilter ? Number(stageFilter) : undefined,
                        page: viewMode === 'pipeline' ? 1 : page,
                        limit: viewMode === 'pipeline' ? 100 : 20,
                    }),
                    getDealMeta(token),
                    getCustomers(token, { page: 1, limit: 100, }),
                ]);

                setDeals(dealsResponse.data,);
                setPagination(dealsResponse.pagination,);
                setStages(metaResponse.stages,);
                setSalesUsers(metaResponse.salesUsers ?? []);
                setCustomers(customersResponse.data,);
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

                    setError(caughtError.message,);
                    return;
                }

                setError('Không thể tải danh sách Deal.',);
            } finally {
                setIsLoading(false);
            }
        }

        void loadData();
    }, [
        page,
        refreshKey,
        router,
        search,
        stageFilter,
        viewMode,
    ]);

    function handleSearch(event: FormEvent<HTMLFormElement>,): void {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    }

    async function handleDelete(deal: Deal,): Promise<void> {
        const confirmed = window.confirm(`Bạn có chắc muốn xóa ${deal.dealCode} - ${deal.dealName}?`,);

        if (!confirmed) {
            return;
        }

        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        try {
            await deleteDeal(token, deal.dealId,);

            window.alert('Xóa Deal thành công.',);

            setRefreshKey((value) => value + 1,);
        } catch (caughtError) {
            if (caughtError instanceof ApiError) {
                window.alert(caughtError.message,);
                return;
            }

            window.alert('Không thể xóa Deal.',);
        }
    }

    async function handleAssign(assignedUserId: number,): Promise<void> {
        if (!assigningDeal) {
            return;
        }

        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        try {
            setIsAssigning(true);
            setAssignError('');

            const response = await assignDeal(
                token,
                assigningDeal.dealId,
                {
                    assignedUserId,
                },
            );

            window.alert(response.message);

            setAssigningDeal(null);

            setRefreshKey((value) => value + 1,);
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

                setAssignError(caughtError.message);
                return;
            }

            setAssignError('Không thể phân công Deal.',);
        } finally {
            setIsAssigning(false);
        }
    }

    function handleDealChanged(updatedDeal: Deal,): void {
        setDeals((currentDeals) =>
            currentDeals.map((deal) =>
                deal.dealId === updatedDeal.dealId ? updatedDeal : deal,
            ),
        );

        setSelectedDeal(
            (currentDeal) => currentDeal?.dealId === updatedDeal.dealId ? updatedDeal : currentDeal,
        );

        setEditingDeal(
            (currentDeal) => currentDeal?.dealId === updatedDeal.dealId ? updatedDeal : currentDeal,
        );
    }

    const token = getAccessToken();

    return (
        <DealsPageContent
            state={{
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
            }}
            actions={{
                onSearch: handleSearch,
                onSearchInputChange: setSearchInput,
                onCreateOpen: () => setIsCreateOpen(true),
                onViewModeChange: (nextViewMode) => {
                    setViewMode(nextViewMode);
                    setPage(1);
                },
                onStageFilterChange: (value) => {
                    setPage(1);
                    setStageFilter(value);
                },
                onView: setSelectedDeal,
                onEdit: setEditingDeal,
                onDelete: (deal) => {
                    void handleDelete(deal);
                },
                onAssignOpen: (deal) => {
                    setAssignError('');
                    setAssigningDeal(deal);
                },
                onPageChange: setPage,
                onDealChanged: handleDealChanged,
                onCreateClose: () => setIsCreateOpen(false),
                onCreateSuccess: () => {
                    setIsCreateOpen(false);
                    setRefreshKey((value) => value + 1);
                },
                onDetailClose: () => setSelectedDeal(null),
                onEditClose: () => setEditingDeal(null),
                onEditSuccess: () => {
                    setEditingDeal(null);
                    setRefreshKey((value) => value + 1);
                },
                onAssignClose: () => {
                    if (isAssigning) {
                        return;
                    }

                    setAssignError('');
                    setAssigningDeal(null);
                },
                onAssignSubmit: (assignedUserId) => {
                    void handleAssign(assignedUserId);
                },
            }}
        />
    );
}