'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
  systemTheme: 'dark' | 'light';
  customColors: CustomColors;
  setCustomColors: (colors: Partial<CustomColors>) => void;
  resetCustomColors: () => void;
};

type CustomColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
  systemTheme: 'light',
  customColors: {
    primary: '',
    secondary: '',
    accent: '',
    background: '',
    foreground: '',
  },
  setCustomColors: () => null,
  resetCustomColors: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [customColors, setCustomColorsState] = useState<CustomColors>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ui-custom-colors');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialState.customColors;
        }
      }
    }
    return initialState.customColors;
  });

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      setSystemTheme(systemTheme);
      setResolvedTheme(systemTheme);
      return;
    }

    root.classList.add(theme);
    setResolvedTheme(theme as 'dark' | 'light');
  }, [theme, enableSystem]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      setSystemTheme(systemTheme);
      
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
        setResolvedTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange();

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    localStorage.setItem('ui-custom-colors', JSON.stringify(customColors));
    applyCustomColors(customColors);
  }, [customColors]);

  const applyCustomColors = (colors: CustomColors) => {
    const root = window.document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        // 将hex颜色转换为HSL
        const hsl = hexToHsl(value);
        if (hsl) {
          root.style.setProperty(`--${key}`, hsl);
        }
      } else {
        root.style.removeProperty(`--${key}`);
      }
    });
  };

  const setCustomColors = (colors: Partial<CustomColors>) => {
    setCustomColorsState(prev => ({ ...prev, ...colors }));
  };

  const resetCustomColors = () => {
    setCustomColorsState(initialState.customColors);
    const root = window.document.documentElement;
    Object.keys(initialState.customColors).forEach(key => {
      root.style.removeProperty(`--${key}`);
    });
  };

  const handleSetTheme = (newTheme: Theme) => {
    if (disableTransitionOnChange) {
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(
          `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
        )
      );
      document.head.appendChild(css);

      window.getComputedStyle(document.body);
      setTimeout(() => {
        document.head.removeChild(css);
      }, 1);
    }

    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
    systemTheme,
    customColors,
    setCustomColors,
    resetCustomColors,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// 辅助函数：将hex颜色转换为HSL
function hexToHsl(hex: string): string | null {
  // 移除 # 符号
  hex = hex.replace('#', '');
  
  // 解析RGB值
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}