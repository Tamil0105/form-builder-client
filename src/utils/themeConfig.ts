export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  gradient: string;
  buttonGradient: string;
}

export const themeConfigs: Record<string, ThemeColors> = {
  purple: {
    primary: '#9333ea',
    secondary: '#ec4899',
    accent: '#6366f1',
    background: 'linear-gradient(to bottom right, #faf5ff, #fce7f3, #eef2ff)',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e9d5ff',
    gradient: 'linear-gradient(to right, #9333ea, #ec4899)',
    buttonGradient: 'linear-gradient(to right, #9333ea, #ec4899)',
  },
  blue: {
    primary: '#2563eb',
    secondary: '#0ea5e9',
    accent: '#3b82f6',
    background: 'linear-gradient(to bottom right, #eff6ff, #e0f2fe, #dbeafe)',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    border: '#bfdbfe',
    gradient: 'linear-gradient(to right, #2563eb, #0ea5e9)',
    buttonGradient: 'linear-gradient(to right, #2563eb, #0ea5e9)',
  },
  green: {
    primary: '#059669',
    secondary: '#10b981',
    accent: '#14b8a6',
    background: 'linear-gradient(to bottom right, #ecfdf5, #d1fae5, #ccfbf1)',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    border: '#a7f3d0',
    gradient: 'linear-gradient(to right, #059669, #10b981)',
    buttonGradient: 'linear-gradient(to right, #059669, #10b981)',
  },
  orange: {
    primary: '#ea580c',
    secondary: '#f97316',
    accent: '#fb923c',
    background: 'linear-gradient(to bottom right, #fff7ed, #ffedd5, #fed7aa)',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    border: '#fed7aa',
    gradient: 'linear-gradient(to right, #ea580c, #f97316)',
    buttonGradient: 'linear-gradient(to right, #ea580c, #f97316)',
  },
  pink: {
    primary: '#db2777',
    secondary: '#ec4899',
    accent: '#f472b6',
    background: 'linear-gradient(to bottom right, #fdf2f8, #fce7f3, #fbcfe8)',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    border: '#fbcfe8',
    gradient: 'linear-gradient(to right, #db2777, #ec4899)',
    buttonGradient: 'linear-gradient(to right, #db2777, #ec4899)',
  },
};

export const getThemeColors = (theme: string = 'purple'): ThemeColors => {
  return themeConfigs[theme] || themeConfigs.purple;
};

export const themeNames = {
  purple: 'Purple Dream',
  blue: 'Ocean Blue',
  green: 'Fresh Green',
  orange: 'Sunset Orange',
  pink: 'Sweet Pink',
};
