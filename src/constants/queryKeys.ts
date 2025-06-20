// src/constants/queryKeys.ts
export const QUERY_KEYS = {
  // 프로젝트 관련
  projects: ['projects'] as const,
  project: (projectId: number) => ['project-detail', projectId] as const,

  // 일정 관련
  schedules: {
    // 개인 일정
    daily: (date: string) => ['daily-schedules', date] as const,
    monthly: (month: string) => ['monthly-schedules', month] as const,
    yearly: (year: string) => ['yearly-schedules', year] as const,

    // 프로젝트 일정
    projectDaily: (projectId: number) => ['project-daily-schedules', projectId] as const,
    projectMonthly: (projectId: number) => ['project-monthly-schedules', projectId] as const,
    projectYearly: (projectId: number) => ['project-yearly-schedules', projectId] as const,
  },

  // 알람 관련
  alarms: ['alarms'] as const,
} as const;
