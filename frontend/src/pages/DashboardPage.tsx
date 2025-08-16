import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Text,
  Button,
  Badge
} from '@radix-ui/themes';
import {
  UploadIcon,
  ClockIcon,
  ActivityLogIcon
} from '@radix-ui/react-icons';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const cards = [
    {
      title: language === 'pt' ? 'Upload de Áudio' : 'Audio Upload',
      description: language === 'pt' 
        ? 'Faça upload de arquivos de áudio para transcrição' 
        : 'Upload audio files for transcription',
      icon: <UploadIcon className="w-8 h-8" />,
      action: () => navigate('/upload'),
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      iconBg: 'bg-emerald-500/20',
      stats: '12 arquivos'
    },
    {
      title: language === 'pt' ? 'Histórico' : 'History',
      description: language === 'pt' 
        ? 'Visualize transcrições anteriores' 
        : 'View previous transcriptions',
      icon: <ClockIcon className="w-8 h-8" />,
      action: () => navigate('/history'),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      iconBg: 'bg-purple-500/20',
      stats: '24 transcrições'
    },
    {
      title: language === 'pt' ? 'Perfil' : 'Profile',
      description: language === 'pt' 
        ? 'Gerencie suas informações pessoais' 
        : 'Manage your personal information',
      icon: <ActivityLogIcon className="w-8 h-8" />,
      action: () => navigate('/profile'),
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      iconBg: 'bg-orange-500/20',
      stats: 'Ativo'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Text as="div" className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!'}
        </Text>
        <Text as="div" className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {language === 'pt' 
            ? 'Continue transformando seus arquivos de áudio em texto com precisão e rapidez.' 
            : 'Keep transforming your audio files into text with accuracy and speed.'
          }
        </Text>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <Card 
            key={index}
            className="card-modern hover:scale-105 transition-all duration-300 cursor-pointer group"
            onClick={card.action}
          >
            <div className="text-center p-6">
              <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <div className={`text-white ${card.iconBg.replace('bg-', 'text-').replace('/20', '')}`}>
                  {card.icon}
                </div>
              </div>
              
              <Text as="div" className="text-xl font-bold text-gray-800 mb-2">
                {card.title}
              </Text>
              
              <Text as="div" className="text-gray-600 mb-4 leading-relaxed">
                {card.description}
              </Text>
              
              <Badge className={`bg-gradient-to-r ${card.color} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                {card.stats}
              </Badge>
              
              <Button 
                className="w-full mt-4 btn-primary"
              >
                {language === 'pt' ? 'Acessar' : 'Access'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 