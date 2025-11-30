// types/index.ts

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: Priority;
  estimatedTime: number; // in minutes
  createdAt: string; // ISO date string
  category?: 'work' | 'personal' | 'study' | 'health';
};

export type UserStats = {
  totalFocusTime: number; // in minutes
  tasksCompleted: number;
  tasksCreated: number;
  streakDays: number;
  dailyGoalMinutes: number; // e.g., 360 minutes (6 hours)
};

// This is for the AI "Negotiator" response
export type AIPlanResponse = {
  tasks: Omit<Task, 'id' | 'createdAt' | 'status'>[];
  analysis: string; // The AI's comment on your workload
  isOverloaded: boolean;
};