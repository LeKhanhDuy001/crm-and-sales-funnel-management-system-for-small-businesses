import { apiRequest } from '../../services/api';
import type { AssignLeadInput, AssignLeadResponse, LeadAssignmentMetaResponse, LeadAssignmentsResponse, } from './lead-assignment.types';

interface Query {
  search?: string;
  page?: number;
  limit?: number;
}

function buildUrl(query: Query,): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set(
      'search',
      query.search,
    );
  }

  if (query.page) {
    params.set(
      'page',
      String(query.page),
    );
  }

  if (query.limit) {
    params.set(
      'limit',
      String(query.limit),
    );
  }

  const queryString = params.toString();

  return queryString ? `/lead-assignments?${queryString}` : '/lead-assignments';
}

export async function getLeadAssignments(accessToken: string, query: Query = {},): Promise<LeadAssignmentsResponse> {
  return apiRequest<LeadAssignmentsResponse>(
    buildUrl(query),
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getLeadAssignmentMeta(accessToken: string,): Promise<LeadAssignmentMetaResponse> {
  return apiRequest<LeadAssignmentMetaResponse>(
    '/lead-assignments/meta',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function assignLead(accessToken: string, leadId: number, input: AssignLeadInput,): Promise<AssignLeadResponse> {
  return apiRequest<AssignLeadResponse>(
    `/lead-assignments/${leadId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}