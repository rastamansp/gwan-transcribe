import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { Transcription } from '@/types';

interface UseTranscriptionProps {
  id?: string;
  language: 'pt' | 'en';
}

interface UseTranscriptionReturn {
  transcription: Transcription | null;
  loading: boolean;
  error: string;
  polling: boolean;
  refresh: () => void;
}

export const useTranscription = ({ id, language }: UseTranscriptionProps): UseTranscriptionReturn => {
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);

  const fetchTranscription = useCallback(async () => {
    if (!id) return;

    try {
      const response = await apiService.getTranscriptionResult(id);
      if (response.success && response.data) {
        setTranscription(response.data);
        setError('');
      } else {
        throw new Error(response.message || 'Failed to fetch transcription');
      }
    } catch (error) {
      setError(
        language === 'pt' 
          ? 'Erro ao carregar transcrição' 
          : 'Error loading transcription'
      );
    } finally {
      setLoading(false);
    }
  }, [id, language]);

  const startPolling = useCallback(() => {
    if (!id || transcription?.status === 'completed' || transcription?.status === 'error') {
      return;
    }

    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const response = await apiService.getTranscriptionStatus(id);
        if (response.success && response.data) {
          setTranscription(response.data);
          
          if (response.data.status === 'completed' || response.data.status === 'error') {
            clearInterval(interval);
            setPolling(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [id, transcription?.status]);

  useEffect(() => {
    fetchTranscription();
  }, [fetchTranscription]);

  useEffect(() => {
    if (transcription && ['uploading', 'processing', 'transcribing', 'translating'].includes(transcription.status)) {
      const cleanup = startPolling();
      return cleanup;
    }
  }, [transcription, startPolling]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchTranscription();
  }, [fetchTranscription]);

  return {
    transcription,
    loading,
    error,
    polling,
    refresh,
  };
}; 