import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL = (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth interceptor ──────────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('access_token');
    }
    return Promise.reject(error);
  },
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    api.post('/auth/register', { email, password, displayName }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// ── Conversation ──────────────────────────────────────────────────────────────

export const conversationApi = {
  sendMessage: (message: string, sessionId?: string) =>
    api.post('/conversations/message', { message, sessionId }),

  getSessions: (page = 1) =>
    api.get('/conversations/sessions', { params: { page } }),

  getSession: (sessionId: string) =>
    api.get(`/conversations/sessions/${sessionId}`),

  sendFeedback: (messageId: string, feedback: 'positive' | 'neutral' | 'negative') =>
    api.post(`/conversations/messages/${messageId}/feedback`, { feedback }),
};

// ── Check-In ──────────────────────────────────────────────────────────────────

export const checkInApi = {
  submit: (data: {
    valence: number;
    arousal: number;
    groundedness: number;
    emotions?: string[];
    energyLevel?: number;
    freeText?: string;
  }) => api.post('/check-ins', data),

  getHistory: (limit = 30) =>
    api.get('/check-ins', { params: { limit } }),

  getToday: () => api.get('/check-ins/today'),
};
