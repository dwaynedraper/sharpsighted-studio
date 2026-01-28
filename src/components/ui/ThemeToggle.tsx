'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 text-[var(--accent)] transition-all duration-300 hover:scale-[1.2]"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 w-full h-full transition-all duration-300 ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
                        }`}
                />
                <Moon
                    className={`absolute inset-0 w-full h-full transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                        }`}
                />
            </div>
        </button>
    );
}
