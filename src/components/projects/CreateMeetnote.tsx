'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import style from './CreateMeetnote.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function CreateMeetnote() {
  const [step, setStep] = useState(0);

  const renderContent = () => {
    switch (step) {
      case 0:
        return <FirstState />;
      case 1:
        return <SecondState />;
      case 2:
        return <ThirdState />;
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
    return <div>step 1</div>;
  }

  function ThirdState() {
    return <div>step 2</div>;
  }

  return <div className={style.container}>{renderContent()}</div>;
}
