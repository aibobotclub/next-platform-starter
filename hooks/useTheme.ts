import { useCallback } from 'react';

interface ThemeVariables {
  [key: string]: string;
}

export function useTheme() {
  const themeVariables: ThemeVariables = {
    '--border-radius': '4px',
    '--foreground': '#000000',
    '--foreground-muted': '#666666',
    '--success': '#22c55e',
    '--error': '#ef4444',
  };

  return {
    themeVariables
  };
} 