'use client';

import { useState, useEffect, Fragment } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  Divider,
  Button,
  Alert,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { CalendarMonth as CalendarIcon, ExpandMore as ExpandMoreIcon, Check as CheckIcon } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { addDays, setHours, setMinutes, format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { TaskGroup } from '@/types/schedule';

import { useGetRecommendedSchedule } from '@/hooks/api/projects/useGetRecommendedSchedule';
import { useCreateProjectSchedules } from '@/hooks/api/schedule/project/useCreateProjectSchedules';

export default function RecommendSchedule() {
  const params = useParams();
  const projectIdNumber = Number(params.id);
  const [recommendedTasks, setRecommendedTasks] = useState<TaskGroup[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const { data: scheduleData, isLoading, isError, error } = useGetRecommendedSchedule(projectIdNumber);

  const { mutate: createProjectSchedules, isPending } = useCreateProjectSchedules();

  useEffect(() => {
    if (scheduleData && scheduleData.recommendedSchedules) {
      const formattedTasks = scheduleData.recommendedSchedules.map((schedule, groupIndex) => ({
        keyword: schedule.keyword,
        subtasks: schedule.subtasks.map((name, subtaskIndex) => ({
          id: `${groupIndex + 1}-${subtaskIndex + 1}`,
          name,
          isSelected: false,
        })),
      }));

      setRecommendedTasks(formattedTasks);
    }
  }, [scheduleData]);

  // 단일 서브태스크 체크박스 변경 핸들러
  const handleSubtaskChange = (groupIndex: number, subtaskId: string) => {
    const newTasks = [...recommendedTasks];
    const subtaskIndex = newTasks[groupIndex].subtasks.findIndex((st) => st.id === subtaskId);

    if (subtaskIndex !== -1) {
      newTasks[groupIndex].subtasks[subtaskIndex].isSelected = !newTasks[groupIndex].subtasks[subtaskIndex].isSelected;
      setRecommendedTasks(newTasks);
    }
  };

  // 그룹의 모든 서브태스크 체크박스 변경 핸들러
  const handleGroupChange = (groupIndex: number, isSelected: boolean) => {
    const newTasks = [...recommendedTasks];
    newTasks[groupIndex].subtasks = newTasks[groupIndex].subtasks.map((st) => ({
      ...st,
      isSelected,
    }));
    setRecommendedTasks(newTasks);
  };

  // 모든 서브태스크 체크박스 변경 핸들러
  const handleSelectAll = (isSelected: boolean) => {
    const newTasks = recommendedTasks.map((group) => ({
      ...group,
      subtasks: group.subtasks.map((st) => ({
        ...st,
        isSelected,
      })),
    }));
    setRecommendedTasks(newTasks);
  };

  // 선택된 서브태스크 개수 계산
  const getSelectedSubtaskCount = () => {
    return recommendedTasks.reduce((total, group) => {
      return total + group.subtasks.filter((st) => st.isSelected).length;
    }, 0);
  };

  // 전체 서브태스크 개수 계산
  const getTotalSubtaskCount = () => {
    return recommendedTasks.reduce((total, group) => {
      return total + group.subtasks.length;
    }, 0);
  };

  // 캘린더에 선택된 일정 추가
  const handleAddToCalendar = () => {
    const selectedTasks = recommendedTasks.flatMap((group) => {
      return group.subtasks
        .filter((st) => st.isSelected)
        .map((st) => ({
          groupName: group.keyword,
          subtaskName: st.name,
          id: st.id,
        }));
    });

    const startDate = new Date();
    // 각 태스크를 EventData 형식으로 변환
    const eventDataList = selectedTasks.map((task, index) => {
      // 각 태스크는 1일 간격으로 설정
      const taskStartDate = addDays(startDate, index);
      // 시작 시간: 오전 9시
      const taskStartTime = setHours(setMinutes(taskStartDate, 0), 9);
      // 종료 시간: 오전 10시 (1시간 소요)
      const taskEndTime = setHours(setMinutes(taskStartDate, 0), 10);

      return {
        title: task.groupName,
        description: task.subtaskName,
        start: taskStartTime,
        end: taskEndTime,
      };
    });

    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    const formattedMonth = format(today, 'yyyy-MM');
    const formattedYear = format(today, 'yyyy');

    createProjectSchedules(
      {
        projectId: projectIdNumber,
        eventDataList: eventDataList,
        options: {
          is_project_schedule: true,
          is_ai_recommended: true,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['project-daily-schedules', projectIdNumber, formattedDate],
          });
          queryClient.invalidateQueries({
            queryKey: ['project-monthly-schedules', projectIdNumber, formattedMonth],
          });
          queryClient.invalidateQueries({
            queryKey: ['project-yearly-schedules', projectIdNumber, formattedYear],
          });
          setIsSubmitted(true);
          alert(`${selectedTasks.length}개의 일정이 캘린더에 추가되었습니다.`);
        },
        onError: (error) => {
          console.error('일정 추가 실패:', error);
          alert('일정을 추가하는 중 오류가 발생했습니다.');
        },
      }
    );

    setIsSubmitted(true);
  };

  const isGroupFullySelected = (groupIndex: number) => {
    const group = recommendedTasks[groupIndex];
    return group.subtasks.every((st) => st.isSelected);
  };

  const isGroupPartiallySelected = (groupIndex: number) => {
    const group = recommendedTasks[groupIndex];
    return group.subtasks.some((st) => st.isSelected) && !group.subtasks.every((st) => st.isSelected);
  };

  const handleAccordionChange = (groupId: string) => {
    setExpanded(expanded === groupId ? null : groupId);
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px" mt={8}>
        <Image src={'/images/addmeeting2.svg'} width={200} height={200} alt={'로고'} />
        <CircularProgress size={30} sx={{ mt: 5 }} />
        <Typography variant="h6" sx={{ mt: 2, fontSize: '1rem' }}>
          Looper가 프로젝트에 맞는 태스크를 분석하는 중입니다...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          AI 분석에는 약 30초~1분 정도 소요될 수 있습니다.
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        태스크 정보를 불러오는 중 오류가 발생했습니다: {error?.message || '알 수 없는 오류'}
      </Alert>
    );
  }

  if (recommendedTasks.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        현재 추천할 태스크가 없습니다. 프로젝트 세부 정보를 더 입력해주시면 더 좋은 추천을 받을 수 있습니다.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#528ad3' }}>
        Looper가 추천하는 태스크
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        회의록을 분석하여 필요한 태스크를 추천해드립니다. 원하는 태스크를 선택하여 캘린더에 추가해보세요.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          backgroundColor: 'rgba(82, 138, 211, 0.1)',
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography>
          <strong>{getSelectedSubtaskCount()}</strong> / {getTotalSubtaskCount()} 개 태스크 선택됨
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleSelectAll(true)}
          startIcon={<CheckIcon />}
          disabled={isSubmitted}
        >
          전체 선택
        </Button>
      </Box>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          maxHeight: '500px',
          position: 'relative',
          mb: 3,
        }}
      >
        <Box
          sx={{
            overflowY: 'auto',
            maxHeight: '500px',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: 2,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: 2,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#a8a8a8',
            },
          }}
        >
          {recommendedTasks.map((group, groupIndex) => (
            <Accordion
              key={`group-${groupIndex}`}
              expanded={expanded === `group-${groupIndex}`}
              onChange={() => handleAccordionChange(`group-${groupIndex}`)}
              sx={{ boxShadow: 'none' }}
              disabled={isSubmitted}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={isGroupFullySelected(groupIndex)}
                      indeterminate={isGroupPartiallySelected(groupIndex)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleGroupChange(groupIndex, !isGroupFullySelected(groupIndex));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isSubmitted}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {group.keyword}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${group.subtasks.filter((st) => st.isSelected).length}/${group.subtasks.length}`}
                    size="small"
                    color={isGroupFullySelected(groupIndex) ? 'primary' : 'default'}
                    sx={{ mr: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding>
                  {group.subtasks.map((subtask, subtaskIndex) => (
                    <Fragment key={subtask.id}>
                      <ListItem
                        sx={{
                          pl: 4,
                          py: 1,
                          transition: 'background-color 0.2s',
                          '&:hover': { bgcolor: isSubmitted ? 'inherit' : 'rgba(0, 0, 0, 0.03)' },
                          pointerEvents: isSubmitted ? 'none' : 'auto',
                          opacity: isSubmitted ? 0.7 : 1,
                        }}
                        onClick={(e) => {
                          if (!isSubmitted) {
                            e.stopPropagation();
                            handleSubtaskChange(groupIndex, subtask.id);
                          }
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={subtask.isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (!isSubmitted) {
                                  handleSubtaskChange(groupIndex, subtask.id);
                                }
                              }}
                              disabled={isSubmitted}
                            />
                          }
                          label={subtask.name}
                          sx={{ width: '100%' }}
                        />
                      </ListItem>
                      {subtaskIndex < group.subtasks.length - 1 && <Divider variant="inset" component="li" />}
                    </Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CalendarIcon />}
          onClick={handleAddToCalendar}
          disabled={getSelectedSubtaskCount() === 0 || isSubmitted}
          sx={{
            mt: 8,
            width: '100%',
            px: 4,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          선택한 {getSelectedSubtaskCount()}개 태스크 캘린더에 추가하기
        </Button>
      </Box>
    </Box>
  );
}
