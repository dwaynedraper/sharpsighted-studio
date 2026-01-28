import type { AccentColor } from './types';

// Curated accent color palette - all colors meet WCAG contrast requirements
export const ACCENT_COLORS: AccentColor[] = [
    {
        name: 'Brand Blue',
        value: '#38bdf8',
        lightContrast: '#0ea5e9',
        darkContrast: '#7dd3fc',
    },
    {
        name: 'Cerise',
        value: '#EC4899',
        lightContrast: '#db2777',
        darkContrast: '#f472b6',
    },
    {
        name: 'Steel Blue',
        value: '#4A90E2',
        lightContrast: '#2563eb', // Darker for light mode
        darkContrast: '#60a5fa',  // Lighter for dark mode
    },
    {
        name: 'Emerald',
        value: '#10B981',
        lightContrast: '#059669',
        darkContrast: '#34d399',
    },
    {
        name: 'Purple',
        value: '#A855F7',
        lightContrast: '#9333ea',
        darkContrast: '#c084fc',
    },
    {
        name: 'Cyan',
        value: '#06B6D4',
        lightContrast: '#0891b2',
        darkContrast: '#22d3ee',
    },
    {
        name: 'Orange',
        value: '#F97316',
        lightContrast: '#ea580c',
        darkContrast: '#fb923c',
    },
    {
        name: 'Teal',
        value: '#14B8A6',
        lightContrast: '#0d9488',
        darkContrast: '#2dd4bf',
    },
    {
        name: 'Rose',
        value: '#F43F5E',
        lightContrast: '#e11d48',
        darkContrast: '#fb7185',
    },
    {
        name: 'Indigo',
        value: '#6366F1',
        lightContrast: '#4f46e5',
        darkContrast: '#818cf8',
    },
];

// Default preferences
export const DEFAULT_THEME = 'system';
export const DEFAULT_ACCENT = 'Brand Blue';

// Cookie configuration for cross-subdomain sharing
export const COOKIE_CONFIG = {
    THEME_COOKIE_NAME: 'ss-theme',
    ACCENT_COOKIE_NAME: 'ss-accent',
    // Domain must be parent domain to share across subdomains
    // In production: '.sharpsighted.studio'
    // In development: 'localhost'
    COOKIE_DOMAIN: process.env.NODE_ENV === 'production'
        ? '.sharpsighted.studio'
        : 'localhost',
    COOKIE_MAX_AGE: 365 * 24 * 60 * 60, // 1 year in seconds
    COOKIE_PATH: '/',
    COOKIE_SAME_SITE: 'lax' as const,
};
