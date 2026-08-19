'use client';

import { type DragEvent, useState, } from 'react';
import type { Deal, PipelineStageOption, } from '../../modules/deals/deals.types';
import { getDealStageLabel, } from '../../modules/deals/deal-stage-labels';
import PipelineDealCard from './pipeline-deal-card';
import styles from './deals-page.module.css';

interface PipelineColumnProps {
  stage: PipelineStageOption;
  deals: Deal[];
  movingDealId: number | null;
  onDropDeal: (dealId: number, stageId: number,) => void;
}

export default function PipelineColumn({
  stage,
  deals,
  movingDealId,
  onDropDeal,
}: PipelineColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>,): void {
    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';

    setIsDragOver(true);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>,): void {
    event.preventDefault();
    setIsDragOver(false);

    const rawDealId = event.dataTransfer.getData('text/plain',);

    const dealId = Number(rawDealId);

    if (!Number.isInteger(dealId) || dealId < 1) {
      return;
    }

    onDropDeal(dealId, stage.stageId,);
  }

  return (
    <section className={[
        styles.pipelineColumn,
        isDragOver ? styles.pipelineColumnDragOver : '',
      ].join(' ')}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className={styles.pipelineColumnHeader}>
        <div>
          <h3>
            {getDealStageLabel(stage.stageName,)}
          </h3>

          <span>
            {stage.probability ?? 0}%
          </span>
        </div>

        <strong className={styles.pipelineCount}>
          {deals.length}
        </strong>
      </div>

      <div className={styles.pipelineCards}>
        {deals.length === 0 && (
          <p className={styles.pipelineEmpty}>
            Thả Deal vào đây
          </p>
        )}

        {deals.map((deal) => (
          <PipelineDealCard
            key={deal.dealId}
            deal={deal}
            isMoving={movingDealId === deal.dealId}
          />
        ))}
      </div>
    </section>
  );
}