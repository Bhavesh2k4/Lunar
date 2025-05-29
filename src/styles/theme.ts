export const theme = {
  colors: {
    background: '#F5F3F0',
    surface: '#FFFFFF',
    primary: '#1A1A1A',
    secondary: '#6B6B6B',
    accent: '#4CAF50',
    inactive: '#B0B0B0',
    border: '#E0E0E0',
    NotToday: '#e28743',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    pill: 20,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: '700' as const,
    },
    heading: {
      fontSize: 28,
      fontWeight: '800' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '700' as const,
    },
  },
};