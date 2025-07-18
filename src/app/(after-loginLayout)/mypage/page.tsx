'use client';

import style from './page.module.css';
import MypageForm from '@/components/form/MypageForm';
import UserProgressChart from '@/components/UserProgressChart';
import UserPieChartSkeleton from '@/components/skeleton/UserPieChartSkeleton';
import dynamic from 'next/dynamic';

const UserPieChart = dynamic(() => import('@/components/UserPieChart'), {
  ssr: false,
  loading: () => <UserPieChartSkeleton />,
});

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <MypageForm />
      </div>
      <div className={style.chartContainer}>
        <div className={style.chartTitle}>My Looper History</div>
        <div>
          <UserProgressChart />
        </div>
        <div className={style.piechart}>
          <UserPieChart />
        </div>
      </div>
    </div>
  );
}
