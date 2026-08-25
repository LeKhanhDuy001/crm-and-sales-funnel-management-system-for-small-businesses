import { apiRequest } from '../../services/api';
import type {
  AssignTaskInput,
  CreateTaskInput,
  Task,
  TaskMetaResponse,
  TaskMutationResponse,
  TaskQuery,
  TasksResponse,
  TaskStatus,
  UpdateTaskInput,
} from './tasks.types';

function buildTaskUrl(query: TaskQuery,): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.status) {
    params.set('status', query.status);
  }

  if (query.priority) {
    params.set('priority', query.priority,);
  }

  if (query.page) {
    params.set('page', String(query.page),);
  }

  if (query.limit) {
    params.set('limit', String(query.limit),);
  }

  const queryString = params.toString();

  return queryString ? `/tasks?${queryString}` : '/tasks';
}

export async function getTasks(accessToken: string, query: TaskQuery = {},): Promise<TasksResponse> {
  return apiRequest<TasksResponse>(
    buildTaskUrl(query),
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getTaskMeta(accessToken: string,): Promise<TaskMetaResponse> {
  return apiRequest<TaskMetaResponse>(
    '/tasks/meta',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getTaskById(accessToken: string, taskId: number,): Promise<Task> {
  return apiRequest<Task>(
    `/tasks/${taskId}`,
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function createTask(accessToken: string, input: CreateTaskInput,): Promise<TaskMutationResponse> {
  return apiRequest<TaskMutationResponse>(
    '/tasks',
    {
      method: 'POST',
      accessToken,
      body: input,
    },
  );
}

export async function updateTask(accessToken: string, taskId: number, input: UpdateTaskInput,): Promise<TaskMutationResponse> {
  return apiRequest<TaskMutationResponse>(
    `/tasks/${taskId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}

export async function updateTaskStatus(accessToken: string, taskId: number, status: TaskStatus,): Promise<TaskMutationResponse> {
  return apiRequest<TaskMutationResponse>(
    `/tasks/${taskId}/status`,
    {
      method: 'PATCH',
      accessToken,
      body: {status,},
    },
  );
}

export async function cancelTask(accessToken: string, taskId: number,): Promise<TaskMutationResponse> {
  return apiRequest<TaskMutationResponse>(
    `/tasks/${taskId}/cancel`,
    {
      method: 'PATCH',
      accessToken,
    },
  );
}

export async function assignTask(accessToken: string, taskId: number, input: AssignTaskInput,): Promise<TaskMutationResponse> {
  return apiRequest<TaskMutationResponse>(
    `/tasks/${taskId}/assignment`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}