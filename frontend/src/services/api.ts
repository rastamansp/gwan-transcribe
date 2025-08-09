import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { ApiResponse, User, AuthResponse, Transcription } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Auth
  requestOTP: async (email: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/request-otp', { email });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // User
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateUserProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // Transcription
  uploadFile: async (file: File, onUploadProgress?: (progress: number) => void): Promise<ApiResponse<{ id: string }>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/transcription/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });
    return response.data;
  },

  getTranscriptionStatus: async (id: string): Promise<ApiResponse<Transcription>> => {
    const response = await api.get(`/transcription/${id}/status`);
    return response.data;
  },

  getTranscriptionResult: async (id: string): Promise<ApiResponse<Transcription>> => {
    const response = await api.get(`/transcription/${id}`);
    return response.data;
  },

  getTranscriptions: async (): Promise<ApiResponse<Transcription[]>> => {
    const response = await api.get('/transcription');
    return response.data;
  },
};

export default api; 