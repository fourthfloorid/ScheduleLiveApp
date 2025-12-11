import { create } from 'zustand';
import { roomAPI } from '../utils/api';

export interface RoomAssignment {
  brandId: string;
  brandName: string;
  hostId: string;
  hostName: string;
  sessions: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  assignments?: RoomAssignment[];
}

interface RoomStore {
  rooms: Room[];
  loading: boolean;
  fetchRooms: () => Promise<void>;
  addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
  updateRoom: (id: string, room: Omit<Room, 'id'>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  loading: false,
  
  fetchRooms: async () => {
    set({ loading: true });
    try {
      const rooms = await roomAPI.getAll();
      set({ rooms, loading: false });
    } catch (error) {
      console.error('Fetch rooms error:', error);
      set({ loading: false });
    }
  },
  
  addRoom: async (room) => {
    try {
      const newRoom = await roomAPI.create(room);
      set((state) => ({ rooms: [...state.rooms, newRoom] }));
    } catch (error) {
      console.error('Add room error:', error);
      alert('Failed to add room');
    }
  },
  
  updateRoom: async (id, room) => {
    try {
      const updatedRoom = await roomAPI.update(id, room);
      set((state) => ({
        rooms: state.rooms.map((r) => (r.id === id ? updatedRoom : r))
      }));
    } catch (error) {
      console.error('Update room error:', error);
      alert('Failed to update room');
    }
  },
  
  deleteRoom: async (id) => {
    try {
      await roomAPI.delete(id);
      set((state) => ({
        rooms: state.rooms.filter((r) => r.id !== id)
      }));
    } catch (error) {
      console.error('Delete room error:', error);
      alert('Failed to delete room');
    }
  }
}));