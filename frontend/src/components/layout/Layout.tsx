import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import { Box, Flex, Container, IconButton, Text } from '@radix-ui/themes';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/common/LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { to: '/', label: language === 'pt' ? 'Início' : 'Home' },
    { to: '/upload', label: language === 'pt' ? 'Upload' : 'Upload' },
    { to: '/history', label: language === 'pt' ? 'Histórico' : 'History' },
    { to: '/profile', label: language === 'pt' ? 'Perfil' : 'Profile' },
  ];

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box style={{ background: 'var(--accent-a3)' }}>
        <Container>
          <Flex align="center" justify="between" py="3" wrap="wrap" gap="3">
            <Text weight="medium">Gwan Transcribe</Text>

            <Flex align="center" gap="3" style={{ flex: 1, justifyContent: 'center' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    padding: '6px 10px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    color: isActive ? 'var(--accent-11)' : 'var(--gray-12)',
                    background: isActive ? 'var(--accent-a4)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </Flex>

            <Flex align="center" gap="3">
              <LanguageSelector />
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton aria-label="account">
                    <PersonIcon />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content sideOffset={8} align="end" style={{ background: 'white', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: 4 }}>
                    <DropdownMenu.Item disabled style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconButton size="1" variant="soft">
                        <PersonIcon />
                      </IconButton>
                      <Text>{user?.name || 'User'}</Text>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={handleLogout} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderRadius: 6 }}>
                      <ExitIcon />
                      <Text>{language === 'pt' ? 'Sair' : 'Logout'}</Text>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container style={{ flexGrow: 1, padding: '16px 0' }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 