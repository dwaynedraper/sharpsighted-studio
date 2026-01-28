'use client';

import { motion } from 'framer-motion';
import { Camera, Sparkles, Users, TrendingUp } from 'lucide-react';

export function MainHomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-sky-50 to-pink-50 dark:from-neutral-900 dark:via-neutral-900/95 dark:to-neutral-900">
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--brand-blue)]/20 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--cerise)]/20 blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <Camera className="w-16 h-16 mx-auto text-[var(--brand-blue)] glow-blue" strokeWidth={1.5} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold font-[var(--font-display)] tracking-tight mb-6 gradient-text"
                    >
                        Sharp Sighted Studio
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 font-light max-w-2xl mx-auto mb-10"
                    >
                        Premium photography and creative collective
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--brand-blue)] to-[var(--cerise)] text-white font-semibold glow-mixed hover:glow-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:ring-offset-2">
                            Explore Work
                        </button>
                        <button className="px-8 py-4 rounded-xl border-2 border-[var(--brand-blue)] text-[var(--brand-blue)] font-semibold hover:bg-[var(--brand-blue)]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:ring-offset-2">
                            Join Collective
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 bg-white dark:bg-neutral-900">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold font-[var(--font-display)] mb-4 gradient-text">
                            What We Do
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Excellence in photography meets community collaboration
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Camera,
                                title: 'Premium Work',
                                description: 'World-class photography services',
                                color: 'blue',
                            },
                            {
                                icon: Users,
                                title: 'The Collective',
                                description: 'Join a community of creatives',
                                color: 'pink',
                            },
                            {
                                icon: TrendingUp,
                                title: '10% Rule',
                                description: 'Invest in your growth',
                                color: 'blue',
                            },
                            {
                                icon: Sparkles,
                                title: 'RoS',
                                description: 'Consequence-driven standard',
                                color: 'pink',
                            },
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group p-6 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-transparent hover:glow-blue transition-all duration-300"
                                >
                                    <div className={`mb-4 ${feature.color === 'blue' ? 'text-[var(--brand-blue)]' : 'text-[var(--cerise)]'} group-hover:glow-blue transition-all`}>
                                        <Icon className="w-10 h-10" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-bold font-[var(--font-display)] mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 px-4 bg-gradient-to-br from-[var(--brand-blue)]/10 via-white to-[var(--cerise)]/10 dark:from-[var(--brand-blue)]/5 dark:via-neutral-900 dark:to-[var(--cerise)]/5">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold font-[var(--font-display)] mb-6 gradient-text"
                    >
                        Ready to Create?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-neutral-600 dark:text-neutral-300 mb-10"
                    >
                        Get in touch to discuss your project or join our creative collective
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="px-10 py-5 rounded-xl bg-gradient-to-r from-[var(--brand-blue)] to-[var(--cerise)] text-white text-lg font-bold glow-mixed hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:ring-offset-2"
                    >
                        Get Started
                    </motion.button>
                </div>
            </section>
        </div>
    );
}
