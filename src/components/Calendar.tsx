'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import React, { useRef, useState } from 'react';
import styles from './Calendar.module.css';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

interface EventData {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

interface SelectedTime {
  start: Date;
  end: Date;
}

const CALENDAR_VIEWS = {
  dayGridYear: {
    type: 'dayGrid',
    duration: { years: 1 },
  },
  timeGridDay: {
    type: 'timeGrid',
    duration: { days: 1 },
  },
  timeGridWeek: {
    type: 'timeGrid',
    duration: { weeks: 1 },
  },
  dayGridMonth: {
    type: 'dayGrid',
    duration: { months: 1 },
  },
};

const HEADER_TOOLBAR = {
  left: 'prev,next today',
  center: 'title',
  right: 'timeGridDay,timeGridWeek,dayGridMonth,dayGridYear',
};

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedTime | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
  });

  // 캘린더에서 시간 선택 시 호출
  const handleSelect = (selectInfo: any) => {
    const { start, end } = selectInfo;
    setSelectedEvent({ start, end });
    setEventData({
      title: '',
      start,
      end,
      description: '',
    });
    setOpen(true);
  };
  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
  };
  // 모달 닫기 및 선택 취소
  const handleCancel = () => {
    setOpen(false);
    setSelectedEvent(null);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };
  // 일정 저장
  const handleSave = () => {
    if (!eventData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    handleClose();
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
    }
  };
  // 일정 드래그 앤 드롭 처리
  const handleEventDrop = (info: any) => {
    const { event } = info;
    setEvents((prevEvents) => prevEvents.map((evt) => (evt.id === event.id ? { ...evt, start: event.start, end: event.end } : evt)));
  };
  // 이벤트 크기 조정
  const handleEventResize = (info: any) => {
    const { event } = info;
    setEvents((prevEvents) => prevEvents.map((evt) => (evt.id === event.id ? { ...evt, start: event.start, end: event.end } : evt)));
  };
  // 모달 폼 입력처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
        views={CALENDAR_VIEWS}
        events={events}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown
        disableAutoFocus
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            일정 추가
          </Typography>

          <TextField fullWidth label="제목" name="title" value={eventData.title} onChange={handleInputChange} sx={{ mb: 2 }} required />

          <TextField fullWidth label="시작 시간" value={selectedEvent?.start.toLocaleString()} disabled sx={{ mb: 2 }} />

          <TextField fullWidth label="종료 시간" value={selectedEvent?.end.toLocaleString()} disabled sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="설명"
            name="description"
            value={eventData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCancel}>취소</Button>
            <Button variant="contained" onClick={handleSave}>
              저장
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
