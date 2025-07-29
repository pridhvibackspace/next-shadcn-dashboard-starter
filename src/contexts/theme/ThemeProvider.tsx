'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react';
import { useTheme as useNextTheme } from 'next-themes';

const ACTIVE_THEME_COOKIE_NAME = 'active_theme';
const DEFAULT_ACTIVE_THEME = 'default';

interface ThemeContextType {
  // Next.js theme (dark/light mode)
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;

  // Active theme (color scheme)
  activeTheme: string;
  setActiveTheme: (theme: string) => void;

  // Unified theme toggle with view transition
  toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function setActiveThemeCookie(theme: string) {
  if (typeof window === 'undefined') return;

  document.cookie = `${ACTIVE_THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${
    window.location.protocol === 'https:' ? 'Secure;' : ''
  }`;
}

export function ThemeProvider({
  children,
  initialActiveTheme
}: {
  children: ReactNode;
  initialActiveTheme?: string;
}) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [activeTheme, setActiveThemeState] = useState<string>(
    () => initialActiveTheme || DEFAULT_ACTIVE_THEME
  );

  const setActiveTheme = useCallback((theme: string) => {
    setActiveThemeState(theme);
    setActiveThemeCookie(theme);
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event for view transition
      if (event) {
        root.style.setProperty('--x', `${event.clientX}px`);
        root.style.setProperty('--y', `${event.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [resolvedTheme, setTheme]
  );

  // Apply active theme classes to body
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Remove existing theme classes
    Array.from(document.body.classList)
      .filter((className) => className.startsWith('theme-'))
      .forEach((className) => {
        document.body.classList.remove(className);
      });

    // Add new theme classes
    document.body.classList.add(`theme-${activeTheme}`);
    if (activeTheme.endsWith('-scaled')) {
      document.body.classList.add('theme-scaled');
    }
  }, [activeTheme]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    activeTheme,
    setActiveTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Backward compatibility exports
export function useThemeConfig() {
  const { activeTheme, setActiveTheme } = useTheme();
  return { activeTheme, setActiveTheme };
}
