'use client';

import Image from 'next/image';
import { useState } from 'react';
import style from './CreateMeetnote.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { useCreateMeetingNote } from '@/hooks/api/projects/useCreateMeetingNote';
import RecommendSchedule from './RecommendSchedule';
import { RecommendedSchedules } from '@/types/api/project';

export default function CreateMeetnote({ projectId }: { projectId: string }) {
  const { mutate: createMeetingNote, isPending } = useCreateMeetingNote();
  const [recommendedTasks, setRecommendedTasks] = useState<RecommendedSchedules>([]);

  const [step, setStep] = useState(0);

  const renderContent = () => {
    switch (step) {
      case 0:
        return <FirstState />;
      case 1:
        return <SecondState />;
      case 2:
        return <RecommendSchedule recommendedTasksData={recommendedTasks} />;
      default:
        return <div>알 수 없는 상태</div>;
    }
  };

  function FirstState() {
    return (
      <div className={style.firstState} onClick={() => setStep(1)}>
        <Image src={'/images/addmeeting.svg'} width={200} height={200} alt={'소개이미지'} />
        <AddCircleOutlineIcon sx={{ fontSize: 30, color: '#528ad3' }} />
        <div className={style.titleText}>
          클릭하여 오늘의 스크럼 회의록을 추가하고 <br /> 캘린더에서 나의 할 일을 확인하세요.
        </div>
      </div>
    );
  }

  function SecondState() {
    const [meetingNote, setMeetingNote] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMeetingNote(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isPending) return;

      createMeetingNote(
        {
          projectId: parseInt(projectId),
          meetingNote: meetingNote,
        },
        {
          onSuccess: (data) => {
            setRecommendedTasks(data);
            setStep(2);
          },
          onError: (err) => {
            console.error('회의록 저장 실패:', err);
            alert('회의록 저장에 실패했습니다. 다시 시도해주세요.');
          },
        }
      );
    };

    if (isPending) {
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

    return (
      <div className={style.secondState}>
        <h2>오늘의 스크럼 회의록</h2>
        <p>데일리스크럼 때 작성하신 표 전체를 복사붙여넣기 해주세요</p>

        <form onSubmit={handleSubmit} className={style.formContainer}>
          <div className={style.textFieldContainer}>
            <TextField
              fullWidth
              label="회의록"
              value={meetingNote}
              onChange={handleChange}
              variant="outlined"
              multiline
              placeholder="오늘의 스크럼 회의에서 논의된 내용을 입력하세요..."
              required
              helperText={`${meetingNote.length}/1000자 (최소 10자, 최대 1000자)`}
              error={(meetingNote.length > 0 && meetingNote.length < 10) || meetingNote.length > 1000}
              sx={{
                height: '100%',
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                  alignItems: 'flex-start',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                  '& textarea': {
                    height: '100% !important',
                    overflow: 'auto !important',
                    resize: 'none',
                  },
                },
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '10px',
              }}
            />
          </div>

          <div className={style.secondbutton}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={meetingNote.length < 10 || meetingNote.length > 1000}
              sx={{ width: '80px' }}
            >
              저장
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return <div className={style.container}>{renderContent()}</div>;
}
