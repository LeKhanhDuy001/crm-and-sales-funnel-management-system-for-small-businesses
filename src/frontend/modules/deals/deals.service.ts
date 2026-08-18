import { apiRequest } from '../../services/api';
import type {
    CreateDealInput,
    Deal,
    DealMetaResponse,
    DealMutationResponse,
    DealQuery,
    DealsResponse,
    UpdateDealInput,
} from './deals.types';

function buildQueryString(query: DealQuery,): string {
    const params = new URLSearchParams();

    if (query.search) {
        params.set('search', query.search);
    }

    if (query.stageId !== undefined) {
        params.set('stageId', String(query.stageId),);
    }

    if (query.page !== undefined) {
        params.set('page', String(query.page),);
    }

    if (query.limit !== undefined) {
        params.set('limit', String(query.limit),);
    }

    const queryString = params.toString();

    return queryString ? `/deals?${queryString}` : '/deals';
}

export async function getDeals(accessToken: string, query: DealQuery = {},): Promise<DealsResponse> {
    return apiRequest<DealsResponse>(
        buildQueryString(query),
        {
            method: 'GET',
            accessToken,
        },
    );
}

export async function getDealById(accessToken: string, dealId: number,): Promise<Deal> {
    return apiRequest<Deal>(
        `/deals/${dealId}`,
        {
            method: 'GET',
            accessToken,
        },
    );
}

export async function getDealMeta(accessToken: string,): Promise<DealMetaResponse> {
    return apiRequest<DealMetaResponse>(
        '/deals/meta',
        {
            method: 'GET',
            accessToken,
        },
    );
}

export async function createDeal(accessToken: string, input: CreateDealInput,): Promise<DealMutationResponse> {
    return apiRequest<DealMutationResponse>(
        '/deals',
        {
            method: 'POST',
            accessToken,
            body: input,
        },
    );
}

export async function updateDeal(accessToken: string, dealId: number, input: UpdateDealInput,): Promise<DealMutationResponse> {
    return apiRequest<DealMutationResponse>(
        `/deals/${dealId}`,
        {
            method: 'PATCH',
            accessToken,
            body: input,
        },
    );
}

export async function deleteDeal(accessToken: string, dealId: number,): Promise<void> {
    return apiRequest<void>(
        `/deals/${dealId}`,
        {
            method: 'DELETE',
            accessToken,
        },
    );
}