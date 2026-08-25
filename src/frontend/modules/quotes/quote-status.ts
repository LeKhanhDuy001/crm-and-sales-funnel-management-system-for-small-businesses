export function getQuoteStatusLabel(status: string | null,): string {
  switch (status) {
    case 'Draft':
      return 'Bản nháp';
    case 'Confirmed':
      return 'Đã xác nhận';
    case 'Cancelled':
      return 'Đã hủy';
    default:
      return status ?? 'Không xác định';
  }
}

export function canEditQuote(status: string | null,): boolean {
  return status === 'Draft';
}