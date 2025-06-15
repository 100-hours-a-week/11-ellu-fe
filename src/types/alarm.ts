// 알람 타입 정의
export type AlarmType = 'PROJECT_INVITED' | 'OTHER';
export interface Alarm {
  id: number;
  type: AlarmType;
  invite_status?: string;
  projectId: number;
  senderId: number;
  targetUserIds: number[];
  message: string;
  created_at?: Date;
  isRead: boolean;
}
export interface AlarmStore {
  alarms: Alarm[];
  isLoading: boolean;
  addAlarm: (alarm: Alarm) => void;
  markAllAsRead: () => void;
  loadInitialAlarms: () => Promise<void>;
}
export interface EditInviteParams {
  notificationId: number;
  inviteStatus: string;
}
export interface NotificationData {
  type: AlarmType;
  notificationId: number;
  projectId: number;
  senderId: number;
  receiverId: number[];
  message: string;
}
