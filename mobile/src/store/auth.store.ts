import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/client';

interface AuthState {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.login(email, password);
      await SecureStore.setItemAsync('access_token', data.access_token);
      set({ userId: data.user.id, email: data.user.email, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.register(email, password, displayName);
      await SecureStore.setItemAsync('access_token', data.access_token);
      set({ userId: data.user.id, email: data.user.email, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    set({ userId: null, email: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) return;
    set({ isAuthenticated: true });
  },
}));
