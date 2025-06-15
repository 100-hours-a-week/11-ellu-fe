import { create } from 'zustand';
import { AlarmStore, AlarmType } from '@/types/alarm';
import { getAlarms } from '@/api/alarm';

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [],
  isLoading: false,
  error: null,

  // 초기 알람 로딩
  loadInitialAlarms: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiAlarms = await getAlarms();
      const transformedAlarms = apiAlarms.map((alarm) => ({
        ...alarm,
        type: (alarm.invite_status === 'PENDING' ? 'PROJECT_INVITED' : 'OTHER') as AlarmType,
        isRead: true,
      }));
      set({ alarms: transformedAlarms, error: null });
    } catch (error) {
      set({ error: '알람을 불러오는데 실패했습니다.' });
      alert('알람을 불러오는데 실패했습니다.');
    } finally {
      set({ isLoading: false });
    }
  },

  // 알람 추가 (실시간 알람용)
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [
        {
          ...alarm,
          created_at: new Date(),
          isRead: false,
        },
        ...state.alarms,
      ],
    })),

  // 모든 알람을 읽음으로 표시
  markAllAsRead: () =>
    set((state) => ({
      alarms: state.alarms.map((alarm) => ({ ...alarm, isRead: true })),
    })),
}));
