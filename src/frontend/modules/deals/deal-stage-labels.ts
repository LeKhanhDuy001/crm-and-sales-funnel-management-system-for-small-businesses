const DEAL_STAGE_LABELS: Record<string, string> = {
  Lead: 'Tiếp cận',
  Qualified: 'Xác định nhu cầu',
  Proposal: 'Đề xuất báo giá',
  Negotiation: 'Đàm phán',
  Won: 'Thành công',
  Lost: 'Thất bại',
};

export function getDealStageLabel(stageName: string,): string {
  return DEAL_STAGE_LABELS[stageName] ?? stageName;
}