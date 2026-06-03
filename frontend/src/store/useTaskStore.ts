import { create } from 'zustand';
import {
  completeTask as apiCompleteTask,
  createTask as apiCreateTask,
  fetchTasks as apiFetchTasks,
  type CreateTaskInput,
  type Task,
} from '@/api';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  completingId: string | null;

  loadTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<boolean>;
  completeTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  completingId: null,

  loadTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await apiFetchTasks();
      set({ tasks, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load tasks',
      });
    }
  },

  addTask: async (input) => {
    set({ error: null });
    try {
      await apiCreateTask(input);
      await get().loadTasks();
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create task' });
      return false;
    }
  },

  completeTask: async (id) => {
    set({ error: null, completingId: id });
    try {
      await apiCompleteTask(id);
      await get().loadTasks();
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to complete task' });
    } finally {
      set({ completingId: null });
    }
  },

  clearError: () => set({ error: null }),
}));
