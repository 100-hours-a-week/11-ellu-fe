import Button from '@mui/material/Button';
import Link from 'next/link';
import Image from 'next/image';
import style from './page.module.css';

export default function Home() {
  return (
    <div className={style.container}>
      <div className={style.topBox}>
        <h1>Looper</h1>
        <h2>세상의 모든 P를 위한 캘린더</h2>
        <p>
          Looper는 복잡한 일정을 쉽게 정리하고, <br />
          장기 목표를 루틴으로 만들어주는 스마트 일정 관리 서비스입니다.
        </p>
        <Link href={'/auth/login'}>
          <Button
            sx={{
              width: '170px',
              fontSize: '25px',
              padding: '10px',
            }}
            variant="contained"
          >
            로그인
          </Button>
        </Link>
      </div>
      <div className={style.middleBox}>
        <Image src={'/images/onboarding1.svg'} width={600} height={600} alt={'소개이미지'} />
        <h1>회의록도 프로젝트도, 자동 분석으로 루틴 완성</h1>
        <p>
          단순한 캘린더를 넘어, 메모·회의록 속 중요한 정보를 자동 분석해 일정으로 변환하고, 운동이나 학습 같은 프로젝트도 단계별 루틴으로 세분화해
          드립니다.
        </p>
      </div>
      <div className={style.endBox}>
        <Image src={'/images/onboarding2.svg'} width={500} height={500} alt={'소개이미지'} />
        <h1>시각화부터 알림까지, 완성도 높은 루틴 관리</h1>
        <p>일정 시각화, 리마인드 알림, 공유 기능까지, 루틴 관리의 새로운 기준을 제시합니다.</p>
      </div>
    </div>
  );
}
