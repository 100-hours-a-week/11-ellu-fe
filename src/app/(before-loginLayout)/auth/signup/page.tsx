import style from './page.module.css';
import SignupForm from '@/components/form/SignupForm';

export default function Page() {
  return (
    <div className={style.container}>
      <h1>Looper에서 사용할 닉네임을 입력해주세요</h1>
      <h2>회의록에서 사용할 이름과 동일하게 입력해주세요</h2>
      <SignupForm />
    </div>
  );
}
