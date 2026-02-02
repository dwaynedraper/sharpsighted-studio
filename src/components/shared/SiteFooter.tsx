import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['700'],
    display: 'swap',
});

export function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 px-4 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto text-center">
                <p
                    className={`${playfair.className} text-xl md:text-2xl text-[#38bdf8] mb-4`}
                >
                    Stay Sharp. Stay Seen. Stay Human.
                </p>
                <p className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
                    © {currentYear} Sharp Sighted Studio
                </p>
            </div>
        </footer>
    );
}
