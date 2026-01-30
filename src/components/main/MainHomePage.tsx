'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function MainHomePage() {
    return (
        <main className="min-h-screen pb-16 font-mono text-foreground transition-colors duration-300 selection:bg-[#38bdf8] selection:text-background">
            {/* HERO SECTION */}
            <section className="relative h-screen flex items-center justify-center mb-32 overflow-hidden">
                {/* Fixed Background Layer */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Image
                        src="https://res.cloudinary.com/dyijp1zno/image/upload/v1769450949/Real%20Estate/obscura-odessey--jYPVUm16BY-unsplash_wqkqiv.jpg"
                        alt="DFW Skyline Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40 z-20" />
                </div>

                <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center pt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tighter text-white mb-12 leading-[0.9]"
                    >
                        You're welcome here.
                    </motion.h1>

                    <div className="space-y-4 text-xl md:text-2xl font-serif text-white/90 leading-relaxed font-light mb-12 border-l-2 border-[#38bdf8] pl-6 text-left inline-block">
                        <p>This is where stories are made in the open.</p>
                        <p>Where learning happens by doing.</p>
                        <p>Where you can pick up a camera and join us for the day.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
                        <Link
                            href="/tutorials"
                            className="group relative px-8 py-4 bg-[#38bdf8] text-black font-bold uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Learning <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                        <Link
                            href="/blog"
                            className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                        >
                            Read Transmission
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
            </section>

            {/* CONTENT AREA */}
            <div className="relative bg-background">
                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center py-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* WHAT THIS PLACE IS */}
                <section className="container mx-auto px-4 mb-32 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Visual Column */}
                        <div className="relative aspect-[4/5] overflow-hidden md:mt-12 bg-neutral-800 rounded-sm">
                            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
                                [Community Meeting]
                            </div>
                        </div>

                        {/* Content Column */}
                        <div>
                            <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-8">What This Place Is</div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">You're welcome to become part of it.</h2>

                            <div className="space-y-6 font-mono opacity-80 leading-relaxed text-sm md:text-base">
                                <p className="mb-6">
                                    <strong className="text-foreground">Sharp Sighted Studio</strong> is a DFW-based content creation collective.
                                    Built by photographers who believe the work gets better when it's made together.
                                </p>
                                <p className="mb-3">
                                    This is not a portfolio mill.
                                </p>
                                <p className="mb-6">
                                    This is not a class you buy into.
                                </p>
                                <p className="text-[#38bdf8] uppercase tracking-widest font-bold text-xs pt-4 border-t border-border mb-6">
                                    // It is an open invitation.
                                </p>

                                <ul className="space-y-3 pt-6 mb-8">
                                    {["We meet in real spaces.", "We shoot in small groups.", "We trade perspectives.", "We learn by doing."].map(item => (
                                        <li key={item} className="flex gap-3 items-center">
                                            <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="pt-6 font-serif text-xl italic opacity-100 border-l-2 border-foreground pl-4 mb-0">
                                    If you want to see through someone else's eyes for a day, you're welcome to join us.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-surface glow-blue hover:glow-blue text-foreground font-semibold text-sm uppercase tracking-wide transition-all">
                                    Read the Latest Article
                                </button>
                                <button className="px-6 py-3 bg-surface glow-pink hover:glow-pink text-foreground font-semibold text-sm uppercase tracking-wide transition-all">
                                    Join the Discord
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* REAL WORLD ENVIRONMENT */}
                <section className="container mx-auto px-4 mb-32 max-w-3xl text-center">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-60 mb-8 font-bold text-[#38bdf8]">This happens in the real world</div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10">This is not an online-only community.</h2>

                    <div className="space-y-8 font-mono opacity-90 leading-relaxed text-lg">
                        <p>We head out into homes, neighborhoods, and overlooked spaces across DFW.</p>
                        <p>We shoot together, talk through decisions, and share what we see in real time.</p>
                        <p>You do not need to be an expert.</p>
                        <p>You do not need a massive following.</p>
                        <p className="text-3xl font-serif italic text-foreground">
                            Curiosity is enough.
                        </p>
                        <p className="text-sm uppercase tracking-widest opacity-60">
                            New people are always welcome. Even for one episode.
                        </p>
                        <p className="text-sm uppercase tracking-widest">
                            <span className="text-[#38bdf8] font-bold border-b border-[#38bdf8]">Especially for one episode.</span>
                        </p>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* RIPPED OR STAMPED */}
                <section className="container mx-auto px-4 mb-32 max-w-3xl">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-8">Ripped or Stamped</div>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold mb-12 tracking-tight">
                        You're welcome to <br />
                        <span className="text-[#38bdf8]">watch me sweat.</span>
                    </h2>

                    <div className="space-y-8 font-mono text-lg leading-relaxed">
                        <div className="space-y-2 border-l-2 border-[#38bdf8]/30 pl-6 py-2">
                            <p>
                                <strong className="text-[#38bdf8] font-bold uppercase tracking-wider">Ripped or Stamped</strong> is a high-stakes print challenge.
                            </p>
                            <ul className="space-y-1 opacity-80 text-base">
                                <li>You help choose the paper.</li>
                                <li>I commit to the image.</li>
                                <li>We print it live.</li>
                            </ul>
                        </div>

                        <p className="text-4xl md:text-5xl font-bold font-serif uppercase tracking-tighter">
                            IF IT FAILS, <span className="text-[#38bdf8]">IT GETS RIPPED.</span>
                        </p>

                        <div className="space-y-6 opacity-80 text-base">
                            <p>If you join for Ripped or Stamped, you become part of the crew.</p>
                            <p>You get a front-row seat to the pressure, the mistakes, and the struggle.</p>

                            <div className="border-l-4 border-[#38bdf8] pl-6 py-4 bg-foreground/5 italic font-serif text-lg space-y-4 glow-blue">
                                <p>I need a few masochists.</p>
                                <p>People who will answer honestly.</p>
                                <p>Even if the honest answer means it's a rip.</p>
                            </div>

                            <p className="font-serif italic text-xl opacity-100">Not hateful. Just sharp enough to keep it real.</p>
                            <p className="font-serif italic text-xl opacity-100">That tension is the show.</p>
                        </div>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* WHAT WE MAKE HERE */}
                <section className="container mx-auto px-4 mb-32 max-w-5xl">
                    <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-8 text-center">What We Make Here</div>
                    <p className="font-serif text-2xl italic mb-8 text-center">This studio exists to:</p>

                    <ul className="space-y-6 font-mono text-sm uppercase tracking-wide opacity-90 max-w-3xl mx-auto">
                        <li className="flex gap-4 items-start">
                            <span className="text-[#38bdf8] text-lg leading-none">•</span>
                            <span>Teach people how cameras actually work, not just how to buy presets.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="text-[#38bdf8] text-lg leading-none">•</span>
                            <span>Explore incredible DFW spaces that most people walk past.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="text-[#38bdf8] text-lg leading-none">•</span>
                            <span>Show the struggle of making an image, not just the polished result.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <span className="text-[#38bdf8] text-lg leading-none">•</span>
                            <span>Create honest, story-first media that lasts longer than a scroll.</span>
                        </li>
                    </ul>

                    <div className="mt-12 p-6 border-l-2 border-[#38bdf8]/50 bg-surface/50 max-w-3xl mx-auto">
                        <p className="text-lg font-serif font-bold mb-2">No AI filler. No fake polish.</p>
                        <p className="font-mono text-[#38bdf8] uppercase tracking-widest text-xs">Just tools, spaces, and people.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
                        <div className="aspect-square bg-surface glow-blue rounded-sm flex items-center justify-center text-foreground/40 text-xs text-center p-4">
                            Camera Gear
                        </div>
                        <div className="aspect-square bg-surface glow-blue rounded-sm flex items-center justify-center text-foreground/40 text-xs text-center p-4">
                            Studio Space
                        </div>
                        <div className="aspect-square bg-surface glow-blue rounded-sm flex items-center justify-center text-foreground/40 text-xs text-center p-4">
                            Community
                        </div>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* COMMUNITY & EPISODES */}
                <section className="container mx-auto px-4 mb-32 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div className="relative">
                            <div className="relative aspect-video bg-surface glow-pink rounded-sm">
                                <div className="w-full h-full flex items-center justify-center text-foreground/40 text-sm">
                                    [Gallery Wall]
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-6">The Community</div>
                                <h3 className="text-2xl font-serif font-bold mb-4">Participate at your own pace.</h3>
                                <p className="font-mono opacity-70 mb-6 text-sm">
                                    Watch quietly. Join a shoot. Ask questions. Offer critique.
                                </p>
                                <p className="font-mono opacity-70 text-sm">
                                    We host a public forum page where members can share work, ideas, and in-progress thoughts. It is not an ad wall.
                                </p>
                            </div>
                        </div>

                        <div className="relative mt-12 md:mt-0">
                            <div className="relative aspect-video bg-surface glow-blue rounded-sm">
                                <div className="w-full h-full flex items-center justify-center text-foreground/40 text-sm">
                                    [Episode Page]
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-6">Episodes & Recognition</div>
                                <h3 className="text-2xl font-serif font-bold mb-4">Recognition, not noise.</h3>
                                <p className="font-mono opacity-70 mb-6 text-sm">
                                    Every episode has its own page. Full credit for everyone involved. A clear paper trail.
                                </p>
                                <p className="font-mono italic text-sm border-l-2 border-[#38bdf8] pl-4">
                                    If someone discovers you through this project and becomes a client, great. If not, you still leave with something real.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* WHY THIS EXISTS */}
                <section className="container mx-auto px-4 mb-32 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-sm order-2 md:order-1 bg-surface glow-blue">
                            <div className="w-full h-full flex items-center justify-center text-foreground/40 text-sm">
                                [Founder Portrait]
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-8">Why This Exists</div>
                            <h2 className="text-4xl font-serif font-bold mb-8">Most media is made alone. That isolation shows.</h2>

                            <div className="bg-surface glow-blue p-8 mb-12 relative">
                                <p className="font-serif italic text-lg mb-6 leading-relaxed relative z-10">
                                    "I built this because I wanted a place where photographers could work together without posturing. A place where you can struggle out loud, be honest about what you do not know, and still make serious, high-quality work."
                                </p>
                                <div className="font-mono text-xs uppercase tracking-widest text-[#38bdf8] relative z-10">
                                    // Dean Draper, Founder
                                </div>
                            </div>

                            <p className="text-xl font-serif">
                                If that sounds like your kind of environment, you're welcome here.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* 10% RULE */}
                <section className="container mx-auto px-4 mb-32 max-w-3xl text-center">
                    <div className="inline-block glow-pink px-6 py-3 bg-surface">
                        <h3 className="text-sm font-bold font-mono uppercase tracking-widest mb-2 text-[#38bdf8]">The 10% Rule</h3>
                        <div className="space-y-2">
                            <p className="font-serif text-lg opacity-80">We dedicate 10% of studio time to work that builds people and community.</p>
                            <p className="font-serif text-lg opacity-80">No transactions. Just intention.</p>
                        </div>
                    </div>
                </section>

                {/* SEPARATOR */}
                <div className="container mx-auto px-4 max-w-3xl flex justify-center mb-32 opacity-20">
                    <div className="w-full h-px bg-foreground" />
                </div>

                {/* FINAL CTA */}
                <section className="container mx-auto px-4 mb-16 max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">
                        Stay Sharp. Stay Seen. Stay Human.
                    </h2>
                    <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest opacity-40">
                        <span>© 2026 Sharp Sighted Studio</span>
                        <span>System Active</span>
                    </div>
                </section>
            </div>
        </main>
    );
}
