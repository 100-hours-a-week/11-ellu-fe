// 알람 타입 정의
type AlarmType = 'PROJECT_INVITED' | 'SCHEDULE_CREATED' | 'SCHEDULE_UPDATED' | 'SCHEDULE_DELETED';

export interface Alarm {
  type: AlarmType;
  projectId: number;
  senderId: number;
  targetUserIds: number[];
  message: string;
  time?: Date;
  isRead: boolean;
}

export interface AlarmStore {
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  clearAlarms: () => void;
  markAllAsRead: () => void;
}
