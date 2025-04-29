<<<<<<< HEAD:src/app/auth/login/page.tsx
export default function Page() {
  return <div>로그인 페이지</div>;
=======
import Image from 'next/image';
import style from './page.module.css';

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.topBox}>
        <h1>Looper</h1>
        <h2>세상의 모든 P를 위한 캘린더</h2>
        <p>
          Looper는 복잡한 일정을 쉽게 정리하고, <br />
          장기 목표를 루틴으로 만들어주는 스마트 일정 관리 서비스입니다.
        </p>
        <p>하루를 더 똑똑하게, 루퍼와 함께 시작하세요</p>
        <div className={style.fastimg}>
          <img src="/images/loginFast.png" alt="회원가입" />
        </div>
        <a href="https://www.example.com">
          <Image src={'/images/KakaoLogin.svg'} width={300} height={300} alt={'카카오로그인'} />
        </a>
      </div>
      <div className={style.middleBox}>
        <Image src={'/images/onboarding1.svg'} width={600} height={600} alt={'소개이미지'} />
        <h1>회의록도 프로젝트도, 자동 분석으로 루틴 완성</h1>
        <p>
          단순한 캘린더를 넘어, 메모·회의록 속 중요한 정보를 자동 분석해 일정으로 변환하고, 운동이나 학습 같은 프로젝트도 단계별 루틴으로 세분화해
          드립니다.
        </p>
      </div>
    </div>
  );
>>>>>>> 9e8d35e (feat: 회원가입 페이지 퍼블리싱 완료):src/app/(before-loginLayout)/auth/login/page.tsx
}
