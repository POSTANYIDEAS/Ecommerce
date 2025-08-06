import { useEffect } from 'react';

const useTheme = () => {
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
    },
    crimson: {
      name: 'Crimson Red',
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#fbbf24',
      background: '#fef2f2',
      sidebar: 'linear-gradient(180deg, #7f1d1d 0%, #dc2626 100%)',
      text: '#1f2937'
    },
    teal: {
      name: 'Teal Ocean',
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#f59e0b',
      background: '#f0fdfa',
      sidebar: 'linear-gradient(180deg, #134e4a 0%, #0d9488 100%)',
      text: '#1f2937'
    },
    indigo: {
      name: 'Deep Indigo',
      primary: '#4338ca',
      secondary: '#3730a3',
      accent: '#10b981',
      background: '#f8faff',
      sidebar: 'linear-gradient(180deg, #312e81 0%, #4338ca 100%)',
      text: '#1f2937'
    },
    pink: {
      name: 'Magenta Pink',
      primary: '#db2777',
      secondary: '#be185d',
      accent: '#06b6d4',
      background: '#fdf2f8',
      sidebar: 'linear-gradient(180deg, #831843 0%, #db2777 100%)',
      text: '#1f2937'
    },
    lime: {
      name: 'Electric Lime',
      primary: '#65a30d',
      secondary: '#4d7c0f',
      accent: '#f97316',
      background: '#f7fee7',
      sidebar: 'linear-gradient(180deg, #365314 0%, #65a30d 100%)',
      text: '#1f2937'
    },
    cyan: {
      name: 'Cyber Cyan',
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#8b5cf6',
      background: '#ecfeff',
      sidebar: 'linear-gradient(180deg, #164e63 0%, #0891b2 100%)',
      text: '#1f2937'
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
    },
    violet: {
      name: 'Royal Violet',
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#f59e0b',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      text: '#1f2937'
    },
    coral: {
      name: 'Coral Sunset',
      primary: '#ff6b6b',
      secondary: '#ee5a52',
      accent: '#4ecdc4',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #ff8a80 0%, #ff6b6b 100%)',
      text: '#1f2937'
    },
    mint: {
      name: 'Fresh Mint',
      primary: '#20b2aa',
      secondary: '#17a2b8',
      accent: '#ffc107',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #4dd0e1 0%, #20b2aa 100%)',
      text: '#1f2937'
    },
    burgundy: {
      name: 'Wine Burgundy',
      primary: '#8b1538',
      secondary: '#7c1d3a',
      accent: '#f59e0b',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #ad1457 0%, #8b1538 100%)',
      text: '#1f2937'
    },
    navy: {
      name: 'Deep Navy',
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#10b981',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
      text: '#1f2937'
    },
    forest: {
      name: 'Forest Night',
      primary: '#166534',
      secondary: '#15803d',
      accent: '#f97316',
      background: '#ffffff',
      navbar: 'linear-gradient(135deg, #22c55e 0%, #166534 100%)',
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

    console.log(`Applied ${panel} theme: ${themeName}`, theme);
  };

  useEffect(() => {
    // Load and apply saved themes on component mount
    const savedAdminTheme = localStorage.getItem('adminTheme') || 'default';
    const savedUserTheme = localStorage.getItem('userTheme') || 'default';
    
    console.log('Loading themes:', { admin: savedAdminTheme, user: savedUserTheme });
    
    applyTheme('admin', savedAdminTheme);
    applyTheme('user', savedUserTheme);

    // Listen for theme changes
    const handleThemeChange = (event) => {
      const { panel, themeName } = event.detail;
      applyTheme(panel, themeName);
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return {
    applyTheme,
    adminThemes,
    userThemes
  };
};

export default useTheme;
