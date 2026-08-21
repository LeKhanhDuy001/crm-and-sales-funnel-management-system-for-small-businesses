'use client';

import { type FormEvent, useState, } from 'react';
import type { LeadAssignment, LeadAssignmentUser, } from '../../modules/leads/lead-assignment.types';
import styles from './lead-assignment-page.module.css';

interface Props {
    lead: LeadAssignment;
    assignees: LeadAssignmentUser[];
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (assignedUserId: number,) => Promise<void>;
}

export default function LeadAssignmentModal({ lead, assignees, isSubmitting, onClose, onSubmit, }: Props) {
    const [assignedUserId, setAssignedUserId,] = useState(
        lead.assignedUser?.userId ??
        assignees[0]?.userId ??
        0,
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>,): void {
        event.preventDefault();
        if (!assignedUserId) {
            return;
        }
        void onSubmit(assignedUserId,);
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <div>
                        <h2>Phân công Lead</h2>
                        <p>
                            {lead.leadCode}
                            {' - '}
                            {lead.fullName}
                        </p>
                    </div>

                    <button type="button" onClick={onClose} disabled={isSubmitting}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="lead-assignee">
                        Nhân viên Sales *
                    </label>

                    <select id="lead-assignee" value={assignedUserId} required
                        disabled={isSubmitting} onChange={(event) => setAssignedUserId(Number(event.target.value,),)}
                    >
                        {assignees.map(
                            (sales) => (
                                <option key={sales.userId} value={sales.userId}>
                                    {sales.fullName}
                                    {' - '}
                                    {sales.email}
                                </option>
                            ),
                        )}
                    </select>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} disabled={isSubmitting}>
                            Hủy
                        </button>

                        <button type="submit" className={styles.primaryButton}
                            disabled={isSubmitting || !assignedUserId}
                        >
                            {isSubmitting ? 'Đang phân công...' : 'Phân công'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}