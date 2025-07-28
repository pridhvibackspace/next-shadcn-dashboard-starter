export const DEFAULT_THEMES = [
  {
    name: 'Default',
    value: 'default' as const
  },
  {
    name: 'Blue',
    value: 'blue' as const
  },
  {
    name: 'Green',
    value: 'green' as const
  },
  {
    name: 'Amber',
    value: 'amber' as const
  }
];

export const SCALED_THEMES = [
  {
    name: 'Default',
    value: 'default-scaled' as const
  },
  {
    name: 'Blue',
    value: 'blue-scaled' as const
  }
];

export const MONO_THEMES = [
  {
    name: 'Mono',
    value: 'mono-scaled' as const
  }
];

export const ALL_THEMES = [...DEFAULT_THEMES, ...SCALED_THEMES, ...MONO_THEMES];

export type ColorTheme = typeof ALL_THEMES[number]['value'];
export type DarkModeTheme = 'light' | 'dark' | 'system';