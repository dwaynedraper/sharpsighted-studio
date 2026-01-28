import Cookies from 'js-cookie';
import { COOKIE_CONFIG, DEFAULT_THEME, DEFAULT_ACCENT } from './constants';
import type { ThemeMode } from './types';

// Client-side cookie utilities
export const getThemeFromCookie = (): ThemeMode => {
    const theme = Cookies.get(COOKIE_CONFIG.THEME_COOKIE_NAME);
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
        return theme;
    }
    return DEFAULT_THEME as ThemeMode;
};

export const setThemeCookie = (theme: ThemeMode): void => {
    Cookies.set(COOKIE_CONFIG.THEME_COOKIE_NAME, theme, {
        domain: COOKIE_CONFIG.COOKIE_DOMAIN,
        path: COOKIE_CONFIG.COOKIE_PATH,
        expires: COOKIE_CONFIG.COOKIE_MAX_AGE / (24 * 60 * 60), // Convert to days
        sameSite: COOKIE_CONFIG.COOKIE_SAME_SITE,
    });
};

export const getAccentFromCookie = (): string => {
    const accent = Cookies.get(COOKIE_CONFIG.ACCENT_COOKIE_NAME);
    return accent || DEFAULT_ACCENT;
};

export const setAccentCookie = (accent: string): void => {
    Cookies.set(COOKIE_CONFIG.ACCENT_COOKIE_NAME, accent, {
        domain: COOKIE_CONFIG.COOKIE_DOMAIN,
        path: COOKIE_CONFIG.COOKIE_PATH,
        expires: COOKIE_CONFIG.COOKIE_MAX_AGE / (24 * 60 * 60), // Convert to days
        sameSite: COOKIE_CONFIG.COOKIE_SAME_SITE,
    });
};

// Server-side cookie utilities (for use in Server Components)
export const getThemeFromHeaders = (cookieHeader: string | null): ThemeMode => {
    if (!cookieHeader) return DEFAULT_THEME as ThemeMode;

    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(cookie => {
            const [key, ...values] = cookie.split('=');
            return [key, values.join('=')];
        })
    );

    const theme = cookies[COOKIE_CONFIG.THEME_COOKIE_NAME];
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
        return theme;
    }
    return DEFAULT_THEME as ThemeMode;
};

export const getAccentFromHeaders = (cookieHeader: string | null): string => {
    if (!cookieHeader) return DEFAULT_ACCENT;

    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(cookie => {
            const [key, ...values] = cookie.split('=');
            return [key, values.join('=')];
        })
    );

    return cookies[COOKIE_CONFIG.ACCENT_COOKIE_NAME] || DEFAULT_ACCENT;
};
