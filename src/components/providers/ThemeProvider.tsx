'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getThemeFromCookie, setThemeCookie } from '@/lib/theme/cookie-utils';
import { DEFAULT_THEME } from '@/lib/theme/constants';
import type { ThemeMode, ThemeContextType } from '@/lib/theme/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    initialTheme?: ThemeMode;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeMode>(initialTheme || (DEFAULT_THEME as ThemeMode));
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    // Resolve system preference
    useEffect(() => {
        const updateResolvedTheme = () => {
            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                setResolvedTheme(systemTheme);
            } else {
                setResolvedTheme(theme);
            }
        };

        updateResolvedTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => updateResolvedTheme();

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);

    // Apply theme class to document
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        root.setAttribute('data-theme', resolvedTheme);
    }, [resolvedTheme]);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        setThemeCookie(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
