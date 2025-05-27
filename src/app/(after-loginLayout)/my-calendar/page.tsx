'use client';

import style from './page.module.css';
import Calendar from '@/components/Calendar';

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.calendar}>
        <Calendar />
      </div>
    </div>
  );
}
