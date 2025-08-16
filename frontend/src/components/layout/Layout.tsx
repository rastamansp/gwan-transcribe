import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Text,
  Button,
  Avatar
} from '@radix-ui/themes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@radix-ui/react-dropdown-menu';
import {
  SunIcon,
  PersonIcon,
  ExitIcon,
  GearIcon
} from '@radix-ui/react-icons';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const navigation = [
    {
      name: language === 'pt' ? 'Dashboard' : 'Dashboard',
      href: '/dashboard',
      icon: '🏠',
      current: location.pathname === '/dashboard'
    },
    {
      name: language === 'pt' ? 'Upload' : 'Upload',
      href: '/upload',
      icon: '📤',
      current: location.pathname === '/upload'
    },
    {
      name: language === 'pt' ? 'Histórico' : 'History',
      href: '/history',
      icon: '📋',
      current: location.pathname === '/history'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <Text size="5" weight="bold" className="text-slate-900 dark:text-white">
                Gwan Transcribe
              </Text>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="2"
                onClick={toggleLanguage}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {language === 'pt' ? '🇺🇸' : '🇧🇷'}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="2"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <SunIcon className="w-4 h-4" />
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar
                      size="2"
                      fallback={user?.name?.charAt(0) || 'U'}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    />
                    <Text size="2" className="hidden sm:block">
                      {user?.name || 'Usuário'}
                    </Text>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <PersonIcon className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Perfil' : 'Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <GearIcon className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Configurações' : 'Settings'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <ExitIcon className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Sair' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout; 