import type { UpdateCustomerInput, } from './customers.types';

export interface CustomerFieldErrors {
    fullName?: string;
    company?: string;
    phone?: string;
    email?: string;
    customerType?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCustomerForm(input: UpdateCustomerInput,): CustomerFieldErrors {
    const errors: CustomerFieldErrors = {};

    const fullName = input.fullName?.trim() ?? '';

    if (!fullName) {
        errors.fullName = 'Vui lòng nhập họ tên.';
    }
    else if (fullName.length > 100) {
        errors.fullName = 'Họ tên tối đa 100 ký tự.';
    }

    if (input.company && input.company.trim().length > 150) {
        errors.company = 'Tên công ty tối đa 150 ký tự.';
    }

    if (input.phone && input.phone.trim().length > 20) {
        errors.phone = 'Số điện thoại tối đa 20 ký tự.';
    }

    if (input.email?.trim()) {
        if (input.email.trim().length > 100) {
            errors.email = 'Email tối đa 100 ký tự.';
        }
        else if (!EMAIL_PATTERN.test(input.email.trim(),)) {
            errors.email = 'Email không đúng định dạng.';
        }
    }

    if (input.customerType && input.customerType.trim().length > 50) {
        errors.customerType = 'Loại khách hàng tối đa 50 ký tự.';
    }

    return errors;
}