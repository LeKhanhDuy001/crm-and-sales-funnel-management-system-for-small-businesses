export const DEAL_STATUS = {
  OPEN: 'Open',
  WON: 'Won',
  LOST: 'Lost',
} as const;

export type DealStatus = (typeof DEAL_STATUS)[keyof typeof DEAL_STATUS];

export function getDealStatusByStage(stageName: string): DealStatus {
  const normalizedStage = stageName.trim().toLowerCase();

  if (normalizedStage === 'won') {
    return DEAL_STATUS.WON;
  }

  if (normalizedStage === 'lost') {
    return DEAL_STATUS.LOST;
  }

  return DEAL_STATUS.OPEN;
}
