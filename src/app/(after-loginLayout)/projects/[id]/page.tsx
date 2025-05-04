import style from './page.module.css';
import Calendar from '@/components/Calendar';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className={style.container}>
      <div className={style.calendar}>
        <Calendar projectId={id} />
      </div>
    </div>
  );
}
