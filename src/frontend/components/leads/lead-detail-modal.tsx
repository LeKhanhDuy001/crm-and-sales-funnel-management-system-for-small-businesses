'use client';

import type { Lead } from '../../modules/leads/leads.types';

interface LeadDetailModalProps {lead: Lead | null; onClose: () => void;}

function formatDate(value: string | null,): string {
  if (!value) {
    return 'Không xác định';
  }

  return new Date(value).toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh',},);
}

function getStatusLabel(status: string | null,): string {
  switch (status) {
    case 'New':
      return 'Mới';
    case 'Contacted':
      return 'Đã liên hệ';
    case 'Qualified':
      return 'Đủ điều kiện';
    case 'Unqualified':
      return 'Không phù hợp';
    case 'Converted':
      return 'Đã chuyển đổi';
    default:
      return status ?? 'Chưa xác định';
  }
}

export default function LeadDetailModal({lead, onClose,}: LeadDetailModalProps) {
  if (!lead) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold">
            Chi tiết Lead
          </h2>

          <button type="button" onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
            aria-label="Đóng">
            ×
          </button>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Detail label="Họ tên" value={lead.fullName}/>

          <Detail label="Công ty" value={lead.company}/>

          <Detail label="Email" value={lead.email}/>

          <Detail label="Số điện thoại" value={lead.phone}/>

          <Detail label="Nguồn" value={lead.source?.sourceName}/>

          <Detail label="Trạng thái"  value={getStatusLabel(lead.status,)}/>

          <Detail label="Người phụ trách" value={lead.assignedUser ?.fullName}
          />

          <Detail label="Ngày tạo" value={formatDate(lead.createdDate,)}/>

          <div className="sm:col-span-2">
            <Detail label="Địa chỉ" value={lead.address}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({label, value,}: {label: string; value: string | null | undefined;}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-900">
        {value ||
          'Chưa có thông tin'}
      </p>
    </div>
  );
}