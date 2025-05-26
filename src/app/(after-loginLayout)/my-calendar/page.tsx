'use client';

import dynamic from 'next/dynamic';
import style from './page.module.css';
import CalendarSkeleton from '@/components/skeleton/CalendarSkeleton';

// 로딩되는 동안 스켈레톤 표시
const Calendar = dynamic(() => import('@/components/Calendar'), {
  loading: () => <CalendarSkeleton />,
  ssr: false,
});

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.calendar}>
        <Calendar />
      </div>
    </div>
  );
}
