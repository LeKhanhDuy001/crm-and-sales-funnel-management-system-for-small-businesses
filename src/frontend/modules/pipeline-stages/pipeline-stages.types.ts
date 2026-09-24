export interface PipelineStage {
  stageId: number;
  stageName: string;
  stageOrder: number;
  probability: number;
}

export interface CreatePipelineStageInput {
  stageName: string;
  stageOrder: number;
  probability: number;
}

export interface UpdatePipelineStageInput {
  stageName?: string;
  stageOrder?: number;
  probability?: number;
}

export interface PipelineStageMutationResponse {
  message: string;
  data: PipelineStage;
}