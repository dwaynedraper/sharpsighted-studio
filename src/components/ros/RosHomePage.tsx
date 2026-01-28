export function RosHomePage() {
    return (
        <div className="min-h-screen bg-[var(--blueprint-bg)] text-[var(--blueprint-text)]">
            {/* Hero Section - Inspired by uploaded layout */}
            <section className="relative min-h-screen flex items-center justify-center blueprint-grid">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="h-full w-full grid grid-cols-20 grid-rows-20">
                        {Array.from({ length: 400 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-[var(--blueprint-line)]" />
                        ))}
                    </div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
                    {/* Small label at top */}
                    <div className="inline-block border blueprint-border-accent rounded-blueprint-sm px-4 py-2 mb-12 bg-[var(--blueprint-bg)]">
                        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent)]">
                            Ripped or Stamped: The Architect's Journey
                        </p>
                    </div>

                    {/* Big declaration with accent highlights */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tight leading-[1.1] mb-8">
                        I RECRUITED A{' '}
                        <span className="text-[var(--accent)]">FIRING SQUAD,</span>
                        <br />
                        NOT A PRODUCTION TEAM.
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl italic text-[var(--blueprint-text)]/80 mb-12 font-sans">
                        A crew of creatives with one target: me.
                    </p>

                    {/* Body copy */}
                    <div className="max-w-3xl space-y-4 text-base md:text-lg leading-relaxed font-mono text-[var(--blueprint-text)]/70">
                        <p>
                            Every episode, I'm pushed to the breaking point by photography challenges designed to stretch my skills to their limit. I take the world's most prestigious and notoriously difficult papers and push them to their extreme edge, printing images that could only exist on that one surface.
                        </p>
                    </div>
                </div>
            </section>

            {/* Binary Outcome Section */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* STAMPED */}
                        <div className="blueprint-card p-12 relative overflow-hidden">
                            {/* Subtle top accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--blueprint-success)]" />

                            <div className="mt-4">
                                <div className="text-8xl font-black font-mono mb-6 stamped-text">
                                    ✓
                                </div>
                                <h2 className="text-4xl font-black font-mono mb-4 uppercase stamped-text">
                                    Stamped
                                </h2>
                                <div className="h-px bg-[var(--blueprint-success)]/30 mb-6" />
                                <p className="font-mono text-sm leading-relaxed text-[var(--blueprint-text)]">
                                    Beautiful work survives.<br />
                                    Archived. Celebrated.<br />
                                    A permanent record of excellence.
                                </p>
                            </div>
                        </div>

                        {/* RIPPED */}
                        <div className="blueprint-card p-12 relative overflow-hidden">
                            {/* Subtle top accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--blueprint-danger)]" />

                            <div className="mt-4">
                                <div className="text-8xl font-black font-mono mb-6 ripped-text">
                                    ✗
                                </div>
                                <h2 className="text-4xl font-black font-mono mb-4 uppercase ripped-text">
                                    Ripped
                                </h2>
                                <div className="h-px bg-[var(--blueprint-danger)]/30 mb-6" />
                                <p className="font-mono text-sm leading-relaxed text-[var(--blueprint-text)]">
                                    Weak work gets destroyed.<br />
                                    On camera. Publicly.<br />
                                    Accountability for lazy execution.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data display */}
                    <div className="mt-12 blueprint-card p-8">
                        <div className="grid grid-cols-3 gap-8 text-center font-mono">
                            <div>
                                <div className="text-4xl font-black text-[var(--accent)]">01</div>
                                <div className="text-xs uppercase tracking-wider mt-2">Episode</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black stamped-text">00</div>
                                <div className="text-xs uppercase tracking-wider mt-2">Stamped</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black ripped-text">00</div>
                                <div className="text-xs uppercase tracking-wider mt-2">Ripped</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stakes Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="blueprint-card p-12 ros-glow">
                        <h2 className="text-3xl font-black font-mono uppercase mb-8 text-center">
                            How It Works
                        </h2>

                        <div className="space-y-6 font-mono text-sm leading-loose">
                            <div className="flex gap-4">
                                <span className="text-[var(--accent)] font-bold">01.</span>
                                <p>Each episode culminates in a single physical print.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[var(--accent)] font-bold">02.</span>
                                <p>The work is evaluated by the collective. No revisions allowed.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[var(--accent)] font-bold">03.</span>
                                <p>If it holds up: <span className="stamped-text font-bold">STAMPED</span> and archived.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[var(--accent)] font-bold">04.</span>
                                <p>If it fails: <span className="ripped-text font-bold">RIPPED</span> apart on camera.</p>
                            </div>
                        </div>

                        <div className="mt-12 p-6 border blueprint-border rounded-blueprint-sm bg-[var(--blueprint-line)]/20">
                            <p className="font-mono text-xs uppercase tracking-wider text-center">
                                The act of destruction is not spectacle.<br />
                                It is accountability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 border-t border-[var(--blueprint-line)]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-5xl font-black font-mono uppercase mb-6">
                        Join The Standard
                    </h2>
                    <p className="font-mono text-lg mb-12 leading-relaxed">
                        Photographers who are ready to evaluate their work honestly.<br />
                        No comfort. No compromise. Only conviction.
                    </p>
                    <button className="rounded-blueprint px-12 py-4 bg-[var(--accent)] text-white font-bold font-mono uppercase tracking-wider hover:ros-glow-strong transition-all duration-200 border border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--blueprint-bg)]">
                        View Current Challenge
                    </button>
                </div>
            </section>
        </div>
    );
}
