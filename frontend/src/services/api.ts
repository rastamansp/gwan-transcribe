import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosProgressEvent, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { ApiResponse, User, AuthResponse, Transcription } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
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
  requestOTP: async (email: string, name: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/request-otp', { email, name });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/verify-otp', { email, code: otp });
    const raw = response.data as { success: boolean; message?: string; token?: string; user?: AuthResponse['user'] };
    return {
      success: !!raw.success,
      message: raw.message,
      data: raw.token && raw.user ? { token: raw.token, user: raw.user } : undefined,
    };
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
      // Não defina manualmente Content-Type; deixe o browser adicionar o boundary
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
    const response = await api.get(`/transcription/${id}`);
    const raw: { success: boolean; data?: BackendTranscription; message?: string } = response.data;
    return {
      success: !!raw.success,
      message: raw.message,
      data: raw.data ? mapBackendTranscription(raw.data) : undefined,
    };
  },

  getTranscriptionResult: async (id: string): Promise<ApiResponse<Transcription>> => {
    const response = await api.get(`/transcription/${id}`);
    const raw: { success: boolean; data?: BackendTranscription; message?: string } = response.data;
    return {
      success: !!raw.success,
      message: raw.message,
      data: raw.data ? mapBackendTranscription(raw.data) : undefined,
    };
  },

  getTranscriptions: async (): Promise<ApiResponse<Transcription[]>> => {
    const response = await api.get('/transcription');
    const raw: { success: boolean; data?: BackendTranscription[]; message?: string } = response.data;
    return {
      success: !!raw.success,
      message: raw.message,
      data: Array.isArray(raw.data) ? raw.data.map(mapBackendTranscription) : undefined,
    };
  },
};

export default api; 

type BackendTranscription = {
  id: string;
  userId: string;
  fileUrl?: string;
  originalFilename?: string;
  fileName?: string;
  fileSize?: number | string;
  detectedLanguage?: string;
  selectedLanguage?: string | null;
  transcriptionText?: string | null;
  translationText?: string | null;
  transcription?: string | null;
  translation?: string | null;
  duration?: number | null;
  status?: Transcription['status'] | string;
  processingStage?: Transcription['status'] | string;
  errorMessage?: string | null;
  processingStartedAt?: string | null;
  processingCompletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function mapBackendTranscription(t: BackendTranscription): Transcription {
  const status = (t?.status || t?.processingStage || 'processing') as Transcription['status'];
  return {
    id: t?.id ?? '',
    userId: t?.userId ?? '',
    fileName: t?.originalFilename ?? t?.fileName ?? '',
    fileSize: Number(t?.fileSize ?? 0),
    status,
    language: t?.selectedLanguage ?? t?.detectedLanguage ?? '',
    transcription: t?.transcriptionText ?? t?.transcription ?? '',
    translation: t?.translationText ?? t?.translation ?? undefined,
    createdAt: t?.createdAt ?? new Date().toISOString(),
    updatedAt: t?.updatedAt ?? new Date().toISOString(),
  };
}