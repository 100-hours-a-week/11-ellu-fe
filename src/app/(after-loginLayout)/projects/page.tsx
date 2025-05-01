import { redirect } from 'next/navigation';
import style from './page.module.css';
import { cookies } from 'next/headers';
import { getAccessToken } from '@/api/auth';
import { getProjects } from '@/api/project';
import Link from 'next/link';
import Image from 'next/image';

export default async function Page() {
  // const cookieStore = await cookies();
  // const refreshToken = cookieStore.get('refreshToken')?.value;

  // if (!refreshToken) {
  //   redirect('/auth/login');
  // }

  // const accessToken = await getAccessToken(refreshToken);
  // if (!accessToken) {
  //   redirect('/auth/login');
  // }

  // const projects = await getProjects(accessToken);

  const projects: any[] = [
    // {
    //   title: '프로젝트 1',
    //   members: [
    //     { nickname: '홍길동', profile_image_url: 'https://example.com/profile1.jpg' },
    //     { nickname: '오쌤', profile_image_url: 'https://example.com/profile2.jpg' },
    //   ],
    // },
    // {
    //   title: '프로젝트 2',
    //   members: [{ nickname: '홍길동', profile_image_url: 'https://example.com/profile1.jpg' }],
    // },
  ];

  return (
    <div className={style.container}>
      <h1>나의 프로젝트</h1>
      <div className={style.projectList}>
        {projects.length > 0 ? (
          <ul>
            {projects.map((p) => (
              <li key={p.title}>{p.title}</li>
            ))}
          </ul>
        ) : (
          <Link href="/projects/create" className={style.noProject}>
            <Image src="/images/createproject.svg" alt="프로젝트 없음" width={300} height={300} />
            <div>
              프로젝트를 추가하여 <br /> Looper를 시작해보세요!
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
