'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconButton, Box, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EventData } from '@/types/calendar';
import EditScheduleForm from '@/components/form/EditScheduleForm';
import style from './page.module.css';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const scheduleId = params.scheduleId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<EventData | null>(null);

  useEffect(() => {
    // API 호출로 대체
    const timer = setTimeout(() => {
      const mockData: EventData = {
        id: scheduleId,
        title: '미팅 일정',
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000),
        description: '프로젝트 진행 상황 논의',
      };

      setScheduleData(mockData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [projectId, scheduleId]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Link href={`/projects/${projectId}`}>
          <IconButton
            sx={{
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              '& .MuiSvgIcon-root': {
                fontSize: '2rem',
                color: 'black',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Link>
        <h1>일정 수정하기</h1>
      </div>
      <div className={style.form}>
        {scheduleData && (
          <EditScheduleForm scheduleData={scheduleData} projectId={projectId} onSuccess={() => router.push(`/projects/${projectId}`)} />
        )}
      </div>
    </div>
  );
}
