import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  History,
  Download,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { Transcription } from '@/types';

const HistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusConfig = {
    uploading: {
      label: language === 'pt' ? 'Enviando' : 'Uploading',
      color: 'info' as const,
    },
    processing: {
      label: language === 'pt' ? 'Processando' : 'Processing',
      color: 'warning' as const,
    },
    transcribing: {
      label: language === 'pt' ? 'Transcrevendo' : 'Transcribing',
      color: 'primary' as const,
    },
    translating: {
      label: language === 'pt' ? 'Traduzindo' : 'Translating',
      color: 'secondary' as const,
    },
    completed: {
      label: language === 'pt' ? 'Concluído' : 'Completed',
      color: 'success' as const,
    },
    error: {
      label: language === 'pt' ? 'Erro' : 'Error',
      color: 'error' as const,
    },
  };

  const fetchTranscriptions = async () => {
    try {
      const response = await apiService.getTranscriptions();
      if (response.success && response.data) {
        setTranscriptions(response.data);
        setError('');
      } else {
        throw new Error(response.message || 'Failed to fetch transcriptions');
      }
    } catch (error) {
      setError(
        language === 'pt' 
          ? 'Erro ao carregar histórico' 
          : 'Error loading history'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(
      language === 'pt' ? 'pt-BR' : 'en-US'
    );
  };

  const handleViewTranscription = (id: string) => {
    navigate(`/transcription/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          {language === 'pt' ? 'Histórico de Transcrições' : 'Transcription History'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchTranscriptions}
        >
          {language === 'pt' ? 'Atualizar' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {transcriptions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <History sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {language === 'pt' ? 'Nenhuma transcrição encontrada' : 'No transcriptions found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {language === 'pt' 
                ? 'Faça seu primeiro upload para começar a usar o sistema' 
                : 'Make your first upload to start using the system'
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/upload')}
              startIcon={<History />}
            >
              {language === 'pt' ? 'Fazer Upload' : 'Upload File'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {language === 'pt' ? 'Arquivo' : 'File'}
                </TableCell>
                <TableCell>
                  {language === 'pt' ? 'Tamanho' : 'Size'}
                </TableCell>
                <TableCell>
                  {language === 'pt' ? 'Status' : 'Status'}
                </TableCell>
                <TableCell>
                  {language === 'pt' ? 'Data' : 'Date'}
                </TableCell>
                <TableCell align="right">
                  {language === 'pt' ? 'Ações' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transcriptions.map((transcription) => {
                const status = statusConfig[transcription.status];
                return (
                  <TableRow key={transcription.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {transcription.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(transcription.fileSize)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(transcription.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewTranscription(transcription.id)}
                        >
                          {language === 'pt' ? 'Ver' : 'View'}
                        </Button>
                        {transcription.status === 'completed' && (
                          <Button
                            size="small"
                            startIcon={<Download />}
                            variant="outlined"
                          >
                            {language === 'pt' ? 'Baixar' : 'Download'}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HistoryPage; 