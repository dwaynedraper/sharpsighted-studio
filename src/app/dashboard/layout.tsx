import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard");
    }

    const role = session.user.role;
    const isAdmin = role === "admin" || role === "superAdmin";

    if (!isAdmin) {
        redirect("/unauthorized");
    }

    return (
        <main style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, opacity: 0.75 }}>Sharp Sighted Studio</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>Dashboard</div>
            </div>

            {children}
        </main>
    );
}