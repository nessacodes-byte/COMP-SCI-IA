import React, { Dispatch, SetStateAction } from "react";

export type TaskCategory =
  | "Academic"
  | "Extracurricular"
  | "Work"
  | "Miscellaneous";
export type TaskPriority = "High" | "Medium" | "Low";

export const categories = [
  "Academic",
  "Extracurricular",
  "Work",
  "Miscellaneous",
];
export const priorities = ["High", "Medium", "Low"];

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

export type FirestoreTask = {
  id: string;
  name: string;
  deadline: { seconds: number; nanoseconds: number };
  category: TaskCategory;
  priority: TaskPriority;
  description: string;
  notes: string;
  reminder: boolean;
  completed: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  reminderDays: number;
  tasks: Task[];
};

export type FirestoreUser = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  reminderDays: number;
  tasks: FirestoreTask[];
};

export type AuthContextType = {
  userLoggedIn: boolean;
  currentUser: User | null;
  isLoading: boolean;
  setCurrentUser: (user: User | null) => Promise<void>;
  logout: () => void;
};

export const defaultProfilePicture =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
