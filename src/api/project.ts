import { ProjectFormData, Project, ProjectDetail } from '@/types/api/project';
import api from '@/lib/axios';

// 전체 프로젝트 조회
export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get('/projects');
  return res.data.data;
};

// 프로젝트 상세정보 조회
export const getProjectById = async (projectId: number): Promise<ProjectDetail> => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data.data;
};

//프로젝트 생성
export const createProject = async (projectData: ProjectFormData): Promise<void> => {
  await api.post('/projects', projectData);
};

//프로젝트 수정
export const editProject = async (projectId: number, projectData: ProjectFormData): Promise<void> => {
  await api.patch(`/projects/${projectId}`, projectData);
};

// 프로젝트 삭제
export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
