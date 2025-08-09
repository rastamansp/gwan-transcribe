import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  Button,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Download,
  Refresh,
  CheckCircle,
  Error,
  Schedule,
  ContentCopy,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranscription } from '@/hooks/useTranscription';

const TranscriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { transcription, loading, error, polling, refresh } = useTranscription({
    id,
    language,
  });

  const [copied, setCopied] = React.useState({ transcription: false, translation: false });

  const copyToClipboard = async (text: string, key: 'transcription' | 'translation') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!transcription || transcription.status !== 'completed') return;

    const parts: string[] = [];
    parts.push(`# ${language === 'pt' ? 'Transcrição' : 'Transcription'}\n`);
    parts.push(transcription.transcription || '');
    if (transcription.translation) {
      parts.push(`\n\n# ${language === 'pt' ? 'Tradução' : 'Translation'}\n`);
      parts.push(transcription.translation);
    }

    const content = parts.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = (transcription.fileName || 'transcription').replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = `${baseName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusConfig = {
    uploading: {
      label: language === 'pt' ? 'Enviando' : 'Uploading',
      color: 'info' as const,
      icon: <Schedule />,
    },
    processing: {
      label: language === 'pt' ? 'Processando' : 'Processing',
      color: 'warning' as const,
      icon: <CircularProgress size={16} />,
    },
    transcribing: {
      label: language === 'pt' ? 'Transcrevendo' : 'Transcribing',
      color: 'primary' as const,
      icon: <CircularProgress size={16} />,
    },
    translating: {
      label: language === 'pt' ? 'Traduzindo' : 'Translating',
      color: 'secondary' as const,
      icon: <CircularProgress size={16} />,
    },
    completed: {
      label: language === 'pt' ? 'Concluído' : 'Completed',
      color: 'success' as const,
      icon: <CheckCircle />,
    },
    error: {
      label: language === 'pt' ? 'Erro' : 'Error',
      color: 'error' as const,
      icon: <Error />,
    },
  };

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !transcription) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || (language === 'pt' ? 'Transcrição não encontrada' : 'Transcription not found')}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/upload')}
          sx={{ mr: 1 }}
        >
          {language === 'pt' ? 'Fazer Upload' : 'Upload File'}
        </Button>
        <Button variant="outlined" onClick={refresh}>
          {language === 'pt' ? 'Tentar Novamente' : 'Try Again'}
        </Button>
      </Box>
    );
  }

  const status = statusConfig[transcription.status];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          {language === 'pt' ? 'Transcrição' : 'Transcription'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refresh}
          disabled={polling}
        >
          {language === 'pt' ? 'Atualizar' : 'Refresh'}
        </Button>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3,
      }}>
        <Box>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  {transcription.fileName}
                </Typography>
                <Chip
                  label={status.label}
                  color={status.color}
                  icon={status.icon}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Tamanho:' : 'Size:'} {formatFileSize(transcription.fileSize)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Criado em:' : 'Created:'} {formatDate(transcription.createdAt)}
                </Typography>
              </Box>

              {['uploading', 'processing', 'transcribing', 'translating'].includes(transcription.status) && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {language === 'pt' ? 'Processando...' : 'Processing...'}
                  </Typography>
                </Box>
              )}

              {transcription.status === 'completed' && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      {language === 'pt' ? 'Transcrição' : 'Transcription'}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(transcription.transcription || '', 'transcription')}
                    >
                      {copied.transcription ? (language === 'pt' ? 'Copiado!' : 'Copied!') : (language === 'pt' ? 'Copiar' : 'Copy')}
                    </Button>
                  </Box>
                  <TextField
                    value={transcription.transcription || ''}
                    placeholder={language === 'pt' ? 'Nenhuma transcrição disponível' : 'No transcription available'}
                    fullWidth
                    multiline
                    minRows={8}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                  />

                  {transcription.translation && (
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" gutterBottom>
                          {language === 'pt' ? 'Tradução' : 'Translation'}
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<ContentCopy />}
                          onClick={() => copyToClipboard(transcription.translation || '', 'translation')}
                        >
                          {copied.translation ? (language === 'pt' ? 'Copiado!' : 'Copied!') : (language === 'pt' ? 'Copiar' : 'Copy')}
                        </Button>
                      </Box>
                      <TextField
                        value={transcription.translation || ''}
                        fullWidth
                        multiline
                        minRows={6}
                        InputProps={{ readOnly: true }}
                      />
                    </>
                  )}
                </Box>
              )}

              {transcription.status === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {language === 'pt' 
                    ? 'Erro durante o processamento da transcrição' 
                    : 'Error during transcription processing'
                  }
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {language === 'pt' ? 'Ações' : 'Actions'}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  disabled={transcription.status !== 'completed'}
                  fullWidth
                  onClick={handleDownload}
                >
                  {language === 'pt' ? 'Baixar Transcrição' : 'Download Transcription'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/upload')}
                  fullWidth
                >
                  {language === 'pt' ? 'Novo Upload' : 'New Upload'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TranscriptionPage; 