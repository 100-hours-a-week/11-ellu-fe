export interface ProjectMember {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface Project {
  id: number;
  title: string;
  color: string;
  members: ProjectMember[];
}
