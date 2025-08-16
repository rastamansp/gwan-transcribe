import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Card,
  Button,
  Badge,
  Flex,
  Avatar,
  Separator,
} from '@radix-ui/themes';
import { 
  CheckIcon, 
  Pencil1Icon 
} from '@radix-ui/react-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';

const ProfilePage: React.FC = () => {
  const { user, updateUserInContext } = useAuth();
  const { language } = useLanguage();
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

  return (
    <div className="p-6">
      <Text as="div" weight="bold" className="text-3xl mb-6">
        {language === 'pt' ? 'Perfil do Usuário' : 'User Profile'}
      </Text>

      <Card className="max-w-2xl">
        <Box className="p-6">
          <Flex align="center" gap="4" className="mb-6">
            <Avatar 
              size="6" 
              fallback={user?.name?.charAt(0)?.toUpperCase() || 'U'} 
              className="bg-blue-600 text-white"
            />
            <Box>
              <Text as="div" weight="bold" className="text-xl">
                {user?.name || 'Usuário'}
              </Text>
              <Text as="p" color="gray">
                {user?.email || 'email@example.com'}
              </Text>
            </Box>
          </Flex>

          <Separator className="my-6" />

          {error && (
            <Badge color="red" variant="soft" className="mb-4 block">
              {error}
            </Badge>
          )}

          {success && (
            <Badge color="green" variant="soft" className="mb-4 block">
              {success}
            </Badge>
          )}

          <Box className="space-y-4">
            <Box>
              <Text as="label" weight="medium" className="block mb-2">
                {language === 'pt' ? 'Nome' : 'Name'}
              </Text>
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                disabled={!editing}
                placeholder={language === 'pt' ? 'Digite seu nome' : 'Enter your name'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </Box>

            <Box>
              <Text as="label" weight="medium" className="block mb-2">
                {language === 'pt' ? 'Email' : 'Email'}
              </Text>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <Text as="p" size="1" color="gray" className="mt-1">
                {language === 'pt' 
                  ? 'O email não pode ser alterado' 
                  : 'Email cannot be changed'
                }
              </Text>
            </Box>
          </Box>

          <Flex gap="3" className="mt-6">
            {!editing ? (
              <Button onClick={() => setEditing(true)}>
                <Pencil1Icon className="mr-2" />
                {language === 'pt' ? 'Editar' : 'Edit'}
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <>
                      <CheckIcon className="mr-2" />
                      {language === 'pt' ? 'Salvar' : 'Save'}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </Button>
              </>
            )}
          </Flex>
        </Box>
      </Card>
    </div>
  );
};

export default ProfilePage; 