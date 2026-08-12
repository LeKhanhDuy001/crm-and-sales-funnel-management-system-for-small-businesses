'use client';

import { type FormEvent, useState, } from 'react';
import type { CreateLeadInput, Lead, LeadSource, } from '../../modules/leads/leads.types';

interface LeadFormModalProps {
    lead: Lead | null;
    sources: LeadSource[];
    isSubmitting: boolean;
    error: string;
    onClose: () => void;
    onSubmit: (input: CreateLeadInput,) => Promise<void>;
}

const LEAD_STATUSES = [
    { value: 'New', label: 'Mới', },
    { value: 'Contacted', label: 'Đã liên hệ', },
    { value: 'Qualified', label: 'Đủ điều kiện', },
    { value: 'Unqualified', label: 'Không phù hợp', },
    { value: 'Converted', label: 'Đã chuyển đổi', },
];

export default function LeadFormModal({ lead, sources, isSubmitting, error, onClose, onSubmit, }: LeadFormModalProps) {
    const [fullName, setFullName] = useState(lead?.fullName ?? '');

    const [company, setCompany] = useState(lead?.company ?? '');

    const [email, setEmail] = useState(lead?.email ?? '');

    const [phone, setPhone] = useState(lead?.phone ?? '');

    const [address, setAddress] = useState(lead?.address ?? '');

    const [status, setStatus] = useState(lead?.status ?? 'New');

    const [sourceId, setSourceId] = useState(lead?.source ? String(lead.source.sourceId) : '',);

    async function handleSubmit(event: FormEvent<HTMLFormElement>,): Promise<void> {
        event.preventDefault();

        if (!fullName.trim()) {
            return;
        }

        await onSubmit({
            fullName: fullName.trim(),

            company: company.trim() || undefined,

            email: email.trim() || undefined,

            phone: phone.trim() || undefined,

            address: address.trim() || undefined,

            status,

            sourceId: sourceId ? Number(sourceId) : undefined,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {lead ? 'Cập nhật Lead' : 'Thêm Lead'}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Nhập thông tin khách hàng
                            tiềm năng.
                        </p>
                    </div>

                    <button type="button" onClick={onClose} disabled={isSubmitting}
                        className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Đóng">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div>
                        <label htmlFor="lead-full-name"
                            className="mb-1.5 block text-sm font-medium text-slate-700">
                            Họ tên *
                        </label>

                        <input id="lead-full-name" value={fullName}
                            onChange={(event) => setFullName(event.target.value,)
                            }
                            required
                            maxLength={100}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="lead-company"
                            className="mb-1.5 block text-sm font-medium text-slate-700">
                            Công ty
                        </label>

                        <input id="lead-company" value={company}
                            onChange={(event) => setCompany(event.target.value,)}
                            maxLength={150}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-700" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Email
                            </label>

                            <input id="lead-email" type="email" value={email}
                                onChange={(event) => setEmail(event.target.value,)}
                                maxLength={100}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-700" />
                        </div>

                        <div>
                            <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                                Số điện thoại
                            </label>

                            <input id="lead-phone" value={phone}
                                onChange={(event) => setPhone(event.target.value,)}
                                maxLength={20}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-700" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="lead-address"
                            className="mb-1.5 block text-sm font-medium text-slate-700">
                            Địa chỉ
                        </label>

                        <input id="lead-address" value={address}
                            onChange={(event) => setAddress(event.target.value,)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-700" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="lead-source"
                                className="mb-1.5 block text-sm font-medium text-slate-700">
                                Nguồn
                            </label>

                            <select id="lead-source" value={sourceId}
                                onChange={(event) => setSourceId(event.target.value,)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                                <option value="">
                                    Chưa xác định
                                </option>

                                {sources.map(
                                    (source) => (
                                        <option key={source.sourceId} value={source.sourceId}>
                                            {source.sourceName}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="lead-status"
                                className="mb-1.5 block text-sm font-medium text-slate-700">
                                Trạng thái
                            </label>

                            <select id="lead-status" value={status}
                                onChange={(event) => setStatus(event.target.value,)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                                {LEAD_STATUSES.map(
                                    (item) => (<option key={item.value} value={item.value}> {item.label}
                                    </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium">
                            Hủy
                        </button>

                        <button type="submit" disabled={isSubmitting || !fullName.trim()}
                            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                            {isSubmitting ? 'Đang lưu...' : lead ? 'Lưu thay đổi' : 'Thêm Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}