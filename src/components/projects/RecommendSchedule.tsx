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
  IconButton,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { CalendarMonth as CalendarIcon, ExpandMore as ExpandMoreIcon, Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// 새로운 데이터 타입 정의
interface Subtask {
  id: string;
  name: string;
  isSelected: boolean;
}

interface TaskGroup {
  keyword: string;
  subtasks: Subtask[];
}

interface RecommendedScheduleData {
  detail: TaskGroup[];
}

export default function RecommendSchedule() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [loading, setLoading] = useState(true);
  const [recommendedTasks, setRecommendedTasks] = useState<TaskGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 목업 데이터 및 로딩 시뮬레이션
  useEffect(() => {
    const fetchRecommendedSchedules = async () => {
      setLoading(true);

      try {
        // 로딩 시뮬레이션 (3초)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // 목업 데이터 - 새로운 형식
        const mockData: RecommendedScheduleData = {
          detail: [
            {
              keyword: 'API 설계하기',
              subtasks: [
                { id: '1-1', name: 'API 엔드포인트 설계', isSelected: false },
                { id: '1-2', name: 'Swagger 문서 작성', isSelected: false },
                { id: '1-3', name: '예시 응답 추가', isSelected: false },
              ],
            },
            {
              keyword: '테스트코드 작성하기',
              subtasks: [
                { id: '2-1', name: '단위테스트 작성', isSelected: false },
                { id: '2-2', name: '통합테스트 작성', isSelected: false },
              ],
            },
            {
              keyword: '프론트엔드 개발',
              subtasks: [
                { id: '3-1', name: '컴포넌트 설계', isSelected: false },
                { id: '3-2', name: '상태 관리 구현', isSelected: false },
                { id: '3-3', name: 'API 연동', isSelected: false },
                { id: '3-4', name: '스타일링', isSelected: false },
              ],
            },
            {
              keyword: '배포 준비',
              subtasks: [
                { id: '4-1', name: 'CI/CD 파이프라인 구축', isSelected: false },
                { id: '4-2', name: '환경 설정', isSelected: false },
                { id: '4-3', name: '모니터링 도구 세팅', isSelected: false },
              ],
            },
          ],
        };

        setRecommendedTasks(mockData.detail);
        setError(null);
      } catch (err) {
        console.error('일정 추천을 가져오는 데 실패했습니다:', err);
        setError('일정 추천을 가져오는 데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedSchedules();
  }, [projectId]);

  // 단일 서브태스크 체크박스 변경 핸들러
  const handleSubtaskChange = (groupIndex: number, subtaskId: string) => {
    console.log('체크박스 변경:', groupIndex, subtaskId); // 디버깅용 로그 추가

    const newTasks = [...recommendedTasks];
    const subtaskIndex = newTasks[groupIndex].subtasks.findIndex((st) => st.id === subtaskId);

    if (subtaskIndex !== -1) {
      newTasks[groupIndex].subtasks[subtaskIndex].isSelected = !newTasks[groupIndex].subtasks[subtaskIndex].isSelected;
      setRecommendedTasks(newTasks);
    }
  };

  // 그룹의 모든 서브태스크 체크박스 변경 핸들러
  const handleGroupChange = (groupIndex: number, isSelected: boolean) => {
    setRecommendedTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[groupIndex].subtasks = newTasks[groupIndex].subtasks.map((st) => ({
        ...st,
        isSelected,
      }));
      return newTasks;
    });
  };

  // 모든 서브태스크 체크박스 변경 핸들러
  const handleSelectAll = (isSelected: boolean) => {
    setRecommendedTasks((prevTasks) => {
      return prevTasks.map((group) => ({
        ...group,
        subtasks: group.subtasks.map((st) => ({
          ...st,
          isSelected,
        })),
      }));
    });
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
    // 선택된 서브태스크만 필터링
    const selectedTasks = recommendedTasks.flatMap((group) => {
      return group.subtasks
        .filter((st) => st.isSelected)
        .map((st) => ({
          groupName: group.keyword,
          subtaskName: st.name,
          id: st.id,
        }));
    });
    setIsSubmitted(true);
    console.log('캘린더에 추가할 태스크:', selectedTasks);
  };

  const isGroupFullySelected = (groupIndex: number) => {
    const group = recommendedTasks[groupIndex];
    return group.subtasks.every((st) => st.isSelected);
  };

  const isGroupPartiallySelected = (groupIndex: number) => {
    const group = recommendedTasks[groupIndex];
    return group.subtasks.some((st) => st.isSelected) && !group.subtasks.every((st) => st.isSelected);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px" mt={8}>
        <Image src={'/images/addmeeting2.svg'} width={200} height={200} alt={'로고'} />
        <CircularProgress size={30} sx={{ mt: 4 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Looper가 프로젝트에 맞는 태스크를 분석하는 중입니다...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
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
      <Typography variant="h5" gutterBottom fontWeight="bold">
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
        <Button variant="outlined" color="primary" onClick={() => handleSelectAll(true)} startIcon={<CheckIcon />} disabled={isSubmitted}>
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
              onChange={() => setExpanded(expanded === `group-${groupIndex}` ? null : `group-${groupIndex}`)}
              sx={{ boxShadow: 'none' }}
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
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubtaskChange(groupIndex, subtask.id);
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={subtask.isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSubtaskChange(groupIndex, subtask.id);
                              }}
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

      {/* 완료 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CalendarIcon />}
          onClick={handleAddToCalendar}
          disabled={getSelectedSubtaskCount() === 0 || isSubmitted}
          sx={{
            mt: 7,
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
