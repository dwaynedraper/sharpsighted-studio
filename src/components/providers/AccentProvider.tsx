'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAccentFromCookie, setAccentCookie } from '@/lib/theme/cookie-utils';
import { ACCENT_COLORS, DEFAULT_ACCENT } from '@/lib/theme/constants';
import type { AccentColor, AccentContextType } from '@/lib/theme/types';
import { useTheme } from './ThemeProvider';

const AccentContext = createContext<AccentContextType | undefined>(undefined);

interface AccentProviderProps {
    children: React.ReactNode;
    initialAccent?: string;
}

export function AccentProvider({ children, initialAccent }: AccentProviderProps) {
    const [accent, setAccentState] = useState<string>(initialAccent || DEFAULT_ACCENT);
    const { resolvedTheme } = useTheme();

    const accentColor = ACCENT_COLORS.find(c => c.name === accent);

    // Apply accent CSS variables to document
    useEffect(() => {
        if (!accentColor) return;

        const root = document.documentElement;
        const accentValue = resolvedTheme === 'dark'
            ? accentColor.darkContrast
            : accentColor.lightContrast;

        // Convert hex to RGB for rgba() usage in glows
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
                : '56, 189, 248'; // fallback to brand blue RGB
        };

        root.style.setProperty('--accent', accentValue);
        root.style.setProperty('--accent-base', accentColor.value);
        root.style.setProperty('--accent-rgb', hexToRgb(accentValue));
    }, [accentColor, resolvedTheme]);

    const setAccent = (newAccent: string) => {
        setAccentState(newAccent);
        setAccentCookie(newAccent);
    };

    return (
        <AccentContext.Provider value={{ accent, setAccent, accentColor }}>
            {children}
        </AccentContext.Provider>
    );
}

export function useAccent() {
    const context = useContext(AccentContext);
    if (context === undefined) {
        throw new Error('useAccent must be used within an AccentProvider');
    }
    return context;
}
