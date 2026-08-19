'use client';

import { useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, } from '../../modules/auth/auth.storage';
import { cancelQuote, confirmQuote, createQuote, getQuoteMeta, getQuotes, updateQuote, } from '../../modules/quotes/quotes.service';
import type { CreateQuoteInput, Quote, QuoteInputItem, QuoteMetaDeal, QuoteMetaProduct, } from '../../modules/quotes/quotes.types';
import QuoteCreateModal from './quote-create-modal';
import QuoteDetailModal from './quote-detail-modal';
import QuoteEditModal from './quote-edit-modal';
import styles from './quotes-page.module.css';
import QuotesContent from './quotes-content';
import { handleLoadError, showMutationError, } from './quote-error';

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [deals, setDeals] = useState<QuoteMetaDeal[]>([]);
  const [products, setProducts] = useState<QuoteMetaProduct[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate,] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    async function loadQuotes(): Promise<void> {
      const token = getAccessToken();

      if (!token) {
        router.replace('/login');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const [quoteData, metaData] = await Promise.all([getQuotes(token), getQuoteMeta(token),]);

        setQuotes(quoteData);
        setDeals(metaData.deals);
        setProducts(metaData.products);
      } catch (caughtError) {
        handleLoadError(caughtError, router, setError,);
      } finally {
        setIsLoading(false);
      }
    }

    void loadQuotes();
  }, [refreshKey, router]);

  async function changeStatus(quote: Quote, action: 'confirm' | 'cancel',): Promise<void> {
    const token = getAccessToken();

    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const response = action === 'confirm' ? await confirmQuote(token, quote.quoteId,) : await cancelQuote(token, quote.quoteId,);

      window.alert(response.message);

      refreshQuotes();
    } catch (caughtError) {
      showMutationError(caughtError, 'Không thể cập nhật báo giá.',);
    }
  }

  async function handleUpdateQuote(items: QuoteInputItem[],): Promise<void> {
    if (!editingQuote) {
      return;
    }

    const token = getAccessToken();

    if (!token) {
      router.replace('/login');
      return;
    }

    setIsSubmittingEdit(true);

    try {
      const response = await updateQuote(token, editingQuote.quoteId, { items },);

      window.alert(response.message);
      setEditingQuote(null);
      refreshQuotes();
    } catch (caughtError) {
      showMutationError(caughtError, 'Không thể cập nhật báo giá.',);
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  async function handleCreateQuote(input: CreateQuoteInput,): Promise<void> {
    const token = getAccessToken();

    if (!token) {
      router.replace('/login');
      return;
    }

    setIsSubmittingCreate(true);

    try {
      const response = await createQuote(token, input,);

      window.alert(response.message);
      setIsCreateOpen(false);
      refreshQuotes();
    } catch (caughtError) {
      showMutationError(caughtError, 'Không thể tạo báo giá.',);
    } finally {
      setIsSubmittingCreate(false);
    }
  }

  function refreshQuotes(): void {
    setRefreshKey((value) => value + 1,);
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Quản lý báo giá</h1>

          <p>
            Quản lý báo giá của các Deal
            bạn đang phụ trách.
          </p>
        </div>

        <button type="button" className={styles.primaryButton}
          onClick={() => setIsCreateOpen(true)}
        >
          + Tạo báo giá
        </button>
      </div>

      <section className={styles.panel}>
        <QuotesContent
          quotes={quotes}
          isLoading={isLoading}
          error={error}
          onView={setSelectedQuote}
          onEdit={setEditingQuote}
          onConfirm={(quote) => {
            if (window.confirm(`Xác nhận ${quote.quoteCode}? Sau khi xác nhận sẽ không thể chỉnh sửa.`,)) {
              void changeStatus(quote, 'confirm',);
            }
          }}
          onDelete={(quote) => {
            if (window.confirm(`Bạn có chắc muốn xóa ${quote.quoteCode}? Báo giá sẽ được chuyển sang trạng thái Đã hủy.`,)) {
              void changeStatus(quote, 'cancel',);
            }
          }}
        />
      </section>

      {selectedQuote && (
        <QuoteDetailModal quote={selectedQuote}
          onClose={() => setSelectedQuote(null)
          }
        />
      )}

      {editingQuote && (
        <QuoteEditModal
          key={editingQuote.quoteId}
          quote={editingQuote}
          products={products}
          isSubmitting={isSubmittingEdit}
          onClose={() => setEditingQuote(null)}
          onSubmit={handleUpdateQuote}
        />
      )}

      {isCreateOpen && (
        <QuoteCreateModal
          deals={deals}
          products={products}
          isSubmitting={isSubmittingCreate}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateQuote}
        />
      )}
    </main>
  );
}