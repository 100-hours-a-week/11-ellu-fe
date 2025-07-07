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
        <UserProgressChart />
      </div>
    </div>
  );
}
