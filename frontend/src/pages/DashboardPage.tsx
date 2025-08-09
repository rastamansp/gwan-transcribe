import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { Upload, History, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
      icon: <Upload sx={{ fontSize: 40 }} />,
      action: () => navigate('/upload'),
      color: 'primary',
    },
    {
      title: language === 'pt' ? 'Histórico' : 'History',
      description: language === 'pt' 
        ? 'Visualize transcrições anteriores' 
        : 'View previous transcriptions',
      icon: <History sx={{ fontSize: 40 }} />,
      action: () => navigate('/history'),
      color: 'secondary',
    },
    {
      title: language === 'pt' ? 'Perfil' : 'Profile',
      description: language === 'pt' 
        ? 'Gerencie suas informações pessoais' 
        : 'Manage your personal information',
      icon: <Person sx={{ fontSize: 40 }} />,
      action: () => navigate('/profile'),
      color: 'success',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {language === 'pt' ? 'Dashboard' : 'Dashboard'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {language === 'pt' 
          ? 'Bem-vindo ao Gwan Transcribe. Escolha uma opção para começar.' 
          : 'Welcome to Gwan Transcribe. Choose an option to get started.'
        }
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
              onClick={card.action}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ color: `${card.color}.main`, mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Button
                  variant="contained"
                  color={card.color as any}
                  fullWidth
                >
                  {language === 'pt' ? 'Acessar' : 'Access'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage; 