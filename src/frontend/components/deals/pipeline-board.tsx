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

export default function PipelineBoard({token, deals, stages, onDealChanged,}: PipelineBoardProps) {
  const [movingDealId, setMovingDealId,] = useState<number | null>(null);

  const [error, setError,] = useState('');

  const [successMessage, setSuccessMessage,] = useState('');

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

    setMovingDealId(dealId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await changeDealStage(token, dealId, {stageId,},);

      onDealChanged(response.data,);

      setSuccessMessage(response.message,);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message,);
        return;
      }

      setError('Không thể thay đổi giai đoạn Deal.',);
    } finally {
      setMovingDealId(null);
    }
  }

  const orderedStages = [...stages].sort((left, right) => left.stageOrder - right.stageOrder,);

  return (
    <div>
      {error && (
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
              onDropDeal={(dealId, targetStageId,) => {void handleDropDeal(dealId, targetStageId,);}}
            />
          ),
        )}
      </div>
    </div>
  );
}