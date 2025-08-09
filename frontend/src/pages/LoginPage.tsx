import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { login, verifyOTP } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(language === 'pt' ? 'Email é obrigatório' : 'Email is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email);
      setShowOTP(true);
    } catch (error) {
      setError(language === 'pt' ? 'Erro ao enviar OTP' : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError(language === 'pt' ? 'OTP é obrigatório' : 'OTP is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(email, otp);
    } catch (error) {
      setError(language === 'pt' ? 'OTP inválido' : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'background.default' }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gwan Transcribe
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {language === 'pt' 
              ? 'Faça login para continuar' 
              : 'Sign in to continue'
            }
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!showOTP ? (
            <Box component="form" onSubmit={handleEmailSubmit}>
              <TextField
                fullWidth
                label={language === 'pt' ? 'Email' : 'Email'}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  language === 'pt' ? 'Enviar OTP' : 'Send OTP'
                )}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleOTPSubmit}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {language === 'pt' 
                  ? `OTP enviado para ${email}` 
                  : `OTP sent to ${email}`
                }
              </Typography>
              <TextField
                fullWidth
                label={language === 'pt' ? 'Código OTP' : 'OTP Code'}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                inputProps={{ maxLength: 6 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  language === 'pt' ? 'Verificar OTP' : 'Verify OTP'
                )}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => setShowOTP(false)}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {language === 'pt' ? 'Voltar' : 'Back'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage; 