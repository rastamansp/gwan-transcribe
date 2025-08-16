import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Text, 
  Button, 
  Badge
} from '@radix-ui/themes';
import { 
  UploadIcon, 
  FileIcon,
  CheckCircledIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';
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

      if (response.success && response.data?.id) {
        setSuccess(
          language === 'pt' 
            ? 'Arquivo enviado com sucesso! Redirecionando...' 
            : 'File uploaded successfully! Redirecting...'
        );
        setTimeout(() => {
          const transcriptionId = response.data?.id;
          if (transcriptionId) {
            navigate(`/transcription/${transcriptionId}`);
          }
        }, 2000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch {
      setError(
        language === 'pt' 
          ? 'Erro ao enviar arquivo. Tente novamente.' 
          : 'Error uploading file. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  }, [language, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Text as="div" className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'pt' ? 'Upload de Áudio' : 'Audio Upload'}
          </Text>
          
          <Text as="div" className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {language === 'pt' 
              ? 'Faça upload de arquivos de áudio para transcrição com inteligência artificial' 
              : 'Upload audio files for transcription with artificial intelligence'
            }
          </Text>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CrossCircledIcon className="text-red-500 w-5 h-5 flex-shrink-0" />
              <Text as="div" className="text-red-800 dark:text-red-200">
                {error}
              </Text>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircledIcon className="text-green-500 w-5 h-5 flex-shrink-0" />
              <Text as="div" className="text-green-800 dark:text-green-200">
                {success}
              </Text>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2">
            <Card className="card-modern">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                } ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className="mb-6">
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDragActive 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    <UploadIcon className={`w-12 h-12 ${
                      isDragActive ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
                    }`} />
                  </div>
                </div>

                <Text as="div" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                  {isDragActive
                    ? (language === 'pt' ? 'Solte o arquivo aqui!' : 'Drop the file here!')
                    : (language === 'pt' ? 'Arraste e solte seu arquivo' : 'Drag and drop your file')
                  }
                </Text>
                
                <Text as="div" className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                  {language === 'pt' 
                    ? 'ou clique para selecionar um arquivo de áudio' 
                    : 'or click to select an audio file'
                  }
                </Text>
                
                <Button
                  variant="outline"
                  disabled={uploading}
                  className="btn-outline flex items-center gap-2"
                >
                  <FileIcon className="w-4 h-4" />
                  {language === 'pt' ? 'Selecionar Arquivo' : 'Select File'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Information Panel */}
          <div>
            <Card className="card-modern sticky top-24">
              <div className="p-6">
                <Text as="div" className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                  {language === 'pt' ? 'Informações' : 'Information'}
                </Text>
                
                <div className="space-y-6">
                  {/* Supported Formats */}
                  <div>
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {language === 'pt' ? 'Formatos suportados:' : 'Supported formats:'}
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {['MP3', 'WAV', 'OGG', 'M4A', 'AAC'].map((format) => (
                        <Badge key={format} color="blue" variant="soft" className="px-3 py-1">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* File Size */}
                  <div>
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {language === 'pt' ? 'Tamanho máximo:' : 'Maximum size:'}
                    </Text>
                    <Text as="div" className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      100 MB
                    </Text>
                  </div>

                  {/* Processing */}
                  <div>
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {language === 'pt' ? 'Processamento:' : 'Processing:'}
                    </Text>
                    <Text as="div" className="text-slate-800 dark:text-slate-200">
                      {language === 'pt' 
                        ? 'Transcrição automática em português' 
                        : 'Automatic transcription in Portuguese'
                      }
                    </Text>
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {language === 'pt' ? 'Recursos:' : 'Features:'}
                    </Text>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{language === 'pt' ? 'Transcrição precisa' : 'Accurate transcription'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{language === 'pt' ? 'Processamento rápido' : 'Fast processing'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>{language === 'pt' ? 'Suporte a múltiplos idiomas' : 'Multi-language support'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <Card className="card-modern mt-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Text as="div" className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'pt' ? 'Enviando arquivo...' : 'Uploading file...'}
                </Text>
                <Text as="div" className="text-lg font-bold text-blue-600">
                  {uploadProgress}%
                </Text>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              
              <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center">
                {language === 'pt' 
                  ? 'Aguarde enquanto processamos seu arquivo...' 
                  : 'Please wait while we process your file...'
                }
              </Text>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadPage; 