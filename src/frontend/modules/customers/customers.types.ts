export interface Customer {
  customerId: number;
  customerCode: string;
  leadId: number | null;
  fullName: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  customerType: string | null;
  createdAt: string | null;
}

export interface CustomersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomersResponse {
  data: Customer[];
  pagination: CustomersPagination;
}

export interface CustomerQuery {
  search?: string;
  customerType?: string;
  page?: number;
  limit?: number;
}

export interface UpdateCustomerInput {
  fullName?: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  customerType?: string | null;
}

export interface UpdateCustomerResponse {
  message: string;
  data: Customer;
}

export type CustomerPageMode = | 'sales'  | 'customer-care';