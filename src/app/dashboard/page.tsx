import Link from "next/link";
import { Users, Film, Plus, Settings } from "lucide-react";

const dashboardCards = [
    {
        title: "Users",
        description: "Manage user accounts, roles, and permissions",
        href: "/dashboard/users",
        icon: Users,
        color: "#38bdf8",
    },
    {
        title: "Episodes",
        description: "Manage RoS episodes, view voting stats",
        href: "/dashboard/content/episodes",
        icon: Film,
        color: "#a78bfa",
    },
    {
        title: "Create Episode",
        description: "Start a new Ripped or Stamped episode",
        href: "/dashboard/content/episodes/new",
        icon: Plus,
        color: "#34d399",
    },
];

export default function DashboardPage() {
    return (
        <section className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-sm text-foreground/60 font-mono">
                    Manage users, episodes, and site content
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardCards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="group relative p-6 bg-surface border border-border rounded-lg hover:border-[#38bdf8]/50 transition-all hover:shadow-lg"
                    >
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${card.color}20` }}
                        >
                            <card.icon
                                className="w-6 h-6"
                                style={{ color: card.color }}
                            />
                        </div>
                        <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-[#38bdf8] transition-colors">
                            {card.title}
                        </h2>
                        <p className="text-sm text-foreground/60 font-mono">
                            {card.description}
                        </p>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-mono text-[#38bdf8]">→</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="border-t border-border pt-6 mt-8">
                <p className="text-xs text-foreground/40 font-mono uppercase tracking-wider">
                    Quick Stats // Coming Soon
                </p>
            </div>
        </section>
    );
}