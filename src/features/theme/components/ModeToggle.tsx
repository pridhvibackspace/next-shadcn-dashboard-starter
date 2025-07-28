'use client';

import { IconBrightness } from '@tabler/icons-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function ModeToggle() {
  const { toggleMode, resolvedMode } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const root = document.documentElement;

      if (!document.startViewTransition) {
        toggleMode();
        return;
      }

      // Set coordinates from the click event for smooth transition
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        toggleMode();
      });
    },
    [toggleMode]
  );

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={handleThemeToggle}
    >
      <IconBrightness />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}