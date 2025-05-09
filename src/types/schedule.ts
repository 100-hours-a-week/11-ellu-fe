export interface Subtask {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface TaskGroup {
  keyword: string;
  subtasks: Subtask[];
}

export interface RecommendedScheduleData {
  detail: TaskGroup[];
}
