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
}

// 프로젝트 수정타입
export interface EditProjectParams {
  projectId: number;
  data: ProjectFormData;
}
