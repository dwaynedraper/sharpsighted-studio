'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PaperInput {
    name: string;
    weight: string;
    textureRef: string;
    inspirationRef: string;
}

const emptyPaper: PaperInput = {
    name: '',
    weight: '',
    textureRef: '',
    inspirationRef: '',
};

export default function NewEpisodePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [episodeNumber, setEpisodeNumber] = useState<number>(1);
    const [operationTitle, setOperationTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [pollUrl, setPollUrl] = useState('');
    const [hook, setHook] = useState('');
    const [papers, setPapers] = useState<PaperInput[]>([
        { ...emptyPaper },
        { ...emptyPaper },
        { ...emptyPaper },
    ]);

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superAdmin';

    if (status === 'loading') {
        return (
            <div className="p-8 animate-pulse">
                <div className="h-8 bg-[var(--blueprint-line)] rounded w-1/3 mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-[var(--blueprint-line)] rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        router.push('/unauthorized');
        return null;
    }

    const updatePaper = (index: number, field: keyof PaperInput, value: string) => {
        const updated = [...papers];
        updated[index] = { ...updated[index], [field]: value };
        setPapers(updated);
    };

    const addPaper = () => {
        setPapers([...papers, { ...emptyPaper }]);
    };

    const removePaper = (index: number) => {
        if (papers.length <= 2) return; // Minimum 2 papers
        setPapers(papers.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        // Validate papers
        const validPapers = papers.filter(
            (p) => p.name.trim() && p.weight.trim() && p.textureRef.trim() && p.inspirationRef.trim()
        );

        if (validPapers.length < 2) {
            setError('At least 2 complete paper options are required');
            setSaving(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/episodes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    episodeNumber,
                    operationTitle,
                    slug: slug || operationTitle
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and dashes
                        .replace(/\s+/g, '-')          // Replace spaces with dashes
                        .replace(/-+/g, '-')           // Collapse multiple dashes
                        .replace(/^-|-$/g, ''),        // Trim leading/trailing dashes
                    pollUrl: pollUrl || null,
                    hook,
                    papers: validPapers,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create episode');
            }

            const { episode } = await res.json();
            router.push(`/dashboard/content/episodes/${episode._id}`);
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-black font-mono text-[var(--blueprint-text)] mb-8">
                CREATE PAPER VOTE
            </h1>

            {error && (
                <div className="p-4 mb-6 border border-red-500 rounded-lg bg-red-500/10">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Meta Data Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">META DATA</h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                Episode #
                            </label>
                            <input
                                type="number"
                                value={episodeNumber}
                                onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                                required
                                className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded font-mono"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                Operation Title
                            </label>
                            <input
                                type="text"
                                value={operationTitle}
                                onChange={(e) => setOperationTitle(e.target.value)}
                                placeholder="Battlefield: Texture"
                                required
                                className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="battlefield-texture (auto-generated if blank)"
                                className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                                Poll URL
                            </label>
                            <input
                                type="url"
                                value={pollUrl}
                                onChange={(e) => setPollUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-mono uppercase text-[var(--blueprint-muted)] mb-2">
                            Hook (one liner)
                        </label>
                        <input
                            type="text"
                            value={hook}
                            onChange={(e) => setHook(e.target.value)}
                            placeholder="The hook line..."
                            required
                            className="w-full px-4 py-3 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded"
                        />
                    </div>
                </section>

                {/* Papers Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold font-mono uppercase text-[var(--accent)]">
                            PAPER OPTIONS
                        </h2>
                        <button
                            type="button"
                            onClick={addPaper}
                            className="px-3 py-1 border border-[var(--accent)] text-[var(--accent)] rounded hover:bg-[var(--accent)]/10 text-sm font-mono"
                        >
                            + ADD PAPER
                        </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {papers.map((paper, index) => (
                            <div
                                key={index}
                                className="p-4 border border-[var(--blueprint-line)] rounded-lg space-y-3 relative"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono text-[var(--accent)]">
                                        PAPER {String.fromCharCode(65 + index)}
                                    </span>
                                    {papers.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removePaper(index)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={paper.name}
                                    onChange={(e) => updatePaper(index, 'name', e.target.value)}
                                    placeholder="Paper Name"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={paper.weight}
                                    onChange={(e) => updatePaper(index, 'weight', e.target.value)}
                                    placeholder="Weight (GSM)"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={paper.textureRef}
                                    onChange={(e) => updatePaper(index, 'textureRef', e.target.value)}
                                    placeholder="Texture Ref"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                                <input
                                    type="text"
                                    value={paper.inspirationRef}
                                    onChange={(e) => updatePaper(index, 'inspirationRef', e.target.value)}
                                    placeholder="Inspiration Ref"
                                    className="w-full px-3 py-2 bg-[var(--blueprint-bg)] border border-[var(--blueprint-line)] rounded text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-[var(--blueprint-line)] text-[var(--blueprint-muted)] rounded hover:border-white"
                    >
                        CANCEL
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[var(--accent)] text-white font-bold uppercase rounded hover:opacity-90 disabled:opacity-40"
                    >
                        {saving ? 'CREATING...' : 'CREATE EPISODE'}
                    </button>
                </div>
            </form>
        </div>
    );
}
