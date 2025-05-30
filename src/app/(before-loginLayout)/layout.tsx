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
          <div className={style.footerContent}>
            <h1>Looper</h1>
            <p>Ellus'project</p>
          </div>
          <div className={style.footerBottom}>
            <p>© 2025 Looper. All rights reserved.</p>
            <p>Email.&nbsp;help@looper.my</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
