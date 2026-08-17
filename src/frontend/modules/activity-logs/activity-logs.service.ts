import { apiRequest } from '../../services/api';
import type { ActivityLogAction, ActivityLogFilterUsersResponse, ActivityLogQuery, ActivityLogsResponse, } from './activity-logs.types';

function buildActivityLogQuery(query: ActivityLogQuery,): string {
  const params = new URLSearchParams();

  if (query.userId !== undefined) {
    params.set('userId', String(query.userId),);
  }

  if (query.action) {
    params.set('action', query.action,);
  }

  if (query.fromDate) {
    params.set('fromDate', query.fromDate,);
  }

  if (query.toDate) {
    params.set('toDate', query.toDate,);
  }

  if (query.page) {
    params.set('page', String(query.page),);
  }

  if (query.limit) {
    params.set('limit', String(query.limit),);
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
}

export function getActivityLogs( accessToken: string, query: ActivityLogQuery,) {
  return apiRequest<ActivityLogsResponse>(
    `/activity-logs${buildActivityLogQuery(query)}`,
    {
      accessToken,
    },
  );
}

export function getActivityLogFilterUsers(accessToken: string,) {
  return apiRequest<ActivityLogFilterUsersResponse>(
    '/activity-logs/filter-users',
    {
      accessToken,
    },
  );
}

export function toActivityLogAction(value: string,): ActivityLogAction | undefined {
  if (!value) {
    return undefined;
  }
  return value as ActivityLogAction;
}