import React, { useState, useEffect } from 'react';
import {
  Card, 
  Text, 
  Button, 
  Badge, 
  Flex
} from '@radix-ui/themes';
import { 
  ClockIcon, 
  DownloadIcon, 
  EyeOpenIcon, 
  UpdateIcon 
} from '@radix-ui/react-icons';
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
      color: 'blue' as const,
    },
    processing: {
      label: language === 'pt' ? 'Processando' : 'Processing',
      color: 'yellow' as const,
    },
    transcribing: {
      label: language === 'pt' ? 'Transcrevendo' : 'Transcribing',
      color: 'blue' as const,
    },
    translating: {
      label: language === 'pt' ? 'Traduzindo' : 'Translating',
      color: 'purple' as const,
    },
    completed: {
      label: language === 'pt' ? 'Concluído' : 'Completed',
      color: 'green' as const,
    },
    error: {
      label: language === 'pt' ? 'Erro' : 'Error',
      color: 'red' as const,
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
    } catch {
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Flex align="center" justify="between" className="mb-6">
        <Text as="div" weight="bold" className="text-2xl">
          {language === 'pt' ? 'Histórico de Transcrições' : 'Transcription History'}
        </Text>
        <Button onClick={fetchTranscriptions} variant="outline" className="flex items-center gap-2">
          <UpdateIcon className="w-4 h-4" />
          {language === 'pt' ? 'Atualizar' : 'Refresh'}
        </Button>
      </Flex>

      {error && (
        <Badge color="red" variant="soft" className="mb-4 block">
          {error}
        </Badge>
      )}

      {transcriptions.length === 0 ? (
        <Card className="p-8 text-center">
          <ClockIcon className="text-gray-400 text-4xl mx-auto mb-4" />
          <Text as="p" size="5" color="gray" className="mb-2">
            {language === 'pt' ? 'Nenhuma transcrição encontrada' : 'No transcriptions found'}
          </Text>
          <Text as="p" color="gray">
            {language === 'pt' 
              ? 'Faça upload de um arquivo de áudio para começar' 
              : 'Upload an audio file to get started'
            }
          </Text>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium">
                    {language === 'pt' ? 'Arquivo' : 'File'}
                  </th>
                  <th className="text-left p-4 font-medium">
                    {language === 'pt' ? 'Status' : 'Status'}
                  </th>
                  <th className="text-left p-4 font-medium">
                    {language === 'pt' ? 'Tamanho' : 'Size'}
                  </th>
                  <th className="text-left p-4 font-medium">
                    {language === 'pt' ? 'Data' : 'Date'}
                  </th>
                  <th className="text-left p-4 font-medium">
                    {language === 'pt' ? 'Ações' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transcriptions.map((transcription) => (
                  <tr key={transcription.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <Text weight="medium">
                        {transcription.fileName}
                      </Text>
                    </td>
                    <td className="p-4">
                      <Badge 
                        color={statusConfig[transcription.status]?.color || 'gray'} 
                        variant="soft"
                      >
                        {statusConfig[transcription.status]?.label || transcription.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Text color="gray">
                        {formatFileSize(transcription.fileSize)}
                      </Text>
                    </td>
                    <td className="p-4">
                      <Text color="gray">
                        {formatDate(transcription.createdAt)}
                      </Text>
                    </td>
                    <td className="p-4">
                      <Flex gap="2">
                        <Button 
                          size="1" 
                          variant="outline"
                          onClick={() => navigate(`/transcription/${transcription.id}`)}
                          className="flex items-center gap-2"
                        >
                          <EyeOpenIcon className="w-4 h-4" />
                          {language === 'pt' ? 'Ver' : 'View'}
                        </Button>
                        {transcription.status === 'completed' && (
                          <Button 
                            size="1" 
                            variant="outline"
                            onClick={() => {
                              // Implementar download
                              console.log('Download:', transcription.id);
                            }}
                            className="flex items-center gap-2"
                          >
                            <DownloadIcon className="w-4 h-4" />
                            {language === 'pt' ? 'Baixar' : 'Download'}
                          </Button>
                        )}
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoryPage; 