export interface EventData {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
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

export interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  eventData: EventData | null;
  onDelete?: () => void;
  projectId?: string;
}
