import { renderHook } from '@testing-library/react';
import { UnifiedThemeProvider, useTheme } from '@/features/theme/contexts/ThemeContext';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UnifiedThemeProvider initialColorTheme="default">
    {children}
  </UnifiedThemeProvider>
);

describe('Theme Context', () => {
  beforeEach(() => {
    const { useTheme: useNextTheme } = require('next-themes');
    useNextTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
      systemTheme: 'light'
    });
  });

  it('should provide theme context values', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.colorTheme).toBe('default');
    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedMode).toBe('light');
    expect(typeof result.current.setColorTheme).toBe('function');
    expect(typeof result.current.setMode).toBe('function');
    expect(typeof result.current.toggleMode).toBe('function');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a UnifiedThemeProvider');
  });
});