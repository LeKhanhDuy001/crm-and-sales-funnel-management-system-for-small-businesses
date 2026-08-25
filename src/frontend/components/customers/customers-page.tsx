'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getCustomerById, getCustomers, updateCustomer, } from '../../modules/customers/customers.service';
import type { Customer, CustomerPageMode, CustomersPagination, UpdateCustomerInput, } from '../../modules/customers/customers.types';
import { ApiError } from '../../services/api';
import CustomerDetailModal from './customer-detail-modal';
import CustomerFilters from './customer-filters';
import CustomerPagination from './customer-pagination';
import CustomersTable from './customers-table';
import EditCustomerModal from './edit-customer-modal';
import styles from './customers-page.module.css';

const DEFAULT_PAGINATION:
    CustomersPagination = { page: 1, limit: 20, total: 0, totalPages: 0, };

interface Props {
    mode: CustomerPageMode;
}

export default function CustomersPage({ mode, }: Props) {
    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

    const [searchInput, setSearchInput] = useState('');

    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);

    const [refreshKey, setRefreshKey] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState('');

    const [selectedCustomer, setSelectedCustomer,] =
        useState<Customer | null>(null,);

    const [editingCustomer, setEditingCustomer,] =
        useState<Customer | null>(null,);

    useEffect(() => {
        void loadCustomers(
            page,
            search,
            router,
            setCustomers,
            setPagination,
            setError,
            setIsLoading,
        );
    }, [
        page,
        refreshKey,
        router,
        search,
    ]);

    function handleSearch(event: FormEvent<HTMLFormElement>,): void {
        event.preventDefault();

        setPage(1);
        setSearch(searchInput.trim(),);
    }

    async function handleView(customerId: number,): Promise<void> {
        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        try {
            const customer = await getCustomerById(token, customerId,);

            setSelectedCustomer(customer,);
        } catch (caughtError) {
            window.alert(getErrorMessage(caughtError, 'Không thể tải Customer.',),);
        }
    }

    async function handleUpdate(customerId: number, input: UpdateCustomerInput,): Promise<string | null> {
        const token = getAccessToken();

        if (!token) {
            router.replace('/login');
            return null;
        }

        try {
            setIsSaving(true);

            const response = await updateCustomer(token, customerId, input,);

            window.alert(response.message,);

            setEditingCustomer(null);

            setRefreshKey((current) => current + 1,);

            return null;
        } catch (caughtError) {
            return getErrorMessage(caughtError, 'Không thể cập nhật Customer.',);
        } finally {
            setIsSaving(false);
        }
    }

    const title = mode === 'sales' ? 'Khách hàng của tôi' : 'Quản lý khách hàng';

    const description =
        mode === 'sales'
            ? 'Theo dõi các Customer liên quan đến Lead hoặc Deal bạn phụ trách.'
            : 'Theo dõi và cập nhật thông tin Customer phục vụ công tác chăm sóc khách hàng.';

    return (
        <main className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </header>

            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <h2>
                            Danh sách Customer
                        </h2>

                        <p>
                            Tổng cộng{' '}{pagination.total}{' '}khách hàng
                        </p>
                    </div>
                </div>

                <CustomerFilters searchInput={searchInput}
                    onSearchInputChange={setSearchInput}
                    onSearch={handleSearch}
                />

                {isLoading ? (
                    <p className={styles.empty}>
                        Đang tải danh sách Customer...
                    </p>
                ) : error ? (
                    <p className={styles.error}>
                        {error}
                    </p>
                ) : customers.length === 0 ? (
                    <p className={styles.empty}>
                        Không tìm thấy Customer phù hợp.
                    </p>
                ) : (
                    <>
                        <CustomersTable customers={customers} mode={mode}
                            onView={(customerId) => { void handleView(customerId,); }}
                            onEdit={setEditingCustomer}
                        />

                        <CustomerPagination pagination={pagination} onPageChange={setPage} />
                    </>
                )}
            </section>

            <CustomerDetailModal customer={selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
            />

            {editingCustomer && (
                <EditCustomerModal
                    key={editingCustomer.customerId}
                    customer={editingCustomer}
                    isSaving={isSaving}
                    onClose={() => setEditingCustomer(null)}
                    onSubmit={handleUpdate}
                />
            )}
        </main>
    );
}

async function loadCustomers(
    page: number, 
    search: string, 
    router: ReturnType<typeof useRouter>,
    setCustomers: (value: Customer[]) => void,
    setPagination:(value: CustomersPagination,) => void,
    setError: (value: string) => void,
    setIsLoading: (value: boolean) => void,
): Promise<void> {
    const token = getAccessToken();

    if (!token) {
        router.replace('/login');
        return;
    }

    try {
        setIsLoading(true);
        setError('');

        const response = await getCustomers(
                token,
                {
                    search: search || undefined,
                    page,
                    limit: 20,
                },
            );

        setCustomers(response.data);

        setPagination(response.pagination,);
    } catch (caughtError) {
        handleLoadError(caughtError, router, setError,);
    } finally {
        setIsLoading(false);
    }
}

function handleLoadError( error: unknown, router: ReturnType<typeof useRouter>, setError:(value: string) => void,): void {
    if (error instanceof ApiError) {
        if (error.statusCode === 401) {
            clearAuth();
            router.replace('/login');
            return;
        }

        if (error.statusCode === 403) {
            router.replace('/unauthorized',);
            return;
        }

        setError(error.message);
        return;
    }

    setError('Không thể tải danh sách Customer.',);
}

function getErrorMessage(error: unknown, fallback: string,): string {
    if (error instanceof ApiError) {
        return error.message;
    }
    return fallback;
}