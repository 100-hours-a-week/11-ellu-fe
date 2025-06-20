export interface Assignee {
  nickname: string;
  profile_image_url: string;
}

export interface EventData {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  is_project_schedule?: boolean;
  is_completed?: boolean;
  is_ai_recommended?: boolean;
  extendedProps?: {
    is_project_schedule?: boolean;
    is_ai_recommended?: boolean;
    is_completed?: boolean;
  };
  assignees?: Assignee[];
}

export interface SelectedTime {
  start: Date;
  end: Date;
}

export interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSave: (event: EventData) => void;
  selectedEvent: SelectedTime | null;
  eventData: EventData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectId?: string;
}

export interface ScheduleModalSkeletonProps {
  open: boolean;
}

export interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  eventData: EventData | null;
  onDelete?: () => void;
  projectId?: string;
  takeSchedule: (scheduleId: number) => void;
}

export interface webSocketApi {
  updateSchedule: (eventData: EventData, scheduleId: number) => void;
}

export interface UseCalendarEventHandlersProps {
  webSocketApi?: webSocketApi | null;
}
