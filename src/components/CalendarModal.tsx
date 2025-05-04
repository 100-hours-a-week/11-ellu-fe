'use client';

import { Modal, Box, TextField, Button, Typography, Popover } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useState, useEffect } from 'react';
import { ko } from 'date-fns/locale/ko';
import { EventData, SelectedTime, CalendarModalProps } from '../types/calendar';

export default function CalendarModal({ open, onClose, onCancel, onSave, selectedEvent, eventData, onInputChange }: CalendarModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [titleError, setTitleError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');

  useEffect(() => {
    if (selectedEvent) {
      setStartDate(selectedEvent.start);
      setStartTime(selectedEvent.start);
      setEndDate(selectedEvent.end);
      setEndTime(selectedEvent.end);
    }
  }, [selectedEvent]);

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
    if (newValue && endDate && newValue > endDate) {
      setEndDate(newValue);
      setEndTime(newValue);
    }
  };

  const handleStartTimeChange = (newValue: Date | null) => {
    setStartTime(newValue);
    if (newValue && endTime && startDate && endDate && startDate.getTime() === endDate.getTime() && newValue > endTime) {
      setEndTime(newValue);
    }
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setEndDate(newValue);
    if (newValue && startDate && newValue.getTime() === startDate.getTime() && startTime) {
      setEndTime(startTime);
    }
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    setEndTime(newValue);
  };

  // 제목 유효성 검사 함수
  const validateTitle = (title: string) => {
    if (title.length < 1) return '제목을 입력해주세요.';
    if (title.length > 10) return '제목은 10자 이하여야 합니다.';
    if (!/^[가-힣ㄱ-ㅎa-zA-Z0-9\s]+$/.test(title)) return '한글, 영문, 숫자만 입력 가능합니다.';
    return '';
  };

  // 할일 유효성 검사 함수
  const validateDescription = (description: string) => {
    if (description.length < 1) return '할일을 입력해주세요.';
    if (description.length > 20) return '할일은 20자 이하여야 합니다.';
    if (!/^[가-힣ㄱ-ㅎa-zA-Z0-9\s]+$/.test(description)) return '한글, 영문, 숫자만 입력 가능합니다.';
    return '';
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onInputChange(e);
    setTitleError(validateTitle(value));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onInputChange(e);
    setDescriptionError(validateDescription(value));
  };

  const handleSave = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      return;
    }

    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    const newEvent: EventData = {
      ...eventData,
      start: startDateTime,
      end: endDateTime,
    };

    onSave(newEvent);
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  // 저장 버튼 활성화 체크함수
  const isSaveDisabled = () => {
    if (!eventData.title || titleError || descriptionError) return true;
    if (!startDate || !startTime || !endDate || !endTime) return true;

    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    return startDateTime > endDateTime;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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

        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ko}
          localeText={{
            okButtonLabel: '확인',
            cancelButtonLabel: '취소',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              시작 시간
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DatePicker label="시작 일자" value={startDate} onChange={handleStartDateChange} sx={{ flex: 1 }} minDate={new Date()} />
              <TimePicker label="시작 시간" value={startTime} onChange={handleStartTimeChange} sx={{ flex: 1 }} />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              종료 시간
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DatePicker label="종료 일자" value={endDate} onChange={handleEndDateChange} sx={{ flex: 1 }} minDate={startDate || new Date()} />
              <TimePicker
                label="종료 시간"
                value={endTime}
                onChange={handleEndTimeChange}
                sx={{ flex: 1 }}
                minTime={isSameDay(startDate, endDate) && startTime ? startTime : undefined}
              />
            </Box>
          </Box>
        </LocalizationProvider>

        <TextField
          fullWidth
          label="제목"
          name="title"
          value={eventData.title}
          onChange={handleTitleChange}
          sx={{ mb: 2 }}
          required
          error={!!titleError}
          helperText={titleError}
        />

        <TextField
          fullWidth
          label="할일"
          name="description"
          value={eventData.description}
          onChange={handleDescriptionChange}
          multiline
          rows={3}
          sx={{ mb: 2 }}
          error={!!descriptionError}
          helperText={descriptionError}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel}>취소</Button>
          <Button variant="contained" onClick={handleSave} disabled={isSaveDisabled()}>
            저장
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
