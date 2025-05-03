import style from './page.module.css';
import Link from 'next/link';
import ProjectsList from '@/components/projects/ProjectsList';

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>나의 프로젝트</h1>
        <Link href="/projects/create" className={style.createProject}>
          프로젝트 생성하기
        </Link>
      </div>
      <div className={style.projectList}>
        <ProjectsList />
      </div>
    </div>
  );
}
