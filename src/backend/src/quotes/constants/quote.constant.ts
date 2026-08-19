export const QUOTE_ALLOWED_STAGE_NAMES = ['proposal', 'negotiation'] as const;

export const QUOTE_STATUS = {
  Draft: 'Draft',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
} as const;

export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS];
