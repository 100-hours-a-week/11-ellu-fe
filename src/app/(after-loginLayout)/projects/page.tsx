import { redirect } from "next/navigation";
import style from "./page.module.css";
import { cookies } from "next/headers";
import { getAccessToken } from "@/api/auth";
import { getProjects } from "@/api/project";
import Link from "next/link";
import Image from "next/image";
import ProjectsList from "@/components/projects/ProjectsList";
import { Project } from "@/types/api/project";

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

  const projects: Project[] = [
    {
      title: "프로젝트 1",
      color: "blue",
      members: [
        {
          nickname: "홍길동",
          profile_image_url: "/images/createproject.svg",
        },
        {
          nickname: "오쌤",
          profile_image_url: "/images/createproject.svg",
        },
      ],
    },
    {
      title: "프로젝트 2",
      color: "blue",
      members: [
        {
          nickname: "홍길동",
          profile_image_url: "/images/createproject.svg",
        },
      ],
    },
  ];

  return (
    <div className={style.container}>
      <h1>나의 프로젝트</h1>
      <div className={style.projectList}>
        {projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <Link href="/projects/create" className={style.noProject}>
            <Image
              src="/images/createproject.svg"
              alt="프로젝트 없음"
              width={270}
              height={270}
            />
            <div>
              프로젝트를 추가하여 <br /> Looper를 시작해보세요!
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
