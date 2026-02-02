import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
});

export function RosHomePage() {
    return (
        <div className="min-h-screen bg-[var(--blueprint-bg)] text-[var(--blueprint-text)]">
            {/* ===================== HERO SECTION ===================== */}
            <section className="relative min-h-screen flex items-center justify-center blueprint-grid">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="h-full w-full grid grid-cols-20 grid-rows-20">
                        {Array.from({ length: 400 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-[var(--blueprint-line)]" />
                        ))}
                    </div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
                    <div className="inline-block border blueprint-border-accent rounded-blueprint-sm px-4 py-2 mb-8 bg-[var(--blueprint-bg)]">
                        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)]">
                            Ripped or Stamped: The Architect's Journey
                        </p>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tight leading-[1.1] mb-8">
                        I RECRUITED A{' '}
                        <span className="text-[var(--accent)]">FIRING SQUAD,</span>
                        <br />
                        NOT A PRODUCTION TEAM.
                    </h1>

                    <p className={`${playfair.className} text-xl md:text-2xl italic text-[var(--blueprint-text)]/80 mb-12`}>
                        A crew of creatives with one target: me.
                    </p>

                    <div className="max-w-3xl space-y-4 text-base md:text-lg leading-relaxed font-mono text-[var(--blueprint-text)]/70">
                        <p>
                            Every episode, I'm pushed to the breaking point by photography challenges designed to stretch my skills to their limit. I take the world's most prestigious and notoriously difficult papers and push them to their extreme edge, printing images that could only exist on that one surface.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===================== CONSEQUENCE SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-8">
                        The consequence of failure
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black font-mono leading-[1.1] mb-8">
                        IF I DON'T SUCCEED,<br />
                        I HAVE TO{' '}
                        <span className="ripped-text">RIP MY OWN<br />ARTWORK IN HALF</span>
                        <br />ON CAMERA.
                    </h2>

                    <div className="max-w-3xl space-y-6 font-mono text-base leading-relaxed text-[var(--blueprint-text)]/70">
                        <p>
                            No digital backups.
                            <br />They're deleted the second I print.
                        </p>
                        <p className="ripped-text font-bold text-lg">
                            If it gets ripped, my precious art is gone forever.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===================== WHAT THIS IS SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-8">
                            What This Is
                        </div>

                        <h2 className={`${playfair.className} text-3xl md:text-4xl italic mb-8 leading-snug`}>
                            In architecture, the design does not come first.
                            <br /><span className="text-[var(--accent)]">The material does.</span>
                        </h2>

                        <div className="space-y-6 font-mono text-base leading-relaxed text-[var(--blueprint-text)]/70">
                            <p>
                                An architect does not sketch freely and then hope steel, concrete, or glass can be forced to comply. The limits of the material shape the structure from the beginning. Ignore that reality, and the building fails.
                            </p>
                            <p className="text-[var(--accent)] font-bold border-l-2 border-[var(--accent)] pl-4">
                                Ripped or Stamped: The Architect's Journey is built on that same principle.
                            </p>
                            <p>
                                Great photography should not begin with what looks good on a screen. It should begin with how the final object must exist in the real world. The paper is not a delivery method. It is the material the image is built from.
                            </p>
                            <p className={`${playfair.className} text-lg italic`}>
                                This series documents what happens when photography is treated like architecture.
                            </p>
                        </div>
                    </div>

                    <div className="blueprint-card p-8">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-4">
                            Photography Specimen
                        </div>
                        <div className="text-2xl font-mono font-bold text-[var(--accent)] mb-6">
                            RoS Blueprint // 001
                        </div>

                        <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--blueprint-text)]/70">
                            <p>
                                By the end of this project, I will have defined <span className="text-[var(--accent)] font-bold">The New Standard</span> for Sharp Sighted Photos. Five world-class papers, each pushed to its extreme limits, each chosen to hold my style and leave a legacy.
                            </p>
                            <p>
                                Everything learned along the way becomes public knowledge.
                            </p>
                            <p className="border-t border-[var(--blueprint-line)] pt-4 text-xs uppercase tracking-wider">
                                This is not about aesthetics first. It is about structure, consequence, and respect for materials.
                            </p>
                        </div>

                        <div className={`${playfair.className} text-xl italic text-center mt-8 pt-6 border-t border-[var(--blueprint-line)]`}>
                            That is why it is called<br />
                            <span className="text-[var(--accent)] font-bold">The Architect's Journey.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== PROTOCOL SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-2">
                        The Protocol
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black font-mono uppercase mb-4">
                        Rules of<br />
                        <span className="text-[var(--accent)]">Engagement</span>
                    </h2>
                    <p className="font-mono text-xs text-[var(--blueprint-text)]/50 mb-16">
                        Document // ROS-PROTOCOL-01
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Planning Committee */}
                        <div className="blueprint-card p-8">
                            <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-2">
                                Planning and Strategy
                            </div>
                            <h3 className="text-2xl font-black font-mono mb-4">
                                The Planning Committee
                            </h3>
                            <p className="text-[var(--accent)] font-mono font-bold mb-6">That's you.</p>

                            <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--blueprint-text)]/70">
                                <p>
                                    You vote on the constraints that make each episode nearly impossible. You decide the conditions that define failure. You set the trap. I execute inside it.
                                </p>
                                <div className="border-l-2 border-[var(--accent)] pl-4 text-[var(--blueprint-text)]">
                                    <p>You define the limits.</p>
                                    <p>I build within them.</p>
                                </div>
                            </div>
                        </div>

                        {/* B.A.R. */}
                        <div className="blueprint-card p-8">
                            <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-2">
                                Judgment Protocol
                            </div>
                            <h3 className="text-2xl font-black font-mono mb-4">
                                The B.A.R.
                            </h3>
                            <p className="text-[var(--accent)] font-mono font-bold mb-6">Board of Aesthetic Review</p>

                            <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--blueprint-text)]/70">
                                <p>
                                    An odd-numbered panel of photographers, printers, designers, and special guests. Their job is not to coddle me and say it's great. Their job is to protect the integrity of the stamp.
                                </p>
                                <p className="text-[var(--blueprint-text)] font-bold">
                                    Every print is judged as an object, not a concept.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* The Verdict */}
                    <div className="mt-12 grid md:grid-cols-2 gap-6">
                        <div className="blueprint-card p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--blueprint-success)]" />
                            <h3 className="text-3xl font-black font-mono uppercase stamped-text mb-4">
                                ✓ Stamped
                            </h3>
                            <p className="font-mono text-sm text-[var(--blueprint-text)]/70">
                                A successful print is approved and archived as a <span className="text-[var(--accent)] font-bold">| Blueprint</span>.
                            </p>
                            <p className="font-mono text-xs mt-4 text-[var(--blueprint-text)]/50">
                                It is a documented build for that paper. It makes the gallery.
                            </p>
                        </div>

                        <div className="blueprint-card p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--blueprint-danger)]" />
                            <h3 className="text-3xl font-black font-mono uppercase ripped-text mb-4">
                                ✗ Ripped
                            </h3>
                            <p className="font-mono text-sm text-[var(--blueprint-text)]/70">
                                A failed print is torn in half on camera, and is classified a <span className="ripped-text font-bold">| Demolition</span>.
                            </p>
                            <p className="font-mono text-xs mt-4 text-[var(--blueprint-text)]/50">
                                Each half is sealed in a labeled Specimen Bag and confined to the Vault.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== GUEST CHALLENGES SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-2">
                        The Stakes Get Higher
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black font-mono uppercase mb-16">
                        Guest<br />
                        <span className="text-[var(--accent)]">Challenges</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 font-mono">
                            <p className="text-base leading-relaxed text-[var(--blueprint-text)]/70">
                                A few times in the series, I'll challenge a guest photographer to beat me at my own game. This is not a friendly competition. It is a confrontation of methods.
                            </p>

                            <div className="blueprint-card p-6 ripped-text">
                                <p className="font-bold text-lg">
                                    If you win, I rip my artwork in half, no matter how good it was. No matter if the judges passed it.
                                </p>
                            </div>

                            <p className="text-base leading-relaxed text-[var(--blueprint-text)]/70">
                                Yours takes its place in the gallery and earns half the commission. This isn't just a guest spot—it's a takeover.
                            </p>

                            <p className="text-[var(--accent)] font-bold text-lg">
                                This raises the bar for everyone.
                            </p>
                        </div>

                        <div className="blueprint-card p-8 text-center">
                            <div className="text-6xl font-black font-mono text-[var(--accent)] mb-4">
                                VS
                            </div>
                            <div className="text-sm font-mono text-[var(--blueprint-text)]/50 uppercase tracking-wider">
                                System Collision
                            </div>
                            <div className="text-xs font-mono text-[var(--blueprint-text)]/30 mt-2">
                                Guest Challenge Contrast<br />
                                Protocol // Confrontation Mode Alpha
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== IMPACT SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-2">
                        The Impact
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-mono uppercase mb-16">
                        Why This <span className="text-[var(--accent)]">Matters.</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                num: '01',
                                title: 'A Defensible Standard',
                                desc: 'Build a standard for museum-grade photography that improves every paid client deliverable.',
                            },
                            {
                                num: '02',
                                title: 'Blueprint Library',
                                desc: 'Create a public Blueprint Library showing which stories belong on which paper, and why.',
                            },
                            {
                                num: '03',
                                title: 'Honest Work',
                                desc: 'Show the real process behind growth, including mistakes, revisions, and hard calls, so other creatives can find their footing too.',
                            },
                            {
                                num: '04',
                                title: 'The Auction',
                                desc: 'When the series ends, the stamped prints will be exhibited and auctioned.',
                            },
                        ].map((item) => (
                            <div key={item.num} className="blueprint-card p-6">
                                <div className="text-3xl font-black font-mono text-[var(--accent)] mb-2">
                                    {item.num}
                                </div>
                                <h3 className="text-xl font-bold font-mono mb-3">{item.title}</h3>
                                <p className="font-mono text-sm text-[var(--blueprint-text)]/70 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className={`${playfair.className} text-xl md:text-2xl italic text-center mt-16 max-w-3xl mx-auto`}>
                        You aren't just watching a series.
                        <br />
                        <span className="text-[var(--accent)]">You're helping build a public record of how this work is done, the right way.</span>
                    </div>
                </div>
            </section>

            {/* ===================== COLLABORATION SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black font-mono uppercase mb-4">
                        The Journey
                    </h2>
                    <h3 className={`${playfair.className} text-3xl md:text-4xl italic text-[var(--accent)] mb-12`}>
                        Is Better With Company.
                    </h3>

                    <div className="max-w-3xl space-y-6 font-mono text-base leading-relaxed text-[var(--blueprint-text)]/80 mb-16">
                        <p>
                            This is an open, living project.
                            <br />A place for people who care about craft, consequence, and making things that last.
                        </p>
                        <p>
                            We're not assembling a team.
                            <br /><span className="text-[var(--accent)]">We're inviting collaborators into the process.</span>
                        </p>
                    </div>

                    {/* Who This Is For */}
                    <div className="mb-16">
                        <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-8">
                            Who This Is For
                        </h4>
                        <div className="space-y-4 font-mono text-base text-[var(--blueprint-text)]/70">
                            <p>Photographers who want to <span className="text-[var(--blueprint-text)]">test their vision</span>, not just execute it.</p>
                            <p>Printers who love materials enough to <span className="text-[var(--blueprint-text)]">see where they break</span>.</p>
                            <p>Designers and thinkers who want their <span className="text-[var(--blueprint-text)]">fingerprints visible</span>, not buried.</p>
                            <p>People who can answer honestly, even when the answer is <span className="ripped-text font-bold">"rip."</span></p>
                        </div>
                    </div>

                    {/* What You Take With You */}
                    <div>
                        <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-8">
                            What You Take With You
                        </h4>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="blueprint-card p-6">
                                <h5 className="font-mono font-bold text-[var(--accent)] text-lg mb-3">Recognition</h5>
                                <p className="font-mono text-sm text-[var(--blueprint-text)]/70 leading-relaxed">
                                    Your name lives on the episode. Permanently.
                                </p>
                            </div>
                            <div className="blueprint-card p-6">
                                <h5 className="font-mono font-bold text-[var(--accent)] text-lg mb-3">Access</h5>
                                <p className="font-mono text-sm text-[var(--blueprint-text)]/70 leading-relaxed">
                                    Blueprints, reports, and discoveries. Nothing held back.
                                </p>
                            </div>
                            <div className="blueprint-card p-6">
                                <h5 className="font-mono font-bold text-[var(--accent)] text-lg mb-3">Legacy</h5>
                                <p className="font-mono text-sm text-[var(--blueprint-text)]/70 leading-relaxed">
                                    A documented paper trail of the work you helped shape.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== 7 CHAPTERS SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--blueprint-text)]/50 mb-2">
                        System Protocol
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-mono uppercase mb-6">
                        The <span className="text-[var(--accent)]">7 Chapters</span>
                    </h2>
                    <p className="font-mono text-sm text-[var(--blueprint-text)]/70 mb-16">
                        Every episode follows the same ritual. Predictable. High Stakes. Structural.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { num: '01', title: 'The Planning Committee', desc: 'The constraint is set. The trap is laid.' },
                            { num: '02', title: 'Research & Advice', desc: 'The paper is analyzed like an architectural material.' },
                            { num: '03', title: 'Groundbreaking', desc: 'The shoot happens under real-world physical limits.' },
                            { num: '04', title: 'Structural Analysis', desc: 'Editing for the material, not the screen.' },
                            { num: '05', title: 'The B.A.R. Review', desc: 'Pre-print critique and structural failure prediction.' },
                            { num: '06', title: 'Final Inspection', desc: 'The physical reveal. The first object emerges.' },
                            { num: '07', title: 'The Verdict', desc: 'Stamped or Ripped. Archive or Demolition.' },
                        ].map((chapter) => (
                            <div key={chapter.num} className="flex gap-6 items-start p-4">
                                <div className="text-4xl font-black font-mono text-[var(--accent)] opacity-50">
                                    {chapter.num}
                                </div>
                                <div>
                                    <h3 className="font-mono font-bold text-lg mb-1">{chapter.title}</h3>
                                    <p className="font-mono text-sm text-[var(--blueprint-text)]/70">{chapter.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 grid md:grid-cols-2 gap-6">
                        <div className="blueprint-card p-6">
                            <h3 className="font-mono font-bold stamped-text mb-3">Blueprint (Success)</h3>
                            <p className="font-mono text-sm text-[var(--blueprint-text)]/70">
                                A documented recipe showing the lighting intent, capture decisions, editing approach, print settings, and failure warnings for that specific paper.
                            </p>
                        </div>
                        <div className="blueprint-card p-6">
                            <h3 className="font-mono font-bold ripped-text mb-3">Demolition (Failure)</h3>
                            <p className="font-mono text-sm text-[var(--blueprint-text)]/70">
                                Archived evidence that protects the integrity of the stamp and teaches what doesn't work.
                            </p>
                        </div>
                    </div>

                    <p className={`${playfair.className} text-xl italic text-center mt-12`}>
                        Mastery is not an accident. It's a calculated survival of the physics.
                    </p>
                </div>
            </section>

            {/* ===================== FINAL CTA SECTION ===================== */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-7xl font-black font-mono uppercase mb-16">
                        Join The <span className="text-[var(--accent)]">Fight.</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <Link
                            href="https://discord.gg/sharpsighted"
                            className="blueprint-card p-6 hover:border-[var(--accent)] transition-colors group"
                        >
                            <h3 className="font-mono font-bold text-[var(--accent)] mb-2">Join the Discord</h3>
                            <p className="font-mono text-xs text-[var(--blueprint-text)]/50 mb-4">Access the Engine Room</p>
                            <div className="font-mono text-sm group-hover:text-[var(--accent)] transition-colors">
                                Enter Server →
                            </div>
                        </Link>

                        <Link
                            href="/challenges"
                            className="blueprint-card p-6 hover:border-[var(--accent)] transition-colors group"
                        >
                            <h3 className="font-mono font-bold text-[var(--accent)] mb-2">Read the First Blueprint</h3>
                            <p className="font-mono text-xs text-[var(--blueprint-text)]/50 mb-4">"Welcome to Ripped or Stamped"</p>
                            <div className="font-mono text-sm group-hover:text-[var(--accent)] transition-colors">
                                Read Document →
                            </div>
                        </Link>

                        <Link
                            href="/signup"
                            className="blueprint-card p-6 hover:border-[var(--accent)] transition-colors group"
                        >
                            <h3 className="font-mono font-bold text-[var(--accent)] mb-2">Apply to Join the Crew</h3>
                            <p className="font-mono text-xs text-[var(--blueprint-text)]/50 mb-4">Photographers, Printers, Creators Welcome</p>
                            <div className="font-mono text-sm group-hover:text-[var(--accent)] transition-colors">
                                Start Application →
                            </div>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <p className={`${playfair.className} text-2xl italic`}>
                            You're welcome to watch me sweat.
                        </p>
                        <p className={`${playfair.className} text-2xl italic text-[var(--accent)]`}>
                            You're even more welcome to make me.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
