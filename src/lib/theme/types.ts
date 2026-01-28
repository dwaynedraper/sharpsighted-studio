export type ThemeMode = 'light' | 'dark' | 'system';

export interface AccentColor {
    name: string;
    value: string;
    lightContrast: string;
    darkContrast: string;
}

export interface ThemePreferences {
    theme: ThemeMode;
    accent: string;
}

export interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    resolvedTheme: 'light' | 'dark';
}

export interface AccentContextType {
    accent: string;
    setAccent: (accent: string) => void;
    accentColor: AccentColor | undefined;
}
