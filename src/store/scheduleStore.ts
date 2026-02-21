import { create } from 'zustand';
import { scheduleAPI } from '../utils/api';

export interface HostAvailability {
  id: string;
  hostId: string;
  hostName: string;
  date: string;
  availableSessions: number;
  assignedSessions: number;
}

interface ScheduleStore {
  schedules: HostAvailability[];
  loading: boolean;
  fetchSchedules: () => Promise<void>;
  submitAvailability: (date: string, sessions: number) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  loading: false,
  
  fetchSchedules: async () => {
    set({ loading: true });
    try {
      const schedules = await scheduleAPI.getAll();
      set({ schedules, loading: false });
    } catch (error) {
      console.error('Fetch schedules error:', error);
      // Don't throw, just set empty state
      set({ loading: false, schedules: [] });
    }
  },
  
  submitAvailability: async (date: string, sessions: number) => {
    try {
      const newAvailability = await scheduleAPI.create({ date, sessions });
      set((state) => ({ schedules: [...state.schedules, newAvailability] }));
    } catch (error) {
      console.error('Submit availability error:', error);
      alert('Failed to submit availability');
    }
  },
  
  deleteAvailability: async (id: string) => {
    try {
      await scheduleAPI.delete(id);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id)
      }));
    } catch (error) {
      console.error('Delete availability error:', error);
      alert('Failed to delete availability');
    }
  }
}));