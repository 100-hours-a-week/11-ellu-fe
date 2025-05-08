'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale/ko';
import { EventData } from '@/types/calendar';
import { useRouter } from 'next/navigation';
import { useUpdateSchedule } from '@/hooks/api/schedule/useUpdateSchedule';
import { useUpdateProjectSchedule } from '@/hooks/api/schedule/project/useUpdateProjectSchedule';
import { useScheduleStore } from '@/stores/scheduleStore';

interface EditScheduleFormProps {
  scheduleData: EventData;
  projectId?: string;
  onSuccess: () => void;
}

export default function EditScheduleForm({ scheduleData, projectId, onSuccess }: EditScheduleFormProps) {
  const router = useRouter();

  useEffect(() => {
    console.log('scheduleData', scheduleData);
  }, [scheduleData]);

  // React Query Hooks
  const { mutate: updateSchedule, isPending: isUpdatingSchedule } = useUpdateSchedule();
  const { mutate: updateProjectSchedule, isPending: isUpdatingProjectSchedule } = useUpdateProjectSchedule();
  const isPending = isUpdatingSchedule || isUpdatingProjectSchedule;

  // 폼 상태
  const [formData, setFormData] = useState<EventData>(scheduleData);
  const [startDate, setStartDate] = useState<Date>(new Date(scheduleData.start));
  const [startTime, setStartTime] = useState<Date>(new Date(scheduleData.start));
  const [endDate, setEndDate] = useState<Date>(new Date(scheduleData.end));
  const [endTime, setEndTime] = useState<Date>(new Date(scheduleData.end));

  // 유효성 검사 상태
  const [titleError, setTitleError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');

  // 제목 유효성 검사 함수
  const validateTitle = (title: string) => {
    if (title.length < 1) return '제목을 입력해주세요.';
    if (title.length > 10) return '제목은 10자 이하여야 합니다.';
    if (!/^[가-힣ㄱ-ㅎa-zA-Z0-9\s]+$/.test(title)) return '한글, 영문, 숫자만 입력 가능합니다.';
    return '';
  };

  // 할일 유효성 검사 함수
  const validateDescription = (description: string) => {
    if (description.length < 1) return '상세일정을 입력해주세요.';
    if (description.length > 20) return '상세일정은 20자 이하여야 합니다.';
    if (!/^[가-힣ㄱ-ㅎa-zA-Z0-9\s]+$/.test(description)) return '한글, 영문, 숫자만 입력 가능합니다.';
    return '';
  };

  // 초기 유효성 검사 실행
  useEffect(() => {
    setTitleError(validateTitle(formData.title));
    setDescriptionError(validateDescription(formData.description || ''));
  }, []);

  // 입력 변경 핸들러
  const handleStartDateChange = (newValue: Date | null) => {
    if (!newValue) return;

    setStartDate(newValue);
    if (newValue && endDate && newValue > endDate) {
      setEndDate(newValue);
      setEndTime(newValue);
    }
  };

  const handleStartTimeChange = (newValue: Date | null) => {
    if (!newValue) return;

    setStartTime(newValue);
    if (
      newValue &&
      endTime &&
      startDate &&
      endDate &&
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate() &&
      newValue > endTime
    ) {
      setEndTime(newValue);
    }
  };

  const handleEndDateChange = (newValue: Date | null) => {
    if (!newValue) return;

    setEndDate(newValue);
    if (
      newValue &&
      startDate &&
      newValue.getFullYear() === startDate.getFullYear() &&
      newValue.getMonth() === startDate.getMonth() &&
      newValue.getDate() === startDate.getDate() &&
      startTime
    ) {
      setEndTime(startTime);
    }
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    if (!newValue) return;
    setEndTime(newValue);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, title: value }));
    setTitleError(validateTitle(value));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, description: value }));
    setDescriptionError(validateDescription(value));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 저장 버튼 활성화 체크함수
  const isSaveDisabled = () => {
    if (!formData.title || titleError || descriptionError || isPending) return true;

    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    return startDateTime > endDateTime;
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    const updatedSchedule = {
      ...formData,
      start: startDateTime,
      end: endDateTime,
    };

    const scheduleId = parseInt(updatedSchedule.id || '0');
    if (isNaN(scheduleId) || scheduleId === 0) {
      alert('유효하지 않은 일정 ID입니다.');
      return;
    }

    if (projectId) {
      // 프로젝트 일정 업데이트
      const projectIdNumber = parseInt(projectId);
      updateProjectSchedule(
        {
          projectId: projectIdNumber,
          scheduleId: scheduleId,
          eventData: updatedSchedule,
          options: { isProjectSchedule: true },
        },
        {
          onSuccess: () => {
            alert('일정이 성공적으로 수정되었습니다.');
            useScheduleStore.getState().setCurrentSchedule(null);
            onSuccess();
          },
          onError: (error) => {
            alert('일정 수정 중 오류가 발생했습니다.');
            console.error('수정 실패:', error);
          },
        }
      );
    } else {
      // 일반 일정 업데이트
      updateSchedule(
        {
          scheduleId: scheduleId,
          eventData: updatedSchedule,
          options: {},
        },
        {
          onSuccess: () => {
            alert('일정이 성공적으로 수정되었습니다.');
            useScheduleStore.getState().setCurrentSchedule(null);
            onSuccess();
          },
          onError: (error) => {
            alert('일정 수정 중 오류가 발생했습니다.');
            console.error('수정 실패:', error);
          },
        }
      );
    }
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    router.back();
    useScheduleStore.getState().setCurrentSchedule(null);
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
      }}
    >
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ko}
        localeText={{
          okButtonLabel: '확인',
          cancelButtonLabel: '취소',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            시작 시간
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="시작 일자"
              value={startDate}
              onChange={handleStartDateChange}
              sx={{ flex: 1 }}
              disabled={isPending}
            />
            <TimePicker
              label="시작 시간"
              value={startTime}
              onChange={handleStartTimeChange}
              sx={{ flex: 1 }}
              disabled={isPending}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            종료 시간
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="종료 일자"
              value={endDate}
              onChange={handleEndDateChange}
              sx={{ flex: 1 }}
              minDate={startDate}
              disabled={isPending}
            />
            <TimePicker
              label="종료 시간"
              value={endTime}
              onChange={handleEndTimeChange}
              sx={{ flex: 1 }}
              minTime={isSameDay(startDate, endDate) ? startTime : undefined}
              disabled={isPending}
            />
          </Box>
        </Box>
      </LocalizationProvider>

      <TextField
        label="제목"
        value={formData.title}
        onChange={handleTitleChange}
        error={!!titleError}
        helperText={titleError}
        sx={{
          mb: 5,
          '& .MuiFormHelperText-root': {
            position: 'absolute',
            bottom: '-20px',
          },
        }}
        fullWidth
        disabled={isPending}
      />

      <TextField
        label="상세일정"
        value={formData.description || ''}
        onChange={handleDescriptionChange}
        error={!!descriptionError}
        helperText={descriptionError}
        multiline
        rows={4}
        sx={{
          mb: 3,
          '& .MuiFormHelperText-root': {
            position: 'absolute',
            bottom: '-20px',
          },
        }}
        fullWidth
        disabled={isPending}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={handleCancel} disabled={isPending}>
          취소
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isSaveDisabled()}>
          {isPending ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
              수정 중...
            </>
          ) : (
            '수정'
          )}
        </Button>
      </Box>
    </Box>
  );
}
