'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAccessToken, } from '../../modules/auth/auth.storage';
import { getLeads, convertLead, } from '../../modules/leads/leads.service';
import type { Lead } from '../../modules/leads/leads.types';
import { ApiError } from '../../services/api';
import styles from './sales-leads-page.module.css';
import SalesLeadDetailModal from './sales-lead-detail-modal';

export default function SalesLeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [convertingLeadId, setConvertingLeadId] = useState<number | null>(null);

  function handleViewLead(lead: Lead): void {
    setSelectedLead(lead);
  }

  function handleCloseLeadDetail(): void {
    setSelectedLead(null);
  }

  async function handleConvertLead(lead: Lead,): Promise<void> {
    const confirmed = window.confirm(
      `Bạn có chắc muốn chuyển Lead "${lead.fullName}" thành Customer không?`,
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
      setConvertingLeadId(lead.leadId);

      const response = await convertLead(accessToken, lead.leadId,);

      setLeads((currentLeads) =>
        currentLeads.map((currentLead) =>
          currentLead.leadId === lead.leadId ? { ...currentLead, status: 'Converted', } : currentLead,
        ),
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
          window.alert(caughtError.message);
          return;
        }

        window.alert(caughtError.message);
        return;
      }

      window.alert('Không thể chuyển Lead thành Customer.',);
    } finally {
      setConvertingLeadId(null);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadLeads(): Promise<void> {
      const accessToken = getAccessToken();

      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await getLeads(
          accessToken,
          {
            search: search || undefined,
            page: 1,
            limit: 20,
          },
        );

        if (isCancelled) {
          return;
        }

        setLeads(response.data);
      } catch (caughtError) {
        if (isCancelled) {
          return;
        }

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

        setError('Không thể tải danh sách Lead.',);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLeads();

    return () => { isCancelled = true; };
  }, [router, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>,): void {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  if (isLoading) {
    return (
      <p className={styles.state}>
        Đang tải danh sách Lead...
      </p>
    );
  }

  if (error) {
    return (
      <p className={styles.error}>
        {error}
      </p>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Quản lý Lead</h1>

          <p>
            Xem Lead và chuyển đổi Lead
            thành Customer.
          </p>
        </div>
      </header>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input type="search" value={searchInput}
          placeholder="Tìm theo tên, email, công ty..."
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <button type="submit">
          Tìm kiếm
        </button>
      </form>

      {leads.length === 0 ? (
        <p className={styles.state}>
          Không tìm thấy Lead phù hợp.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Công ty</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Nguồn</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead.leadId}>
                  <td>{lead.fullName}</td>

                  <td>
                    {lead.company ?? '—'}
                  </td>

                  <td>
                    {lead.email ?? '—'}
                  </td>

                  <td>
                    {lead.phone ?? '—'}
                  </td>

                  <td>
                    {lead.source?.sourceName ?? '—'}
                  </td>

                  <td>
                    <span className={styles.status}>
                      {lead.status ?? '—'}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button type="button" className={styles.detailButton}
                        onClick={() => handleViewLead(lead)}>
                        Chi tiết
                      </button>

                      {lead.status === 'Converted' ? (
                        <span className={styles.converted}>
                          Đã chuyển đổi
                        </span>
                      ) : (
                        <button type="button" className={styles.convertButton}
                          disabled={convertingLeadId === lead.leadId}
                          onClick={() => void handleConvertLead(lead)}
                        >
                          {convertingLeadId === lead.leadId ? 'Đang chuyển...' : 'Chuyển đổi'}
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
      {selectedLead && (
        <SalesLeadDetailModal lead={selectedLead} onClose={handleCloseLeadDetail} />
      )}
    </section>
  );
}