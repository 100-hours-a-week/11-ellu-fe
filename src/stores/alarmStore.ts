import { create } from 'zustand';

// 알람 타입 정의
type AlarmType = 'PROJECT_INVITED' | 'PROJECT_JOINED' | 'PROJECT_LEFT';

interface Alarm {
  type: AlarmType;
  projectId: number;
  senderId: number;
  targetUserIds: number[];
  message: string;
  time?: Date;
  isRead: boolean;
}

interface AlarmStore {
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  clearAlarms: () => void;
  markAllAsRead: () => void;
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [],

  // 알람 추가
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [
        ...state.alarms,
        {
          ...alarm,
          time: new Date(),
          isRead: false,
        },
      ],
    })),

  // 모든 알람 제거
  clearAlarms: () => set({ alarms: [] }),

  // 모든 알람을 읽음으로 표시
  markAllAsRead: () =>
    set((state) => ({
      alarms: state.alarms.map((alarm) => ({ ...alarm, isRead: true })),
    })),
}));
