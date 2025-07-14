import style from './page.module.css';
import MypageForm from '@/components/form/MypageForm';
import UserProgressChart from '@/components/UserProgressChart';

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <MypageForm />
      </div>
      <div className={style.chartContainer}>
        <div className={style.chartTitle}>나의 일정 생성 히스토리</div>
        <UserProgressChart />
      </div>
    </div>
  );
}
