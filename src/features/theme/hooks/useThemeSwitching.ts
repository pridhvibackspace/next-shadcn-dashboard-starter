import { useRegisterActions } from 'kbar';
import { useTheme } from '../contexts/ThemeContext';

export function useThemeSwitching() {
  const { mode, setMode, toggleMode } = useTheme();

  const themeActions = [
    {
      id: 'toggleTheme',
      name: 'Toggle Theme',
      shortcut: ['t', 't'],
      section: 'Theme',
      perform: toggleMode
    },
    {
      id: 'setLightTheme',
      name: 'Set Light Theme',
      section: 'Theme',
      perform: () => setMode('light')
    },
    {
      id: 'setDarkTheme',
      name: 'Set Dark Theme',
      section: 'Theme',
      perform: () => setMode('dark')
    },
    {
      id: 'setSystemTheme',
      name: 'Set System Theme',
      section: 'Theme',
      perform: () => setMode('system')
    }
  ];

  useRegisterActions(themeActions, [mode]);

  return { toggleMode, setMode };
}