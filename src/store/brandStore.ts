import { create } from 'zustand';
import { brandAPI } from '../utils/api';

export interface Brand {
  id: string;
  name: string;
  description: string;
}

interface BrandStore {
  brands: Brand[];
  loading: boolean;
  fetchBrands: () => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (id: string, brand: Omit<Brand, 'id'>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  brands: [],
  loading: false,
  
  fetchBrands: async () => {
    set({ loading: true });
    try {
      const brands = await brandAPI.getAll();
      set({ brands, loading: false });
    } catch (error) {
      console.error('Fetch brands error:', error);
      set({ loading: false });
    }
  },
  
  addBrand: async (brand) => {
    try {
      const newBrand = await brandAPI.create(brand);
      set((state) => ({ brands: [...state.brands, newBrand] }));
    } catch (error) {
      console.error('Add brand error:', error);
      alert('Failed to add brand');
    }
  },
  
  updateBrand: async (id, brand) => {
    try {
      const updatedBrand = await brandAPI.update(id, brand);
      set((state) => ({
        brands: state.brands.map((b) => (b.id === id ? updatedBrand : b))
      }));
    } catch (error) {
      console.error('Update brand error:', error);
      alert('Failed to update brand');
    }
  },
  
  deleteBrand: async (id) => {
    try {
      await brandAPI.delete(id);
      set((state) => ({
        brands: state.brands.filter((b) => b.id !== id)
      }));
    } catch (error) {
      console.error('Delete brand error:', error);
      alert('Failed to delete brand');
    }
  }
}));