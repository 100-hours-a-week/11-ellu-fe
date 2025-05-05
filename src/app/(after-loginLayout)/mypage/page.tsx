import style from './page.module.css';
import MypageForm from '@/components/form/MypageForm';

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <MypageForm />
      </div>
    </div>
  );
}
