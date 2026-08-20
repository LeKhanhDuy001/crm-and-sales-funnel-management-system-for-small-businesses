export interface LeadSource {
  sourceId: number;
  sourceName: string;
}

export interface LeadAssignedUser {
  userId: number;
  fullName: string;
  email: string;
}

export interface Lead {
  leadId: number;
  fullName: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: string | null;
  createdDate: string | null;
  source: LeadSource | null;
  assignedUser: LeadAssignedUser | null;
}

export interface LeadsResponse {
  data: Lead[];
  page: number;
  pageSize: number;
  total: number;
}

export interface LeadQuery {
  search?: string;
  status?: string;
  sourceId?: number;
  page?: number;
  limit?: number;
}

export interface CreateLeadInput {
  sourceId?: number;
  assignedUserId?: number;
  fullName: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

export type UpdateLeadInput =
  Partial<CreateLeadInput>;

export interface ConvertLeadResponse {
  message: string;
  customer: {
    customerId: number;
    leadId: number | null;
    fullName: string;
    company: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
}