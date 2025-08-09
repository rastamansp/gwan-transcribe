import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error, AudioFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { FileValidation } from '@/types';

const UploadPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateFile = (file: File): FileValidation => {
    const errors: string[] = [];
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/aac',
    ];

    if (file.size > maxSize) {
      errors.push(
        language === 'pt' 
          ? 'Arquivo muito grande. Tamanho máximo: 100MB' 
          : 'File too large. Maximum size: 100MB'
      );
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(
        language === 'pt' 
          ? 'Tipo de arquivo não suportado. Use: MP3, WAV, OGG, M4A, AAC' 
          : 'Unsupported file type. Use: MP3, WAV, OGG, M4A, AAC'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validateFile(file);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const response = await apiService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success && response.data) {
        setSuccess(
          language === 'pt' 
            ? 'Arquivo enviado com sucesso! Redirecionando...' 
            : 'File uploaded successfully! Redirecting...'
        );
        setTimeout(() => {
          navigate(`/transcription/${response.data.id}`);
        }, 2000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      setError(
        language === 'pt' 
          ? 'Erro ao enviar arquivo. Tente novamente.' 
          : 'Error uploading file. Please try again.'
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [language, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.aac'],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {language === 'pt' ? 'Upload de Áudio' : 'Audio Upload'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {language === 'pt' 
          ? 'Faça upload de arquivos de áudio para transcrição. Formatos suportados: MP3, WAV, OGG, M4A, AAC (máx. 100MB)' 
          : 'Upload audio files for transcription. Supported formats: MP3, WAV, OGG, M4A, AAC (max. 100MB)'
        }
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Paper
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  '&:hover': {
                    backgroundColor: uploading ? 'background.paper' : 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive
                    ? (language === 'pt' ? 'Solte o arquivo aqui' : 'Drop the file here')
                    : (language === 'pt' ? 'Arraste e solte um arquivo de áudio' : 'Drag and drop an audio file')
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {language === 'pt' 
                    ? 'ou clique para selecionar um arquivo' 
                    : 'or click to select a file'
                  }
                </Typography>
                <Button
                  variant="outlined"
                  disabled={uploading}
                  startIcon={<AudioFile />}
                >
                  {language === 'pt' ? 'Selecionar Arquivo' : 'Select File'}
                </Button>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {language === 'pt' ? 'Informações' : 'Information'}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Formatos suportados:' : 'Supported formats:'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {['MP3', 'WAV', 'OGG', 'M4A', 'AAC'].map((format) => (
                    <Chip
                      key={format}
                      label={format}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Tamanho máximo:' : 'Maximum size:'}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  100 MB
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Processamento:' : 'Processing:'}
                </Typography>
                <Typography variant="body1">
                  {language === 'pt' 
                    ? 'Transcrição automática em português' 
                    : 'Automatic transcription in Portuguese'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {uploading && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {language === 'pt' ? 'Enviando arquivo...' : 'Uploading file...'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {uploadProgress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UploadPage; 