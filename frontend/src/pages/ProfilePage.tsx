import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Save, Edit } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
// import { User } from '@/types';

const ProfilePage: React.FC = () => {
  const { user, updateUserInContext } = useAuth();
  const { language } = useLanguage();
  // const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError(language === 'pt' ? 'Nome é obrigatório' : 'Name is required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.updateUserProfile({
        name: formData.name.trim(),
      });

      if (response.success && response.data) {
        setSuccess(
          language === 'pt' 
            ? 'Perfil atualizado com sucesso!' 
            : 'Profile updated successfully!'
        );
        setEditing(false);
        updateUserInContext({ name: formData.name.trim() });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch {
      setError(
        language === 'pt' 
          ? 'Erro ao atualizar perfil. Tente novamente.' 
          : 'Error updating profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setEditing(false);
    setError('');
  };

  // if (loading) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {language === 'pt' ? 'Perfil' : 'Profile'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {language === 'pt' 
          ? 'Gerencie suas informações pessoais e configurações da conta' 
          : 'Manage your personal information and account settings'
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

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3,
      }}>
        <Box>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  {language === 'pt' ? 'Informações Pessoais' : 'Personal Information'}
                </Typography>
                {!editing && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                  >
                    {language === 'pt' ? 'Editar' : 'Edit'}
                  </Button>
                )}
              </Box>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}>
                <TextField
                  fullWidth
                  label={language === 'pt' ? 'Nome' : 'Name'}
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  disabled={!editing}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label={language === 'pt' ? 'Email' : 'Email'}
                  value={formData.email}
                  disabled
                  margin="normal"
                  helperText={language === 'pt' ? 'Email não pode ser alterado' : 'Email cannot be changed'}
                />
              </Box>

              {editing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <CircularProgress size={20} />
                    ) : (
                      language === 'pt' ? 'Salvar' : 'Save'
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {language === 'pt' ? 'Informações da Conta' : 'Account Information'}
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h6">
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Status da conta:' : 'Account status:'}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={user?.isActive ? 'success.main' : 'error.main'}>
                  {user?.isActive 
                    ? (language === 'pt' ? 'Ativa' : 'Active') 
                    : (language === 'pt' ? 'Inativa' : 'Inactive')
                  }
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'pt' ? 'Membro desde:' : 'Member since:'}
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString(
                        language === 'pt' ? 'pt-BR' : 'en-US'
                      )
                    : '-'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage; 