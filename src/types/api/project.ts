// 프로젝트 조회타입
export interface Project {
  id: number;
  title: string;
  color: string;
  members: ProjectMember[];
}
export interface ProjectMember {
  id: number;
  nickname: string;
  profileImageUrl: string;
  position: string;
}

// 프로젝트 상세조회타입
export interface ProjectDetail {
  id: number;
  title: string;
  color: string;
  position: string;
  members: ProjectMember[];
  wiki: string;
}

// 프로젝트 생성타입
export interface ProjectFormData {
  title: string;
  position: string;
  wiki: string;
  color: string;
  members: ProjectMember[];
}

// 프로젝트 수정타입
export interface EditProjectParams {
  projectId: number;
  data: ProjectFormData;
}

// 회의록 기반 AI 추천일정 타입
export interface RecommendedSchedule {
  keyword: string;
  subtasks: string[];
}

export type RecommendedSchedules = RecommendedSchedule[];
