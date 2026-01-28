'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AccentPicker } from '@/components/ui/AccentPicker';

const navigation = [
    { name: 'HOME', href: '/' },
    { name: 'RULES', href: '/rules' },
    { name: 'CHALLENGES', href: '/challenges' },
    { name: 'VOTING', href: '/voting' },
];

export function RosNav() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-[var(--blueprint-bg)] border-b border-[var(--blueprint-line)]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-14">
                    {/* Logo / Brand - Technical */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-sm font-black font-mono tracking-[0.2em] uppercase text-[var(--blueprint-text)] hover:text-[var(--accent)] transition-colors duration-100 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded-blueprint-sm px-2 py-1 border border-transparent hover:border-[var(--accent)]"
                        >
                            ═══ RoS ═══
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-5 py-2 text-xs font-bold font-mono tracking-[0.15em] uppercase transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded-blueprint-sm border ${isActive
                                        ? 'text-white bg-[var(--accent)] border-[var(--accent)] ros-glow'
                                        : 'text-[var(--blueprint-text)] border-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]'
                                        }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Theme Controls */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <AccentPicker />
                    </div>
                </div>

                {/* Mobile Navigation - Grid layout */}
                <div className="md:hidden pb-2 grid grid-cols-2 gap-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-3 py-3 text-xs font-bold font-mono tracking-[0.15em] uppercase text-center transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded-blueprint border ${isActive
                                    ? 'text-white bg-[var(--accent)] border-[var(--accent)]'
                                    : 'text-[var(--blueprint-text)] bg-[var(--blueprint-bg)] border-[var(--blueprint-line)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
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
