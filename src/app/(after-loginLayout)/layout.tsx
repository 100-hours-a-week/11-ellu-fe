import { ReactNode } from 'react';
import style from './layout.module.css';
import LeftNavigationBar from '@/components/LeftNavigationBar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={style.container}>
      <LeftNavigationBar />
      {children}
    </div>
  );
}
