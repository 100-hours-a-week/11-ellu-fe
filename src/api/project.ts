import { Project } from '@/types/api/project';
import api from '@/lib/axios';

// 프로젝트 조회(클라이언트)
export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get('/projects');
  return res.data.data;
};

// 프로젝트 삭제(클라이언트)
export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
