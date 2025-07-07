export interface User {
  id: number;
  nickname: string;
  imageUrl: string;
}

export interface UserProgressItem {
  date: string;
  created_schedules: number;
}

export type UserProgress = UserProgressItem[];
