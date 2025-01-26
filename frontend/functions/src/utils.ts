export type TaskCategory =
  | "Academic"
  | "Extracurricular"
  | "Work"
  | "Miscellaneous";
export type TaskPriority = "High" | "Medium" | "Low";

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  reminderDays: number;
  tasks: Task[];
};

export type Task = {
  id: string;
  name: string;
  deadline: string;
  category: TaskCategory;
  priority: TaskPriority;
  description: string;
  notes: string;
  reminder: boolean;
  completed: boolean;
};