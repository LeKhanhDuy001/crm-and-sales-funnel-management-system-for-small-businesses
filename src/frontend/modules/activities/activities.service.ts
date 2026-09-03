import { apiRequest } from '../../services/api';
import type {
  ActivitiesResponse,
  Activity,
  ActivityMutationResponse,
  CreateActivityInput,
  UpdateActivityResultInput,
  ActivityMetaResponse
} from './activities.types';

export async function getActivities(accessToken: string,): Promise<ActivitiesResponse> {
  return apiRequest<ActivitiesResponse>(
    '/activities',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getActivityMeta(accessToken: string,): Promise<ActivityMetaResponse> {
  return apiRequest<ActivityMetaResponse>(
    '/activities/meta',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getActivityById(accessToken: string, activityId: number,): Promise<Activity> {
  return apiRequest<Activity>(
    `/activities/${activityId}`,
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function createActivity(accessToken: string, input: CreateActivityInput,): Promise<ActivityMutationResponse> {
  return apiRequest<ActivityMutationResponse>(
    '/activities',
    {
      method: 'POST',
      accessToken,
      body: input,
    },
  );
}

export async function updateActivityResult(
  accessToken: string,
  activityId: number,
  input: UpdateActivityResultInput,
): Promise<ActivityMutationResponse> {
  return apiRequest<ActivityMutationResponse>(
    `/activities/${activityId}/result`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}

export async function cancelActivity(
  accessToken: string,
  activityId: number,
): Promise<ActivityMutationResponse> {
  return apiRequest<ActivityMutationResponse>(
    `/activities/${activityId}/cancel`,
    {
      method: 'PATCH',
      accessToken,
    },
  );
}