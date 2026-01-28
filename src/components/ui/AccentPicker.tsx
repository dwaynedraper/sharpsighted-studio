'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccent } from '@/components/providers/AccentProvider';
import { ACCENT_COLORS } from '@/lib/theme/constants';

export function AccentPicker() {
    const { accent, setAccent } = useAccent();
    const [isOpen, setIsOpen] = useState(false);

    // Get current accent color value
    const currentColor = ACCENT_COLORS.find(c => c.name === accent)?.value || ACCENT_COLORS[0].value;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-100/10 dark:hover:bg-neutral-800/10 transition-colors group"
                aria-label="Choose accent color"
                aria-expanded={isOpen}
                type="button"
            >
                <div
                    className="w-4 h-4 rounded-full border border-neutral-400/20 dark:border-neutral-500/20 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{
                        backgroundColor: currentColor,
                        boxShadow: `0 0 8px ${currentColor}40`
                    }}
                    aria-hidden="true"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 mt-2 w-80 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50"
                            role="menu"
                            aria-label="Accent color options"
                        >
                            <div className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                                Select Accent Color
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {ACCENT_COLORS.map((color) => {
                                    const isSelected = accent === color.name;
                                    const displayName = color.name.replace(' ', '\n');

                                    return (
                                        <button
                                            key={color.name}
                                            onClick={() => {
                                                setAccent(color.name);
                                                setIsOpen(false);
                                            }}
                                            className={`group relative flex items-center gap-3 p-2 border rounded-[3px] transition-all text-left h-12 overflow-hidden ${isSelected
                                                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/50 shadow-sm'
                                                    : 'border-neutral-200/50 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 hover:border-neutral-300 dark:hover:border-neutral-600'
                                                }`}
                                            aria-label={`Select ${color.name} accent`}
                                            aria-current={isSelected}
                                            type="button"
                                            role="menuitem"
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                                                style={{ backgroundColor: color.value }}
                                            />
                                            <span className={`text-[9px] font-mono font-bold uppercase leading-tight whitespace-pre-line transition-colors ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                                                }`}>
                                                {displayName}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-center font-mono text-neutral-400 dark:text-neutral-500 uppercase">
                                Affects Focus Rings & Highlights
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
