import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [adminTheme, setAdminTheme] = useState('default');
  const [userTheme, setUserTheme] = useState('default');

  // Admin themes
  const adminThemes = {
    default: {
      name: 'Ocean Blue',
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#fbbf24',
      background: '#f8fafc',
      sidebar: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
      text: '#1f2937'
    },
    forest: {
      name: 'Forest Green',
      primary: '#10b981',
      secondary: '#047857',
      accent: '#f59e0b',
      background: '#f0fdf4',
      sidebar: 'linear-gradient(180deg, #064e3b 0%, #10b981 100%)',
      text: '#1f2937'
    },
    sunset: {
      name: 'Sunset Orange',
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#8b5cf6',
      background: '#fff7ed',
      sidebar: 'linear-gradient(180deg, #9a3412 0%, #f97316 100%)',
      text: '#1f2937'
    },
    purple: {
      name: 'Royal Purple',
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#10b981',
      background: '#faf5ff',
      sidebar: 'linear-gradient(180deg, #581c87 0%, #8b5cf6 100%)',
      text: '#1f2937'
    },
    dark: {
      name: 'Dark Mode',
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#fbbf24',
      background: '#111827',
      sidebar: 'linear-gradient(180deg, #000000 0%, #374151 100%)',
      text: '#f9fafb'
    }
  };

  // User themes
  const userThemes = {
    default: {
      name: 'Classic Blue',
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#10b981',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#1f2937'
    },
    emerald: {
      name: 'Emerald Green',
      primary: '#10b981',
      secondary: '#059669',
      accent: '#f59e0b',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      text: '#1f2937'
    },
    rose: {
      name: 'Rose Pink',
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#8b5cf6',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)',
      text: '#1f2937'
    },
    amber: {
      name: 'Amber Gold',
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#3b82f6',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      text: '#1f2937'
    },
    slate: {
      name: 'Modern Slate',
      primary: '#64748b',
      secondary: '#475569',
      accent: '#06b6d4',
      background: '#f8fafc',
      navbar: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
      text: '#1f2937'
    }
  };

  const applyTheme = (panel, themeName) => {
    const themes = panel === 'admin' ? adminThemes : userThemes;
    const theme = themes[themeName];
    
    if (!theme) return;

    const root = document.documentElement;
    const prefix = panel === 'admin' ? '--admin' : '--user';
    
    root.style.setProperty(`${prefix}-primary`, theme.primary);
    root.style.setProperty(`${prefix}-secondary`, theme.secondary);
    root.style.setProperty(`${prefix}-accent`, theme.accent);
    root.style.setProperty(`${prefix}-background`, theme.background);
    root.style.setProperty(`${prefix}-text`, theme.text);
    
    if (panel === 'admin') {
      root.style.setProperty(`${prefix}-sidebar`, theme.sidebar);
    } else {
      root.style.setProperty(`${prefix}-navbar`, theme.navbar);
    }
  };

  const changeAdminTheme = (themeName) => {
    setAdminTheme(themeName);
    localStorage.setItem('adminTheme', themeName);
    applyTheme('admin', themeName);
  };

  const changeUserTheme = (themeName) => {
    setUserTheme(themeName);
    localStorage.setItem('userTheme', themeName);
    applyTheme('user', themeName);
  };

  const resetThemes = () => {
    changeAdminTheme('default');
    changeUserTheme('default');
  };

  useEffect(() => {
    // Load saved themes from localStorage
    const savedAdminTheme = localStorage.getItem('adminTheme') || 'default';
    const savedUserTheme = localStorage.getItem('userTheme') || 'default';
    
    setAdminTheme(savedAdminTheme);
    setUserTheme(savedUserTheme);
    
    // Apply themes
    applyTheme('admin', savedAdminTheme);
    applyTheme('user', savedUserTheme);
  }, []);

  const value = {
    adminTheme,
    userTheme,
    adminThemes,
    userThemes,
    changeAdminTheme,
    changeUserTheme,
    resetThemes,
    getCurrentAdminTheme: () => adminThemes[adminTheme],
    getCurrentUserTheme: () => userThemes[userTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
