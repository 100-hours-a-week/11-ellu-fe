export interface ProjectMember {
  nickname: string;
  profile_image_url: string;
}

export interface Project {
  id: number;
  title: string;
  color: string;
  members: ProjectMember[];
}
