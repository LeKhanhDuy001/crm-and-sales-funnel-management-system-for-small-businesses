import { apiRequest } from '../../services/api';
import type {
  CreateQuoteInput,
  Quote,
  QuoteMetaResponse,
  QuoteMutationResponse,
  UpdateQuoteInput,
} from './quotes.types';

export async function getQuotes(accessToken: string,): Promise<Quote[]> {
  return apiRequest<Quote[]>(
    '/quotes',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getQuoteById(accessToken: string, quoteId: number,): Promise<Quote> {
  return apiRequest<Quote>(
    `/quotes/${quoteId}`,
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getQuoteMeta(accessToken: string,): Promise<QuoteMetaResponse> {
  return apiRequest<QuoteMetaResponse>(
    '/quotes/meta',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function createQuote(accessToken: string, input: CreateQuoteInput,): Promise<QuoteMutationResponse> {
  return apiRequest<QuoteMutationResponse>(
    '/quotes',
    {
      method: 'POST',
      accessToken,
      body: input,
    },
  );
}

export async function updateQuote(accessToken: string, quoteId: number, input: UpdateQuoteInput,): Promise<QuoteMutationResponse> {
  return apiRequest<QuoteMutationResponse>(
    `/quotes/${quoteId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}

export async function confirmQuote(accessToken: string, quoteId: number,): Promise<QuoteMutationResponse> {
  return apiRequest<QuoteMutationResponse>(
    `/quotes/${quoteId}/confirm`,
    {
      method: 'PATCH',
      accessToken,
    },
  );
}

export async function cancelQuote(accessToken: string, quoteId: number,): Promise<QuoteMutationResponse> {
  return apiRequest<QuoteMutationResponse>(
    `/quotes/${quoteId}/cancel`,
    {
      method: 'PATCH',
      accessToken,
    },
  );
}