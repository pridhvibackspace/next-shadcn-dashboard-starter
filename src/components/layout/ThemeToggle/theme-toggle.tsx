'use client';

import { IconBrightness } from '@tabler/icons-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme';

export function ModeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={toggleTheme}
    >
      <IconBrightness />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
