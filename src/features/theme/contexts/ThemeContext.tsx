'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

const COOKIE_NAME = 'active_theme';
const DEFAULT_COLOR_THEME = 'default';

function setThemeCookie(theme: string) {
  if (typeof window === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${
    window.location.protocol === 'https:' ? 'Secure;' : ''
  }`;
}

type ColorTheme = 'default' | 'blue' | 'green' | 'amber' | 'default-scaled' | 'blue-scaled' | 'mono-scaled';
type DarkModeTheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  // Color theme (for the active-theme system)
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  
  // Dark/light mode (from next-themes)
  mode: DarkModeTheme;
  setMode: (mode: DarkModeTheme) => void;
  resolvedMode: 'light' | 'dark' | undefined;
  
  // Utility methods
  toggleMode: () => void;
  
  // Combined theme data
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function UnifiedThemeProvider({
  children,
  initialColorTheme
}: {
  children: ReactNode;
  initialColorTheme?: ColorTheme;
}) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => initialColorTheme || DEFAULT_COLOR_THEME
  );
  const [isLoading, setIsLoading] = useState(true);

  // Handle color theme changes
  useEffect(() => {
    setThemeCookie(colorTheme);

    // Clean up previous theme classes
    Array.from(document.body.classList)
      .filter((className) => className.startsWith('theme-'))
      .forEach((className) => {
        document.body.classList.remove(className);
      });

    // Apply new theme classes
    document.body.classList.add(`theme-${colorTheme}`);
    if (colorTheme.endsWith('-scaled')) {
      document.body.classList.add('theme-scaled');
    }
  }, [colorTheme]);

  // Handle loading state
  useEffect(() => {
    if (resolvedTheme !== undefined) {
      setIsLoading(false);
    }
  }, [resolvedTheme]);

  const toggleMode = () => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newMode);
  };

  const handleModeChange = (mode: DarkModeTheme) => {
    setTheme(mode);
  };

  const contextValue: ThemeContextType = {
    colorTheme,
    setColorTheme,
    mode: (theme as DarkModeTheme) || 'system',
    setMode: handleModeChange,
    resolvedMode: resolvedTheme as 'light' | 'dark' | undefined,
    toggleMode,
    isLoading
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a UnifiedThemeProvider');
  }
  return context;
}