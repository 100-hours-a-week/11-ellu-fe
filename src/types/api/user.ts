export interface User {
  id: number;
  nickname: string;
  imageUrl: string;
}

export interface UserProgressItem {
  date: string;
  created_schedules: number;
}

export interface UserAchievements {
  total_schedules: number;
  completed_schedules: number;
  achievement_rate: number;
}

export type UserProgress = UserProgressItem[];
