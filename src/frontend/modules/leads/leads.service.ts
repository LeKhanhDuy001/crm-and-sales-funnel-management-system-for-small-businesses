import { apiRequest } from '../../services/api';
import type { CreateLeadInput, Lead, LeadQuery, LeadsResponse, LeadSource, UpdateLeadInput, } from './leads.types';

function buildLeadQuery(query: LeadQuery,): string {
    const params = new URLSearchParams();

    if (query.search?.trim()) {
        params.set('search', query.search.trim(),);
    }

    if (query.status) {
        params.set('status', query.status,);
    }

    if (query.sourceId) {
        params.set('sourceId', String(query.sourceId),);
    }

    params.set('page', String(query.page ?? 1),);

    params.set('limit', String(query.limit ?? 10),);

    return params.toString();
}

export async function getLeads(accessToken: string, query: LeadQuery = {},): Promise<LeadsResponse> {
    const queryString = buildLeadQuery(query);

    return apiRequest<LeadsResponse>(`/leads?${queryString}`,
        {
            method: 'GET',
            accessToken,
            cache: 'no-store',
        },
    );
}

export async function getLeadById(accessToken: string, leadId: number,): Promise<Lead> {
    return apiRequest<Lead>(`/leads/${leadId}`,
        {
            method: 'GET',
            accessToken,
            cache: 'no-store',
        },
    );
}

export async function getLeadSources(accessToken: string,): Promise<LeadSource[]> {
    return apiRequest<LeadSource[]>('/leads/sources',
        {
            method: 'GET',
            accessToken,
            cache: 'no-store',
        },
    );
}

export async function createLead(accessToken: string, input: CreateLeadInput,): Promise<Lead> {
    return apiRequest<Lead>('/leads',
        {
            method: 'POST',
            accessToken,
            body: input,
        },
    );
}

export async function updateLead(accessToken: string, leadId: number, input: UpdateLeadInput,): Promise<Lead> {
    return apiRequest<Lead>(`/leads/${leadId}`,
        {
            method: 'PATCH',
            accessToken,
            body: input,
        },
    );
}

export async function deleteLead(accessToken: string, leadId: number,): Promise<void> {
    await apiRequest<void>(`/leads/${leadId}`,
        {
            method: 'DELETE',
            accessToken,
        },
    );
}