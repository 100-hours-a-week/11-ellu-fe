import api from '@/lib/axios';
import { ApiResponse } from '@/types/api/common';
import { ProjectFormData, Project, ProjectDetail, RecommendedScheduleData } from '@/types/api/project';

// 전체 프로젝트 목록 조회
export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get<ApiResponse<Project[]>>('/projects');
  return res.data.data;
};

// 프로젝트 상세정보 조회
export const getProjectById = async (projectId: number): Promise<ProjectDetail> => {
  const res = await api.get<ApiResponse<ProjectDetail>>(`/projects/${projectId}`);
  return res.data.data;
};

//프로젝트 생성
export const createProject = async (projectData: ProjectFormData): Promise<void> => {
  await api.post<ApiResponse<void>>('/projects', projectData);
};

//프로젝트 수정
export const editProject = async (projectId: number, projectData: ProjectFormData): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/projects/${projectId}`, projectData);
};

// 프로젝트 삭제
export const deleteProject = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/projects/${id}`);
};

// 회의록 추가
export const createProjectMeetingNote = async (projectId: number, meetingNote: string): Promise<void> => {
  await api.post<ApiResponse<void>>(`/projects/${projectId}/notes`, {
    meeting_note: meetingNote,
  });
};

// 회의록 기반 AI 추천일정 받아오기
export const getRecommendedSchedule = async (projectId: number): Promise<RecommendedScheduleData> => {
  const res = await api.get<ApiResponse<RecommendedScheduleData>>(`/projects/${projectId}/tasks/preview`);
  return res.data.data;
};
