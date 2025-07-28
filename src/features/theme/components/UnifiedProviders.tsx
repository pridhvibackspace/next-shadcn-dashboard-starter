'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { UnifiedThemeProvider, useTheme } from '../contexts/ThemeContext';

function ClerkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedMode } = useTheme();
  
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedMode === 'dark' ? dark : undefined
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function UnifiedProviders({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <UnifiedThemeProvider initialColorTheme={activeThemeValue as any}>
        <ClerkThemeWrapper>
          {children}
        </ClerkThemeWrapper>
      </UnifiedThemeProvider>
    </NextThemesProvider>
  );
}