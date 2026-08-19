export interface QuoteDeal {
  dealId: number;
  dealName: string;
  stageName: string;
}

export interface QuoteCustomer {
  customerId: number;
  fullName: string;
  company: string | null;
}

export interface QuoteCreatedBy {
  userId: number;
  fullName: string;
}

export interface QuoteItem {
  quoteDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  quoteId: number;
  quoteCode: string;
  quoteDate: string | null;
  totalAmount: number;
  status: string | null;
  deal: QuoteDeal;
  customer: QuoteCustomer;
  createdBy: QuoteCreatedBy | null;
  items: QuoteItem[];
}

export interface QuoteInputItem {
  productId: number;
  quantity: number;
}

export interface CreateQuoteInput {
  dealId: number;
  items: QuoteInputItem[];
}

export interface UpdateQuoteInput {
  items: QuoteInputItem[];
}

export interface QuoteMutationResponse {
  message: string;
  data: Quote;
}

export interface QuoteMetaCustomer {
  customerId: number;
  fullName: string;
  company: string | null;
}

export interface QuoteMetaDeal {
  dealId: number;
  dealCode: string;
  dealName: string;
  stageName: string;
  customer: QuoteMetaCustomer;
}

export interface QuoteMetaProduct {
  productId: number;
  productName: string;
  category: string | null;
  price: number;
}

export interface QuoteMetaResponse {
  deals: QuoteMetaDeal[];
  products: QuoteMetaProduct[];
}