import { Project } from '@/types/api/project';

export async function getProjects(accessToken: string): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/projects`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('프로젝트 목록 불러오기 실패');
  }

  const json = await res.json();
  return json.data.data;
}
