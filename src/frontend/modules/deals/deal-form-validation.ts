export interface DealFormValues {
    customerId: string;
    stageId: string;
    dealName: string;
    dealValue: string;
    expectedCloseDate: string;
}

export interface DealFormErrors {
    customerId?: string;
    stageId?: string;
    dealName?: string;
    dealValue?: string;
    expectedCloseDate?: string;
}

export function getTodayDateString(): string {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');
}

export function validateDealForm(values: DealFormValues, requireStage: boolean,): DealFormErrors {
    const errors: DealFormErrors = {};

    if (!values.customerId) {
        errors.customerId = 'Vui lòng chọn Customer.';
    }

    if (requireStage && !values.stageId) {
        errors.stageId = 'Vui lòng chọn giai đoạn Pipeline.';
    }

    const dealName = values.dealName.trim();

    if (!dealName) {
        errors.dealName = 'Tên Deal không được để trống.';
    } else if (dealName.length > 200) {
        errors.dealName = 'Tên Deal không được vượt quá 200 ký tự.';
    }

    if (!values.dealValue.trim()) {
        errors.dealValue = 'Giá trị Deal không được để trống.';
    } else {
        const dealValue = Number(values.dealValue);

        if (Number.isNaN(dealValue)) {
            errors.dealValue = 'Giá trị Deal phải là số.';
        } else if (dealValue <= 0) {
            errors.dealValue = 'Giá trị Deal phải lớn hơn 0.';
        }
    }

    if (values.expectedCloseDate && values.expectedCloseDate < getTodayDateString()) {
        errors.expectedCloseDate = 'Ngày dự kiến đóng không được nhỏ hơn ngày hiện tại.';
    }

    return errors;
}