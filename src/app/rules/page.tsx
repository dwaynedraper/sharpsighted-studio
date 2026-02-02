export default function RulesPage() {
    return (
        <div className="min-h-screen bg-[var(--blueprint-bg)]">
            {/* Hero Header */}
            <header className="relative py-20 px-6 text-center border-b border-[var(--blueprint-line)]">
                <span className="inline-block px-4 py-2 bg-[var(--accent)]/20 text-[var(--accent)] font-mono font-bold text-xs uppercase tracking-wider rounded mb-6">
                    THE PROTOCOL
                </span>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--blueprint-text)]">
                    THE RULES
                </h1>
                <p className="mt-4 text-lg text-[var(--blueprint-muted)] max-w-2xl mx-auto font-mono">
                    Non-negotiable standards. Zero exceptions.
                </p>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
                {/* Section 01: The Interrogation */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-[var(--accent)] opacity-60">SECTION 01 //</span>
                        <h2 className="text-2xl font-black text-[var(--blueprint-text)] uppercase tracking-wide">
                            The BAR Review
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <p className="text-xl text-[var(--blueprint-text)] font-mono">
                            THE THREE PILLARS
                        </p>
                        <p className="text-[var(--blueprint-muted)] max-w-3xl leading-relaxed">
                            To earn the Blueprint Stamp, every print is reviewed across three non-negotiable pillars:
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Pillar 01 */}
                        <div className="p-6 border-2 border-[var(--blueprint-line)] rounded-xl hover:border-[var(--accent)]/50 transition-colors">
                            <span className="text-sm font-mono text-[var(--accent)]">01 //</span>
                            <h3 className="mt-2 text-lg font-bold text-[var(--blueprint-text)]">
                                Structural Integrity
                            </h3>
                            <div className="mt-4 text-sm text-[var(--blueprint-muted)] leading-relaxed space-y-3">
                                <p className="text-[var(--blueprint-text)] font-medium">The object must be flawless.</p>
                                <p>No scratches. No banding. No pooling.<br />
                                    If the print fails physically, it is destroyed.</p>
                                <p className="text-red-400 font-bold">There is no appeal.</p>
                            </div>
                        </div>

                        {/* Pillar 02 */}
                        <div className="p-6 border-2 border-[var(--blueprint-line)] rounded-xl hover:border-[var(--accent)]/50 transition-colors">
                            <span className="text-sm font-mono text-[var(--accent)]">02 //</span>
                            <h3 className="mt-2 text-lg font-bold text-[var(--blueprint-text)]">
                                The Mandates
                            </h3>
                            <div className="mt-4 text-sm text-[var(--blueprint-muted)] leading-relaxed space-y-3">
                                <p className="text-[var(--blueprint-text)] font-medium">Did the work honor the chosen constraints?</p>
                                <p>The image is judged against two mandates.<br />
                                    One pushes the paper's limits.<br />
                                    One tests my photography skills.</p>
                                <p>Passing them is not about punishment.<br />
                                    It is about <span className="text-[var(--accent)] font-bold">discipline</span>.</p>
                            </div>
                        </div>

                        {/* Pillar 03 */}
                        <div className="p-6 border-2 border-[var(--blueprint-line)] rounded-xl hover:border-[var(--accent)]/50 transition-colors">
                            <span className="text-sm font-mono text-[var(--accent)]">03 //</span>
                            <h3 className="mt-2 text-lg font-bold text-[var(--blueprint-text)]">
                                Exhibition Worthiness
                            </h3>
                            <div className="mt-4 text-sm text-[var(--blueprint-muted)] leading-relaxed space-y-3">
                                <p className="text-[var(--blueprint-text)] font-medium">Does this deserve a gallery wall?</p>
                                <p>Technical success is not enough.<br />
                                    The image must carry meaning, restraint, and intent.</p>
                                <p>If it is hollow, <span className="text-red-400 font-bold">it does not stand</span>.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 02: The Verdict Logic */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-[var(--accent)] opacity-60">SECTION 02 //</span>
                        <h2 className="text-2xl font-black text-[var(--blueprint-text)] uppercase tracking-wide">
                            The Law of the Studio
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <p className="text-xl text-[var(--blueprint-text)] font-mono">
                            THE VERDICT LOGIC
                        </p>
                        <p className="text-[var(--blueprint-muted)] max-w-3xl leading-relaxed">
                            The final outcome is binary. There is no middle ground.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* 3/3 Pillars */}
                        <div className="p-6 border-2 border-green-500/40 rounded-xl bg-green-500/5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-2xl font-black text-green-400 font-mono">3/3 PILLARS</span>
                                    <p className="mt-2 text-[var(--blueprint-muted)]">
                                        The ultimate victory. The print survives.
                                    </p>
                                </div>
                                <span className="px-6 py-3 bg-green-500 text-white font-black font-mono text-lg rounded-lg whitespace-nowrap">
                                    VERDICT: STAMPED
                                </span>
                            </div>
                        </div>

                        {/* 2/3 Pillars */}
                        <div className="p-6 border-2 border-yellow-500/40 rounded-xl bg-yellow-500/5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-2xl font-black text-yellow-400 font-mono">2/3 PILLARS</span>
                                    <p className="mt-2 text-[var(--blueprint-muted)]">
                                        The Judge's Domain. Technical win, but artistic struggle (or vice versa).
                                    </p>
                                </div>
                                <span className="px-6 py-3 bg-yellow-500/20 text-yellow-400 font-black font-mono text-lg rounded-lg border border-yellow-500/40 whitespace-nowrap">
                                    JUDGE'S CALL
                                </span>
                            </div>
                        </div>

                        {/* 0-1/3 Pillars */}
                        <div className="p-6 border-2 border-red-500/40 rounded-xl bg-red-500/5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-2xl font-black text-red-400 font-mono">0/3 or 1/3 PILLARS</span>
                                    <p className="mt-2 text-[var(--blueprint-muted)]">
                                        Total failure.
                                    </p>
                                </div>
                                <span className="px-6 py-3 bg-red-500 text-white font-black font-mono text-lg rounded-lg whitespace-nowrap">
                                    VERDICT: RIP
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 03: The Ritual */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-[var(--accent)] opacity-60">SECTION 03 //</span>
                        <h2 className="text-2xl font-black text-[var(--blueprint-text)] uppercase tracking-wide">
                            The Seven Chapters
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <p className="text-xl text-[var(--blueprint-text)] font-mono">
                            THE RITUAL
                        </p>
                        <p className="text-[var(--blueprint-muted)] max-w-3xl leading-relaxed">
                            Every episode follows a strict, repeatable blueprint to ensure the standard is never faked:
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                num: '01',
                                title: 'The Planning Committee',
                                desc: 'The audience picks the antagonist (the paper) and sets the trap.',
                            },
                            {
                                num: '02',
                                title: 'Research & Advice',
                                desc: "We study the paper's 'Nightmare' characteristics.",
                            },
                            {
                                num: '03',
                                title: 'Groundbreaking',
                                desc: 'The shoot. No subject choice. No location choice. Only the rules you set.',
                            },
                            {
                                num: '04',
                                title: 'Structural Analysis',
                                desc: 'Editing for the physical paper, not for the screen.',
                            },
                            {
                                num: '05',
                                title: 'The Review',
                                desc: 'A 15-member firing squad critiques the plan.',
                            },
                            {
                                num: '06',
                                title: 'Final Inspection',
                                desc: 'The physical reveal under real gallery lighting.',
                            },
                            {
                                num: '07',
                                title: 'The Verdict',
                                desc: 'Stamped for the gallery, or Ripped and sealed as a specimen.',
                            },
                        ].map((step, i) => (
                            <div
                                key={step.num}
                                className={`p-6 border-2 border-[var(--blueprint-line)] rounded-xl hover:border-[var(--accent)]/50 transition-all hover:scale-[1.02] ${i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--accent)]/20 text-[var(--accent)] font-mono font-bold text-sm rounded-lg">
                                        {step.num}
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-mono text-[var(--accent)] opacity-60 mb-1">
                                            {step.num} //
                                        </h3>
                                        <h4 className="text-lg font-bold text-[var(--blueprint-text)]">
                                            {step.title}
                                        </h4>
                                        <p className="mt-2 text-sm text-[var(--blueprint-muted)] leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <div className="pt-12 border-t border-[var(--blueprint-line)] text-center">
                    <p className="text-sm text-[var(--blueprint-muted)] font-mono">
                        THE STANDARD IS NON-NEGOTIABLE.
                    </p>
                </div>
            </main>
        </div>
    );
}
