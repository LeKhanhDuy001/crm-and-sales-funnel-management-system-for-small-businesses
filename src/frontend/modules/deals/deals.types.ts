export interface DealCustomer {
  customerId: number;
  fullName: string;
  company: string | null;
}

export interface DealStage {
  stageId: number;
  stageName: string;
  stageOrder: number;
}

export interface AssignedUser {
  userId: number;
  fullName: string;
}

export interface Deal {
  dealId: number;
  dealCode: string;
  dealName: string;
  dealValue: number;
  probability: number | null;
  expectedRevenue: number | null;
  expectedCloseDate: string | null;
  status: string | null;
  createdDate: string | null;
  customer: DealCustomer;
  stage: DealStage;
  assignedUser: AssignedUser;
}

export interface DealPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DealQuery {
  search?: string;
  stageId?: number;
  page?: number;
  limit?: number;
}

export interface DealsResponse {
  data: Deal[];
  pagination: DealPagination;
}

export interface PipelineStageOption {
  stageId: number;
  stageName: string;
  stageOrder: number;
  probability: number | null;
}

export interface DealMetaResponse {
  stages: PipelineStageOption[];
}

export interface CreateDealInput {
  customerId: number;
  stageId: number;
  dealName: string;
  dealValue: number;
  expectedCloseDate?: string;
}

export interface UpdateDealInput {
  customerId?: number;
  dealName?: string;
  dealValue?: number;
  expectedCloseDate?: string;
}

export interface DealMutationResponse {
  message: string;
  data: Deal;
}