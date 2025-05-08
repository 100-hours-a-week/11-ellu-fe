'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconButton, Box, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditScheduleForm from '@/components/form/EditScheduleForm';
import style from './page.module.css';
import { useScheduleStore } from '@/stores/scheduleStore';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const scheduleId = params.scheduleId as string;

  const { currentSchedule } = useScheduleStore();

  if (!currentSchedule) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60%" flexDirection="column" gap={2}>
        <Alert severity="error">일정 정보를 찾을 수 없습니다. 프로젝트 캘린더에서 일정을 다시 선택해주세요.</Alert>
        <Link href={`/projects/${projectId}`}>
          <button>프로젝트 캘린더로 돌아가기</button>
        </Link>
      </Box>
    );
  }

  // 클릭한 일정 ID와 URL의 ID가 다른 경우 (선택 사항)
  if (currentSchedule.id !== scheduleId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60%" flexDirection="column" gap={2}>
        <Alert severity="warning">
          요청한 일정 ID({scheduleId})와 현재 선택된 일정 ID({currentSchedule.id})가 일치하지 않습니다.
        </Alert>
        <Link href={`/projects/${projectId}`}>
          <button>프로젝트 캘린더로 돌아가기</button>
        </Link>
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
        <EditScheduleForm
          scheduleData={currentSchedule}
          projectId={projectId}
          onSuccess={() => {
            router.push(`/projects/${projectId}`);
          }}
        />
      </div>
    </div>
  );
}
