import type {CreateUserInput, UpdateUserInput,} from '../../modules/users/users.types';

export interface UserFieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  roleId?: string;
}

function isValidEmail(email: string,): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email,);
}

export function validateCreateUser(input: CreateUserInput,): UserFieldErrors {
  const errors: UserFieldErrors = {};

  const fullName = input.fullName.trim();

  const email = input.email.trim();

  const phone = input.phone?.trim() ?? '';

  if (!fullName) {
    errors.fullName = 'Họ tên không được để trống.';
  } else if (fullName.length > 100) {
    errors.fullName = 'Họ tên không được vượt quá 100 ký tự.';
  }

  if (!email) {
    errors.email = 'Email không được để trống.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email không đúng định dạng.';
  } else if (email.length > 100) {
    errors.email = 'Email không được vượt quá 100 ký tự.';
  }

  if (phone.length > 20) {
    errors.phone = 'Số điện thoại không được vượt quá 20 ký tự.';
  }

  if (!input.password) {
    errors.password = 'Mật khẩu không được để trống.';
  } else if (input.password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
  }

  if (!Number.isInteger(input.roleId) || input.roleId < 1) {
    errors.roleId = 'Vui lòng chọn vai trò.';
  }

  return errors;
}

export function validateUpdateUser(input: UpdateUserInput,): UserFieldErrors {
  const errors: UserFieldErrors = {};

  const fullName = input.fullName?.trim() ?? '';

  const email = input.email?.trim() ?? '';

  const phone = input.phone?.trim() ?? '';

  if (!fullName) {
    errors.fullName = 'Họ tên không được để trống.';
  } else if (fullName.length > 100) {
    errors.fullName = 'Họ tên không được vượt quá 100 ký tự.';
  }

  if (!email) {
    errors.email = 'Email không được để trống.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email không đúng định dạng.';
  } else if (email.length > 100) {
    errors.email = 'Email không được vượt quá 100 ký tự.';
  }

  if (phone.length > 20) {
    errors.phone = 'Số điện thoại không được vượt quá 20 ký tự.';
  }

  if (input.roleId === undefined || !Number.isInteger(input.roleId) || input.roleId < 1) {
    errors.roleId = 'Vui lòng chọn vai trò.';
  }

  return errors;
}

export function hasFieldErrors(errors: UserFieldErrors,): boolean {
  return Object.keys(errors).length > 0;
}