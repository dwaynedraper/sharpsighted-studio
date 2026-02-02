'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AccentPicker } from '@/components/ui/AccentPicker';
import { AuthButton } from '@/components/auth/AuthButton';
import { motion } from 'framer-motion';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'The Collective', href: '/the-collective' },
    { name: '10% Rule', href: '/10-percent-rule' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 rounded px-2 py-1"
                        >
                            <Image
                                src="/images/Sharp Sighted Blue Iris.png"
                                alt="Sharp Sighted Logo"
                                width={32}
                                height={32}
                                className="transition-transform group-hover:scale-110"
                            />
                            <span className="text-lg font-semibold tracking-tight uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
                                Sharp Sighted Studio
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:ring-offset-2 rounded-lg"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="main-nav-active"
                                            className="absolute inset-0 bg-gradient-to-r from-[var(--brand-blue)]/10 to-[var(--cerise)]/10 rounded-lg glow-blue"
                                            initial={false}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                    <span
                                        className={`relative z-10 ${isActive
                                            ? 'gradient-text'
                                            : 'text-neutral-900 dark:text-neutral-300 hover:text-[var(--brand-blue)]'
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Theme Controls & Auth */}
                    <div className="flex items-center gap-3">
                        <AuthButton variant="main" />
                        <ThemeToggle />
                        <AccentPicker />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-3 pt-2 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:ring-offset-2 ${isActive
                                    ? 'gradient-text bg-gradient-to-r from-[var(--brand-blue)]/10 to-[var(--cerise)]/10'
                                    : 'text-neutral-900 dark:text-neutral-300 hover:text-[var(--brand-blue)] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                    }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
