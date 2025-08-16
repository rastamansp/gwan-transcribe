import React from 'react';
import {
  Text,
  Card,
  Badge,
  Button
} from '@radix-ui/themes';
import {
  DownloadIcon,
  UpdateIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  CopyIcon,
} from '@radix-ui/react-icons';
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
      color: 'blue' as const,
      icon: <ClockIcon className="w-4 h-4" />,
    },
    processing: {
      label: language === 'pt' ? 'Processando' : 'Processing',
      color: 'yellow' as const,
      icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>,
    },
    transcribing: {
      label: language === 'pt' ? 'Transcrevendo' : 'Transcribing',
      color: 'blue' as const,
      icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>,
    },
    translating: {
      label: language === 'pt' ? 'Traduzindo' : 'Translating',
      color: 'purple' as const,
      icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>,
    },
    completed: {
      label: language === 'pt' ? 'Concluído' : 'Completed',
      color: 'green' as const,
      icon: <CheckCircledIcon className="w-4 h-4" />,
    },
    error: {
      label: language === 'pt' ? 'Erro' : 'Error',
      color: 'red' as const,
      icon: <CrossCircledIcon className="w-4 h-4" />,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text as="div" className="text-xl text-slate-600 dark:text-slate-300">
            {language === 'pt' ? 'Carregando transcrição...' : 'Loading transcription...'}
          </Text>
        </div>
      </div>
    );
  }

  if (error || !transcription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <Card className="card-modern max-w-md w-full text-center">
          <CrossCircledIcon className="text-red-500 text-6xl mx-auto mb-6" />
          <Text as="div" className="text-2xl font-bold text-slate-800 mb-4">
            {language === 'pt' ? 'Erro ao carregar transcrição' : 'Error loading transcription'}
          </Text>
          <Text as="div" className="text-slate-600 mb-6">
            {error || (language === 'pt' ? 'Transcrição não encontrada' : 'Transcription not found')}
          </Text>
          <Button 
            onClick={() => navigate('/history')}
            className="btn-primary"
          >
            {language === 'pt' ? 'Voltar ao Histórico' : 'Back to History'}
          </Button>
        </Card>
      </div>
    );
  }

  const status = statusConfig[transcription.status] || statusConfig.error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Text as="div" className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'pt' ? 'Transcrição' : 'Transcription'}
              </Text>
              <Text as="div" className="text-slate-600 dark:text-slate-300">
                {language === 'pt' 
                  ? 'Visualize e gerencie sua transcrição de áudio' 
                  : 'View and manage your audio transcription'
                }
              </Text>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={refresh}
                className="btn-outline flex items-center gap-2"
              >
                <UpdateIcon className="w-4 h-4" />
                {language === 'pt' ? 'Atualizar' : 'Refresh'}
              </Button>
              
              {transcription.status === 'completed' && (
                <Button 
                  onClick={handleDownload}
                  className="btn-primary flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </Button>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-6">
            <Badge color={status.color} variant="soft" className="text-lg px-4 py-2 flex items-center gap-2">
              {status.icon}
              <span>{status.label}</span>
            </Badge>
            {polling && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{language === 'pt' ? 'Atualizando...' : 'Updating...'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Info Card */}
            <Card className="card-modern">
              <div className="p-6">
                <div className="mb-6">
                  <Text as="div" className="text-lg font-semibold text-slate-800 mb-2">
                    {language === 'pt' ? 'Informações do Arquivo' : 'File Information'}
                  </Text>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <Text as="div" className="text-slate-600 dark:text-slate-300">
                      {transcription.fileName || 'N/A'}
                    </Text>
                  </div>
                </div>

                {transcription.status === 'completed' && (
                  <>
                    {/* Transcription Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <Text as="div" className="text-xl font-semibold text-slate-800">
                          {language === 'pt' ? 'Transcrição' : 'Transcription'}
                        </Text>
                        <Button 
                          size="2" 
                          variant="outline"
                          onClick={() => copyToClipboard(transcription.transcription || '', 'transcription')}
                          className="btn-outline"
                        >
                          <CopyIcon className="w-4 h-4 mr-2" />
                          {copied.transcription 
                            ? (language === 'pt' ? 'Copiado!' : 'Copied!') 
                            : (language === 'pt' ? 'Copiar' : 'Copy')
                          }
                        </Button>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                        <Text as="div" className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {transcription.transcription || ''}
                        </Text>
                      </div>
                    </div>

                    {/* Translation Section */}
                    {transcription.translation && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <Text as="div" className="text-xl font-semibold text-slate-800">
                            {language === 'pt' ? 'Tradução' : 'Translation'}
                          </Text>
                          <Button 
                            size="2" 
                            variant="outline"
                            onClick={() => copyToClipboard(transcription.translation || '', 'translation')}
                            className="btn-outline"
                          >
                            <CopyIcon className="w-4 h-4 mr-2" />
                            {copied.translation 
                              ? (language === 'pt' ? 'Copiado!' : 'Copied!') 
                              : (language === 'pt' ? 'Copiar' : 'Copy')
                            }
                          </Button>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200/50 dark:border-green-700/30">
                          <Text as="div" className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {transcription.translation}
                          </Text>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {transcription.status === 'error' && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200/50 dark:border-red-700/30">
                    <Text as="div" className="text-red-800 dark:text-red-200 text-center">
                      {language === 'pt' ? 'Erro durante o processamento' : 'Error during processing'}
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="card-modern sticky top-24">
              <div className="p-6">
                <Text as="div" className="text-xl font-semibold text-slate-800 mb-6">
                  {language === 'pt' ? 'Detalhes' : 'Details'}
                </Text>

                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {language === 'pt' ? 'Status' : 'Status'}
                    </Text>
                    <Badge color={status.color} variant="soft" className="text-base px-3 py-2 flex items-center gap-2">
                      {status.icon}
                      <span>{status.label}</span>
                    </Badge>
                  </div>

                  {/* File Size */}
                  <div>
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {language === 'pt' ? 'Tamanho do arquivo' : 'File size'}
                    </Text>
                    <Text as="div" className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {transcription.fileSize ? `${(transcription.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                    </Text>
                  </div>

                  {/* Created At */}
                  <div>
                    <Text as="div" className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {language === 'pt' ? 'Data de criação' : 'Created at'}
                    </Text>
                    <Text as="div" className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {transcription.createdAt 
                        ? new Date(transcription.createdAt).toLocaleString(
                            language === 'pt' ? 'pt-BR' : 'en-US'
                          )
                        : 'N/A'
                      }
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage; 