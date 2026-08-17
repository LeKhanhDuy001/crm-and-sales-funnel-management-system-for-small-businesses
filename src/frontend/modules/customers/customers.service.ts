import { apiRequest } from '../../services/api';
import type { Customer, CustomerQuery, CustomersResponse, UpdateCustomerInput, UpdateCustomerResponse, } from './customers.types';

function buildQuery(query: CustomerQuery,): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search,);
  }

  if (query.customerType) {
    params.set('customerType', query.customerType,);
  }

  if (query.page) {
    params.set('page', String(query.page),);
  }

  if (query.limit) {
    params.set('limit', String(query.limit),);
  }

  const value = params.toString();

  return value ? `?${value}` : '';
}

export function getCustomers( accessToken: string, query: CustomerQuery,) {
  return apiRequest<CustomersResponse>(
    `/customers${buildQuery(query)}`,
    {accessToken,},
  );
}

export function getCustomerById(accessToken: string, customerId: number,) {
  return apiRequest<Customer>(
    `/customers/${customerId}`,
    {accessToken,},
  );
}

export function updateCustomer(accessToken: string, customerId: number, input: UpdateCustomerInput,) {
  return apiRequest<UpdateCustomerResponse>(
    `/customers/${customerId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}