"use client";

import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./Calendar.module.css";
import { DateSelectArg, EventDropArg } from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import CreateScheduleModal from "./CreateScheduleModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import { EventData } from "../types/calendar";
import { useCalendarModals } from "@/hooks/useCalendarModals";

// 상수 정의
const CALENDAR_VIEWS = {
  multiMonthYear: { type: "multiMonth", duration: { years: 1 } },
  timeGridDay: { type: "timeGrid", duration: { days: 1 } },
  timeGridWeek: { type: "timeGrid", duration: { weeks: 1 } },
  dayGridMonth: { type: "dayGrid", duration: { months: 1 } },
};

const HEADER_TOOLBAR = {
  left: "prev,next today",
  center: "title",
  right: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
};

export default function Calendar({ projectId }: { projectId?: string }) {
  const calendarRef = useRef<FullCalendar>(null);

  // 캘린더 뷰와 날짜 상태
  const [currentView, setCurrentView] = useState<string>("timeGridWeek");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventData[]>([]);

  // 모달 관련 커스텀 훅 사용
  const {
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
  } = useCalendarModals();

  // 캘린더 뷰가 변경될 때 호출되는 핸들러
  const handleViewChange = (viewInfo: any) => {
    console.log("View changed to:", viewInfo.view.type);
    setCurrentView(viewInfo.view.type);
  };

  // 날짜 범위가 변경될 때 호출되는 핸들러
  const handleDatesSet = (dateInfo: any) => {
    console.log("Date range changed:", {
      start: dateInfo.start,
      end: dateInfo.end,
      view: dateInfo.view.type,
    });
    setCurrentDate(dateInfo.start);
  };

  // 현재 뷰와 날짜 변경 시 필요한 처리를 위한 useEffect
  useEffect(() => {
    console.log("Current view:", currentView);
    console.log("Current date:", currentDate);

    // 여기서 뷰 타입에 따라 다른 API 호출 등의 처리를 할 수 있습니다
    if (currentView === "timeGridDay") {
      console.log("일별 뷰: 일별 데이터를 가져와야 합니다");
    } else if (
      currentView === "timeGridWeek" ||
      currentView === "dayGridMonth"
    ) {
      console.log("주간/월간 뷰: 월별 데이터를 가져와야 합니다");
    } else if (currentView === "multiMonthYear") {
      console.log("연간 뷰: 연간 데이터를 가져와야 합니다");
    }
  }, [currentView, currentDate]);

  // 캘린더에서 시간 선택 시 호출
  const handleSelect = (selectInfo: DateSelectArg) => {
    openCreateScheduleModal(selectInfo.start, selectInfo.end);
  };

  // 모달 취소 처리
  const handleCancel = () => {
    closeCreateModal();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };

  // 일정 저장
  const handleSave = (newEvent: EventData) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, eventWithId];
      console.log("새로운 일정 추가:", updatedEvents);
      return updatedEvents;
    });
    closeCreateModal();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };

  // 일정 드래그 앤 드롭 처리
  const handleEventDrop = (info: EventDropArg) => {
    const { event } = info;
    if (!event.start || !event.end) return;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((evt) =>
        evt.id === event.id
          ? { ...evt, start: event.start!, end: event.end! }
          : evt
      );
      console.log("일정 드래그 후 변경:", updatedEvents);
      return updatedEvents;
    });
  };

  // 이벤트 크기 조정
  const handleEventResize = (info: EventResizeDoneArg) => {
    const { event } = info;
    if (!event.start || !event.end) return;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((evt) =>
        evt.id === event.id
          ? { ...evt, start: event.start!, end: event.end! }
          : evt
      );
      console.log("일정 크기 조정 후 변경:", updatedEvents);
      return updatedEvents;
    });
  };

  // 일정 클릭 이벤트 처리
  const handleEventClick = (info: any) => {
    const eventData = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      description: info.event.extendedProps.description,
    };
    openDetailScheduleModal(eventData);
  };

  // 일정 삭제
  const handleDelete = () => {
    if (selectedEventData) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEventData.id)
      );
      closeDetailModal();
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        initialView="timeGridWeek"
        locale={koLocale}
        headerToolbar={HEADER_TOOLBAR}
        selectable={true}
        select={handleSelect}
        unselectAuto={false}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventClick={handleEventClick}
        views={CALENDAR_VIEWS}
        events={events}
        nowIndicator={true}
        slotEventOverlap={false}
        viewDidMount={handleViewChange}
        datesSet={handleDatesSet}
      />

      <CreateScheduleModal
        open={openCreateModal}
        onClose={closeCreateModal}
        onCancel={handleCancel}
        onSave={handleSave}
        selectedEvent={selectedEvent}
        eventData={eventData}
        onInputChange={handleInputChange}
        projectId={projectId}
      />

      <ScheduleDetailModal
        open={openDetailModal}
        onClose={closeDetailModal}
        eventData={selectedEventData}
        onDelete={handleDelete}
        projectId={projectId}
      />
    </div>
  );
}
