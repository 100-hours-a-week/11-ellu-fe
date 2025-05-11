import { ReactNode } from 'react';
import style from './layout.module.css';
import LeftNavigationBar from '@/components/LeftNavigationBar';
import AfterLoginHeader from '@/components/AfterLoginHeader';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuthProvider from '@/components/auth/AuthProvider';

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    redirect('/auth/login');
  }

  return (
    <AuthProvider>
      <div className={style.container}>
        <AfterLoginHeader />
        <div className={style.box}>
          <LeftNavigationBar />
          <div className={style.mainbox}>{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
