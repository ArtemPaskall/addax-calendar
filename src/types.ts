export interface DayInfo {
  day: number;
  active?: boolean;
  inactive?: boolean;
  fullDate: string;
}

export interface Taskslist {
  date: string;
  tasks: Task[];
}

export interface Task {
  date: string;
  text: string;
  labels: string[];
}