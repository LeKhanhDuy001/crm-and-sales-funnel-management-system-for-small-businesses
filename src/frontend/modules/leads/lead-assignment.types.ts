export interface LeadAssignmentUser {
  userId: number;
  fullName: string;
  email: string;
}

export interface LeadAssignment {
  leadId: number;
  leadCode: string;
  fullName: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  sourceName: string | null;
  assignedUser: | LeadAssignmentUser | null;
}

export interface LeadAssignmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadAssignmentsResponse {
  data: LeadAssignment[];

  pagination:
    LeadAssignmentPagination;
}

export interface LeadAssignmentMetaResponse {
  assignees:
    LeadAssignmentUser[];
}

export interface AssignLeadInput {
  assignedUserId: number;
}

export interface AssignLeadResponse {
  message: string;
}