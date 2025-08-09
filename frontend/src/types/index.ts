// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
}

export interface OTPRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Transcription types
export interface Transcription {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  status: TranscriptionStatus;
  language: string;
  transcription?: string;
  translation?: string;
  createdAt: string;
  updatedAt: string;
}

export type TranscriptionStatus = 
  | 'uploading'
  | 'processing'
  | 'transcribing'
  | 'translating'
  | 'completed'
  | 'error';

// Upload types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileValidation {
  isValid: boolean;
  errors: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Language types
export type Language = 'pt' | 'en';

export interface LanguageConfig {
  code: Language;
  name: string;
  flag: string;
} 