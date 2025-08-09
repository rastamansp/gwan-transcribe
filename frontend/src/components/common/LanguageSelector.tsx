import React from 'react';
import { IconButton } from '@radix-ui/themes';
import { GlobeIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'pt' | 'en');
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton aria-label="select language">
          <GlobeIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={8} align="end" style={{ background: 'white', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: 4 }}>
          {languages.map((lang) => (
            <DropdownMenu.Item
              key={lang.code}
              onSelect={() => handleLanguageChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 6,
                background: language === lang.code ? 'rgba(25,118,210,0.08)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ marginRight: 8 }}>{lang.flag}</span>
              {lang.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default LanguageSelector; 