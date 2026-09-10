'use client';

import { useState, } from 'react';
import { changeDealStage, } from '../../modules/deals/deals.service';
import type { Deal, PipelineStageOption, } from '../../modules/deals/deals.types';
import { ApiError, } from '../../services/api';
import PipelineColumn from './pipeline-column';
import styles from './deals-page.module.css';

interface PipelineBoardProps {
  token: string;
  deals: Deal[];
  stages: PipelineStageOption[];
  onDealChanged: (deal: Deal,) => void;
}

function isTerminalStage(stageName: string,): boolean {
  const normalizedName = stageName.trim().toLowerCase();

  return (normalizedName === 'won' || normalizedName === 'lost');
}

export default function PipelineBoard({ token, deals, stages, onDealChanged, }: PipelineBoardProps) {
  const [movingDealId, setMovingDealId,] = useState<number | null>(null);

  const [pendingLostMove, setPendingLostMove,] = useState<{ dealId: number; stageId: number; } | null>(null);

  const [lostReason, setLostReason,] = useState('');

  const [error, setError,] = useState('');

  const [successMessage, setSuccessMessage,] = useState('');

  async function moveDeal(dealId: number, stageId: number, reason?: string,): Promise<boolean> {
    setMovingDealId(dealId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await changeDealStage(
        token,
        dealId,
        {
          stageId,
          ...(reason ? { lostReason: reason } : {}),
        },
      );
      onDealChanged(response.data);
      setSuccessMessage(response.message);
      return true;
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message);
        return false;
      }
      setError('Không thể thay đổi giai đoạn Deal.');
      return false;
    } finally {
      setMovingDealId(null);
    }
  }

  async function handleDropDeal(dealId: number, stageId: number,): Promise<void> {
    const currentDeal = deals.find((deal) => deal.dealId === dealId,);
    if (!currentDeal) {
      return;
    }
    if (currentDeal.stage.stageId === stageId) {
      return;
    }
    if (isTerminalStage(currentDeal.stage.stageName,)) {
      setError('Deal ở giai đoạn Thành công hoặc Thất bại không thể thay đổi.',);
      return;
    }

    const targetStage = stages.find((stage) => stage.stageId === stageId,);
    if (!targetStage) {
      setError('Không tìm thấy giai đoạn Pipeline.');
      return;
    }
    if (targetStage.stageName.trim().toLowerCase() === 'lost') {
      setPendingLostMove({ dealId, stageId, });
      setLostReason('');
      setError('');
      setSuccessMessage('');
      return;
    }
    await moveDeal(dealId, stageId);
  }

  async function handleConfirmLost(): Promise<void> {
    if (!pendingLostMove) {
      return;
    }
    const normalizedReason = lostReason.trim();
    if (!normalizedReason) {
      setError('Vui lòng nhập lý do thất bại.');
      return;
    }
    const { dealId, stageId } = pendingLostMove;
    const success = await moveDeal(dealId, stageId, normalizedReason,);
    if (!success) {
      return;
    }
    setPendingLostMove(null);
    setLostReason('');
  }

  function handleCancelLost(): void {
    setPendingLostMove(null);
    setLostReason('');
    setError('');
  }

  const orderedStages = [...stages].sort((left, right) => left.stageOrder - right.stageOrder,);
  return (
    <div>
      {pendingLostMove && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Chuyển Deal sang Thất bại</h2>

              <button type="button" className={styles.closeButton}
                disabled={movingDealId !== null}
                onClick={handleCancelLost} aria-label="Đóng"
              >
                ×
              </button>
            </div>
            <div className={styles.form}>
              <label htmlFor="lost-reason">
                Lý do thất bại

                <textarea id="lost-reason" value={lostReason}
                  maxLength={500} rows={4}
                  disabled={movingDealId !== null}
                  onChange={(event) => { setLostReason(event.target.value); }}
                  placeholder="Ví dụ: Khách hàng chọn đối thủ."
                />
              </label>

              {error && (
                <p className={styles.submitError}>
                  {error}
                </p>
              )}

              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryButton}
                  disabled={movingDealId !== null} onClick={handleCancelLost}
                >
                  Hủy
                </button>

                <button type="button" className={styles.primaryButton}
                  disabled={movingDealId !== null}
                  onClick={() => { void handleConfirmLost(); }}
                >
                  {movingDealId !== null ? 'Đang chuyển...' : 'Xác nhận thất bại'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!pendingLostMove && error && (
        <p className={styles.errorMessage}>
          {error}
        </p>
      )}

      {successMessage && (
        <p className={styles.successMessage}>
          {successMessage}
        </p>
      )}

      <div className={styles.pipelineBoard}>
        {orderedStages.map(
          (stage) => (
            <PipelineColumn key={stage.stageId}
              stage={stage}
              deals={deals.filter((deal) => deal.stage.stageId === stage.stageId,)}
              movingDealId={movingDealId}
              onDropDeal={(dealId, targetStageId,) => { void handleDropDeal(dealId, targetStageId,); }}
            />
          ),
        )}
      </div>
    </div>
  );
}