import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Text,
  Button
} from '@radix-ui/themes';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { login, verifyOTP } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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
    if (!name) {
      setError(language === 'pt' ? 'Nome é obrigatório' : 'Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, name);
      setShowOTP(true);
    } catch {
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
      navigate('/');
    } catch {
      setError(language === 'pt' ? 'OTP inválido' : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding & Info */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo & Brand */}
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-purple-500/25">
                <Text className="text-white font-bold text-4xl">G</Text>
              </div>
              
              <div className="space-y-4">
                <Text as="div" className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Gwan Transcribe
                </Text>
                
                <Text as="p" className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-md lg:max-w-none">
                  {language === 'pt' 
                    ? 'Transforme áudio em texto com inteligência artificial de ponta' 
                    : 'Transform audio to text with cutting-edge artificial intelligence'
                  }
                </Text>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <Text as="span" className="text-lg">
                  {language === 'pt' ? 'Transcrição precisa e rápida' : 'Accurate and fast transcription'}
                </Text>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <Text as="span" className="text-lg">
                  {language === 'pt' ? 'Suporte a múltiplos idiomas' : 'Multi-language support'}
                </Text>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <Text as="span" className="text-lg">
                  {language === 'pt' ? 'Processamento em nuvem seguro' : 'Secure cloud processing'}
                </Text>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Text as="div" className="text-2xl font-bold text-white">99.8%</Text>
                <Text as="div" className="text-sm text-slate-400">
                  {language === 'pt' ? 'Precisão' : 'Accuracy'}
                </Text>
              </div>
              <div className="text-center">
                <Text as="div" className="text-2xl font-bold text-white">50+</Text>
                <Text as="div" className="text-sm text-slate-400">
                  {language === 'pt' ? 'Idiomas' : 'Languages'}
                </Text>
              </div>
              <div className="text-center">
                <Text as="div" className="text-2xl font-bold text-white">24/7</Text>
                <Text as="div" className="text-sm text-slate-400">
                  {language === 'pt' ? 'Suporte' : 'Support'}
                </Text>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20">
              <div className="p-8 space-y-6">
                {/* Form Header */}
                <div className="text-center space-y-2">
                  <Text as="div" className="text-2xl font-bold text-white">
                    {language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!'}
                  </Text>
                  <Text as="p" className="text-slate-300">
                    {language === 'pt' 
                      ? 'Entre com suas credenciais para continuar' 
                      : 'Sign in with your credentials to continue'
                    }
                  </Text>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <Text as="div" className="text-red-300 text-center text-sm">
                      {error}
                    </Text>
                  </div>
                )}

                {/* Login Form */}
                {!showOTP ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-white/90 text-sm font-medium">
                        {language === 'pt' ? 'Nome Completo' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Digite seu nome completo' : 'Enter your full name'}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white/90 text-sm font-medium">
                        {language === 'pt' ? 'Email' : 'Email'}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder={language === 'pt' ? 'Digite seu email' : 'Enter your email'}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25" 
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {language === 'pt' ? 'Enviando...' : 'Sending...'}
                        </div>
                      ) : (
                        language === 'pt' ? 'Enviar Código OTP' : 'Send OTP Code'
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleOTPSubmit} className="space-y-6">
                    {/* OTP Info */}
                    <div className="text-center space-y-4">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <Text as="div" className="text-white/80 text-sm mb-2">
                          {language === 'pt' 
                            ? `Código enviado para:` 
                            : `Code sent to:`
                          }
                        </Text>
                        <Text as="div" className="text-white font-medium">
                          {email}
                        </Text>
                      </div>
                      
                      <Text as="div" className="text-white/60 text-xs">
                        {language === 'pt' 
                          ? 'Verifique sua caixa de entrada e pasta de spam' 
                          : 'Check your inbox and spam folder'
                        }
                      </Text>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <label className="block text-white/90 text-sm font-medium">
                        {language === 'pt' ? 'Código OTP' : 'OTP Code'}
                      </label>
                      <input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-center text-2xl tracking-widest font-mono"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            {language === 'pt' ? 'Verificando...' : 'Verifying...'}
                          </div>
                        ) : (
                          language === 'pt' ? 'Verificar Código' : 'Verify Code'
                        )}
                      </Button>

                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full text-white/80 hover:text-white hover:bg-white/20 rounded-xl py-3 transition-all duration-200"
                        onClick={() => setShowOTP(false)}
                      >
                        {language === 'pt' ? '← Voltar' : '← Back'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Footer */}
                <div className="text-center pt-4">
                  <Text as="div" className="text-white/60 text-xs">
                    {language === 'pt' 
                      ? 'Sistema seguro de autenticação OTP' 
                      : 'Secure OTP authentication system'
                    }
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 