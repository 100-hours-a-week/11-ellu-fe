import { ReactNode } from 'react';
import style from './layout.module.css';
import MainHeader from '@/components/MainHeader';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MainHeader />
      <div>
        {children}
        <footer className={style.footer}>
          <h1>Looper</h1>
          <p>Ellu's Project</p>
        </footer>
      </div>
    </div>
  );
}
