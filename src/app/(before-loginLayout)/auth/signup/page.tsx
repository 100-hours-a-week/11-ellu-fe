import Image from 'next/image';
import style from './page.module.css';
import SignupForm from '@/components/form/SignupForm';

export default function Page() {
  return (
    <div className={style.container}>
      <h1>Looper에서 사용할 닉네임을 입력해주세요</h1>
      <SignupForm />
    </div>
  );
}
