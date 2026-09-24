'use client';

import type { Lead } from '../../modules/leads/leads.types';

interface LeadTableProps {
    leads: Lead[];
    canManage: boolean;
    onView: (lead: Lead) => void;
    onEdit: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    onConvert?: (lead: Lead) => void;
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

function getStatusStyle(status: string | null,): string {
    switch (status) {
        case 'New':
            return 'bg-slate-100 text-slate-700';
        case 'Contacted':
            return 'bg-blue-50 text-blue-700';
        case 'Qualified':
            return 'bg-emerald-50 text-emerald-700';
        case 'Unqualified':
            return 'bg-red-50 text-red-700';
        case 'Converted':
            return 'bg-violet-50 text-violet-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
}

function getInitials(fullName: string,): string {
    return fullName.trim().split(/\s+/).slice(-2).map((word) => word.charAt(0),).join('').toUpperCase();
}

export default function LeadTable({ leads, canManage, onView, onEdit, onDelete, onConvert, }: LeadTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-4">Khách hàng tiềm năng</th>

                        <th className="px-5 py-4">Liên hệ</th>

                        <th className="px-5 py-4">Nguồn</th>

                        <th className="px-5 py-4">Nhân viên phụ trách</th>

                        <th className="px-5 py-4">Trạng thái</th>

                        <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                    {leads.map((lead) => (
                        <tr key={lead.leadId} className="hover:bg-slate-50">
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
                                        {getInitials(lead.fullName,)}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {lead.fullName}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            LD
                                            {String(lead.leadId,).padStart(3, '0',)}
                                            {' · '}
                                            {lead.company ?? 'Không có công ty'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-5 py-4">
                                <p className="text-sm">
                                    {lead.email ?? 'Chưa có email'}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {lead.phone ?? 'Chưa có SĐT'}
                                </p>
                            </td>

                            <td className="px-5 py-4 text-sm">
                                {lead.source?.sourceName ?? 'Không xác định'}
                            </td>

                            <td className="px-5 py-4 text-sm">
                                {lead.assignedUser?.fullName ?? 'Chưa phân công'}
                            </td>

                            <td className="px-5 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(lead.status,)}`}>
                                    {getStatusLabel(lead.status,)}
                                </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                                <button type="button" onClick={() => onView(lead)}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
                                    Chi tiết
                                </button>

                                {onConvert && lead.status !== 'Converted' && (
                                    <button type="button" onClick={() => onConvert(lead)}
                                        className="ml-2 rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700">
                                        Chuyển đổi
                                    </button>
                                )}

                                {canManage && lead.status !== 'Converted' && (
                                    <>
                                        <button type="button" onClick={() => onEdit(lead)}
                                            className="ml-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm">
                                            Sửa
                                        </button>

                                        <button type="button" onClick={() => onDelete(lead)}
                                            className="ml-2 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600">
                                            Xóa
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}