import Link from "next/link";

export default function DashboardPage() {
    return (
        <section style={{ display: "grid", gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 18 }}>Admin Home</h1>

            <div style={{ display: "grid", gap: 8 }}>
                <Link href="/dashboard/users">Users</Link>
            </div>
        </section>
    );
}