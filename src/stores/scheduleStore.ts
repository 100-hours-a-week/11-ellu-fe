import { create } from 'zustand';
import { EventData } from '@/types/calendar';

interface ScheduleState {
  currentSchedule: EventData | null;
  setCurrentSchedule: (schedule: EventData | null) => void;
}

export const useScheduleStore = create<ScheduleState>()((set) => ({
  currentSchedule: null,
  setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),
}));
