// stores/previewStore.ts (새로 생성)
import { create } from 'zustand';
import { EventData } from '@/types/calendar';

interface PreviewSchedulesStore {
  previewEvents: EventData[];
  addPreviewEvent: (event: EventData) => void;
  clearAll: () => void;
}

export const usePreviewSchedulesStore = create<PreviewSchedulesStore>((set) => ({
  previewEvents: [],
  addPreviewEvent: (event) =>
    set((state) => ({
      previewEvents: [...state.previewEvents, event],
    })),
  clearAll: () => set({ previewEvents: [] }),
}));
