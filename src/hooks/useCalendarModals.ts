import { useState } from 'react';
import { EventData, SelectedTime } from '@/types/calendar';

export function useCalendarModals() {
  // 모달 상태 관리
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedTime | null>(null);
  const [selectedEventData, setSelectedEventData] = useState<EventData | null>(null);
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    extendedProps: {
      is_project_schedule: false,
      is_ai_recommended: false,
      is_completed: false,
    },
    assignees: [],
  });

  // 일정 생성 모달 관련 함수
  const openCreateScheduleModal = (start: Date, end: Date) => {
    setSelectedEvent({ start, end });
    setEventData({
      title: '',
      start,
      end,
      description: '',
      assignees: [],
    });
    setOpenCreateModal(true);
  };

  const closeCreateModal = () => {
    setOpenCreateModal(false);
  };

  // 일정 상세 모달 관련 함수
  const openDetailScheduleModal = (eventData: EventData) => {
    setSelectedEventData(eventData);
    setOpenDetailModal(true);
  };

  const closeDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedEventData(null);
  };

  // 입력 처리 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    openCreateModal,
    openDetailModal,
    selectedEvent,
    selectedEventData,
    eventData,
    openCreateScheduleModal,
    closeCreateModal,
    openDetailScheduleModal,
    closeDetailModal,
    handleInputChange,
    setEventData,
  };
}
