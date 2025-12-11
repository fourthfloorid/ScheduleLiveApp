import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-df75f45f`;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authToken || publicAnonKey}`,
});

// Auth API
export const authAPI = {
  signup: async (email: string, password: string, name: string, role: 'host' | 'admin') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Signup API error:', data);
        throw new Error(data.error || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup request failed:', error);
      throw error;
    }
  },

  signin: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Signin API error:', data);
        throw new Error(data.error || 'Signin failed');
      }
      
      if (data.session?.access_token) {
        console.log('Setting auth token from signin response');
        setAuthToken(data.session.access_token);
      } else {
        console.warn('No access token in signin response:', data);
      }
      
      return data;
    } catch (error) {
      console.error('Signin request failed:', error);
      throw error;
    }
  },
};

// Brand API
export const brandAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get brands error:', error);
      throw new Error(error.error || 'Failed to fetch brands');
    }
    
    const data = await response.json();
    return data.brands || [];
  },

  create: async (brand: any) => {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Create brand error:', error);
      throw new Error(error.error || 'Failed to create brand');
    }
    
    const data = await response.json();
    return data.brand;
  },

  update: async (id: string, brand: any) => {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Update brand error:', error);
      throw new Error(error.error || 'Failed to update brand');
    }
    
    const data = await response.json();
    return data.brand;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete brand error:', error);
      throw new Error(error.error || 'Failed to delete brand');
    }
    
    return response.json();
  },
};

// User API
export const userAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get users error:', error);
      throw new Error(error.error || 'Failed to fetch users');
    }
    
    const data = await response.json();
    return data.users || [];
  },

  getBrands: async () => {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get brands error:', error);
      throw new Error(error.error || 'Failed to fetch brands');
    }
    
    const data = await response.json();
    return data.brands || [];
  },

  update: async (id: string, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Update user error:', error);
      throw new Error(error.error || 'Failed to update user');
    }
    
    const data = await response.json();
    return data.user;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete user error:', error);
      throw new Error(error.error || 'Failed to delete user');
    }
    
    return response.json();
  },

  getHostScheduleStats: async () => {
    const response = await fetch(`${API_BASE_URL}/host-schedule-stats`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get host schedule stats error:', error);
      throw new Error(error.error || 'Failed to fetch host schedule stats');
    }
    
    const data = await response.json();
    return data.hostStats || [];
  },

  getMyRooms: async () => {
    const response = await fetch(`${API_BASE_URL}/my-rooms`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get my rooms error:', error);
      throw new Error(error.error || 'Failed to fetch assigned rooms');
    }
    
    const data = await response.json();
    return data.rooms || [];
  },
};

// Room API
export const roomAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get rooms error:', error);
      throw new Error(error.error || 'Failed to fetch rooms');
    }
    
    const data = await response.json();
    return data.rooms || [];
  },

  create: async (room: any) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(room),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Create room error:', error);
      throw new Error(error.error || 'Failed to create room');
    }
    
    const data = await response.json();
    return data.room;
  },

  update: async (id: string, room: any) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(room),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Update room error:', error);
      throw new Error(error.error || 'Failed to update room');
    }
    
    const data = await response.json();
    return data.room;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete room error:', error);
      throw new Error(error.error || 'Failed to delete room');
    }
    
    return response.json();
  },
};

// Schedule API
export const scheduleAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get schedules error:', error);
      throw new Error(error.error || 'Failed to fetch schedules');
    }
    
    const data = await response.json();
    return data.schedules || [];
  },

  create: async (schedule: any) => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(schedule),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Create schedule error:', error);
      throw new Error(error.error || 'Failed to create schedule');
    }
    
    const data = await response.json();
    return data.schedule;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete schedule error:', error);
      throw new Error(error.error || 'Failed to delete schedule');
    }
    
    return response.json();
  },

  getHostAvailability: async (date: string) => {
    const response = await fetch(`${API_BASE_URL}/host-availability/${date}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get host availability error:', error);
      throw new Error(error.error || 'Failed to fetch host availability');
    }
    
    const data = await response.json();
    return data.schedules || [];
  },
};

// Room Assignment API
export const assignmentAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/room-assignments`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Get room assignments error:', error);
      throw new Error(error.error || 'Failed to fetch room assignments');
    }
    
    const data = await response.json();
    return data.assignments || [];
  },

  create: async (assignment: any) => {
    const response = await fetch(`${API_BASE_URL}/room-assignments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(assignment),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Create room assignment error:', error);
      throw new Error(error.error || 'Failed to create room assignment');
    }
    
    const data = await response.json();
    return data.assignment;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/room-assignments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete room assignment error:', error);
      throw new Error(error.error || 'Failed to delete room assignment');
    }
    
    return response.json();
  },
};