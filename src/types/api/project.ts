export interface ProjectMember {
  nickname: string;
  profile_image_url: string;
}

export interface Project {
  title: string;
  // color: string;
  members: ProjectMember[];
}
