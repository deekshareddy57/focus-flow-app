// store/useTaskStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 
import { Task, UserStats } from '@/types';

interface TaskState {
  tasks: Task[];
  stats: UserStats;
  isFocusMode: boolean; // To track if Focus Mode is active
  activeTaskId: string | null; // To know which task we are doing focus on
  
  // Actions
  addTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  setIsFocusMode: (isOn: boolean) => void; 
  setActiveTaskId: (id: string | null) => void; 
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void; 
  setTasks: (tasks: Task[]) => void; 
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      // Initial State
      tasks: [],
      isFocusMode: false, // <--- Default false
      activeTaskId: null, // <--- Default null
      stats: {
        totalFocusTime: 0,
        tasksCompleted: 0,
        tasksCreated: 0,
        streakDays: 1,
        dailyGoalMinutes: 240, 
      },

      // Actions
      addTask: (task) => 
        set((state) => ({ 
          tasks: [...state.tasks, task],
          stats: { ...state.stats, tasksCreated: state.stats.tasksCreated + 1 }
        })),

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      completeTask: (id) =>
        set((state) => {
            const task = state.tasks.find((t) => t.id === id);
            if (!task) return state;

            return {
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
                stats: {
                    ...state.stats,
                    tasksCompleted: state.stats.tasksCompleted + 1,
                    totalFocusTime: state.stats.totalFocusTime + task.estimatedTime 
                }
            };
        }),
        
      setIsFocusMode: (isOn) => set({ isFocusMode: isOn }),  //to get focus mode state
      setActiveTaskId: (id) => set({ activeTaskId: id }), //to set the current active task

      setTasks: (newTasks) => set({ tasks: newTasks }),
    }),
    {
      name: 'focus-flow-storage', // The key in LocalStorage
    }
  )
);