'use client';

import type { DragEvent, } from 'react';
import type { Deal, } from '../../modules/deals/deals.types';
import styles from './deals-page.module.css';

interface PipelineDealCardProps {
  deal: Deal;
  isMoving: boolean;
}

function isTerminalDeal(deal: Deal,): boolean {
  const stageName = deal.stage.stageName.trim().toLowerCase();

  return (stageName === 'won' || stageName === 'lost');
}

export default function PipelineDealCard({deal, isMoving,}: PipelineDealCardProps) {
  const isLocked = isTerminalDeal(deal);

  function handleDragStart(event: DragEvent<HTMLElement>,): void {
    if (isLocked || isMoving) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = 'move';

    event.dataTransfer.setData('text/plain', String(deal.dealId),);
  }

  return (
    <article
      className={[
        styles.pipelineCard,
        isLocked ? styles.pipelineCardLocked : '',
        isMoving ? styles.pipelineCardMoving : '',
      ].join(' ')}
      draggable={!isLocked && !isMoving}
      onDragStart={handleDragStart}
    >
      <div className={styles.pipelineCardHeader}>
        <strong>
          {deal.dealCode}
        </strong>

        <span>
          {deal.probability ?? 0}%
        </span>
      </div>

      <h4>
        {deal.dealName}
      </h4>

      <p className={styles.pipelineCustomer}>
        {deal.customer.fullName}
      </p>

      {deal.customer.company && (
        <p className={styles.pipelineCompany}>
          {deal.customer.company}
        </p>
      )}

      <div className={styles.pipelineCardValues}>
        <span>
          Giá trị
        </span>

        <strong>
          {deal.dealValue.toLocaleString(
            'vi-VN',
          )}{' '}
          đ
        </strong>

        <span>
          Doanh thu kỳ vọng
        </span>

        <strong>
          {(deal.expectedRevenue ?? 0).toLocaleString('vi-VN',)}{' '}
          đ
        </strong>
      </div>

      {isLocked && (
        <p className={styles.pipelineLockedText}>
          Giai đoạn kết thúc
        </p>
      )}
    </article>
  );
}