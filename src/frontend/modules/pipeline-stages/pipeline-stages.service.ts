import { apiRequest } from '../../services/api';
import type {
  CreatePipelineStageInput,
  PipelineStage,
  PipelineStageMutationResponse,
  UpdatePipelineStageInput,
} from './pipeline-stages.types';

export async function getPipelineStages(accessToken: string): Promise<PipelineStage[]> {
  return apiRequest<PipelineStage[]>(
    '/pipeline-stages',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function createPipelineStage(
  accessToken: string,
  input: CreatePipelineStageInput,
): Promise<PipelineStageMutationResponse> {
  return apiRequest<PipelineStageMutationResponse>(
    '/pipeline-stages',
    {
      method: 'POST',
      accessToken,
      body: input,
    },
  );
}

export async function updatePipelineStage(
  accessToken: string,
  stageId: number,
  input: UpdatePipelineStageInput,
): Promise<PipelineStageMutationResponse> {
  return apiRequest<PipelineStageMutationResponse>(
    `/pipeline-stages/${stageId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}

export async function deletePipelineStage(
  accessToken: string,
  stageId: number,
): Promise<void> {
  return apiRequest<void>(
    `/pipeline-stages/${stageId}`,
    {
      method: 'DELETE',
      accessToken,
    },
  );
}