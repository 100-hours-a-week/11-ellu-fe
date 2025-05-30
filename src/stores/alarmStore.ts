import { create } from 'zustand';
import { AlarmStore } from '@/types/alarm';

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [],

  // 알람 추가
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [
        {
          ...alarm,
          time: new Date(),
          isRead: false,
        },
        ...state.alarms,
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
