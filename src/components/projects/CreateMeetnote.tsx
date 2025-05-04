'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import style from './CreateMeetnote.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TextField, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RecommendSchedule from './RecommendSchedule';

export default function CreateMeetnote() {
  const [step, setStep] = useState(0);

  const renderContent = () => {
    switch (step) {
      case 0:
        return <FirstState />;
      case 1:
        return <SecondState />;
      case 2:
        return <RecommendSchedule />;
      default:
        return <div>알 수 없는 상태</div>;
    }
  };

  function FirstState() {
    return (
      <div className={style.firstState} onClick={() => setStep(1)}>
        <Image src={'/images/addmeeting.svg'} width={200} height={200} alt={'소개이미지'} />
        <AddCircleOutlineIcon sx={{ fontSize: 30, color: '#528ad3' }} />
        <h1>
          클릭하여 오늘의 스크럼 회의록을 추가하고 <br /> 캘린더에서 나의 할 일을 확인하세요.
        </h1>
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
      console.log('회의록:', meetingNote);
      setStep(2);
    };

    return (
      <div className={style.secondState}>
        <h2>오늘의 스크럼 회의록</h2>
        <p>오늘 진행된 회의 내용을 자유롭게 작성해주세요</p>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="회의록"
            value={meetingNote}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={16}
            placeholder="오늘의 스크럼 회의에서 논의된 내용을 입력하세요..."
            required
            helperText={`${meetingNote.length}/1000자 (최소 10자, 최대 1000자)`}
            error={(meetingNote.length > 0 && meetingNote.length < 10) || meetingNote.length > 1000}
          />

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
