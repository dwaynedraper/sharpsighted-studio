import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/lib/db/mongodb";
import { RoleSelect } from "./RoleSelect";

type UserRow = {
    _id: any;
    email?: string;
    role?: "user" | "admin" | "superAdmin";
    status?: { isActive?: boolean };
    onboarding?: { isComplete?: boolean };
    createdAt?: Date;
    updatedAt?: Date;
};

function fmt(d?: Date) {
    if (!d) return "";
    try {
        return new Date(d).toLocaleString();
    } catch {
        return "";
    }
}

export default async function DashboardUsersPage() {
    const session = await auth();

    if (!session?.user) redirect("/login?callbackUrl=/dashboard/users");

    const role = session.user.role;
    const isAdmin = role === "admin" || role === "superAdmin";
    const isSuperAdmin = role === "superAdmin";
    if (!isAdmin) redirect("/unauthorized");

    const db = await getDb();

    const users = await db
        .collection<UserRow>("users")
        .find(
            {},
            {
                projection: {
                    email: 1,
                    role: 1,
                    status: 1,
                    onboarding: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            }
        )
        .sort({ updatedAt: -1 })
        .limit(50)
        .toArray();

    return (
        <section style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h1 style={{ margin: 0, fontSize: 18 }}>Users</h1>
                <Link href="/dashboard">Back</Link>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th align="left" style={{ borderBottom: "1px solid rgba(0,0,0,0.15)", padding: "8px 6px" }}>Email</th>
                            <th align="left" style={{ borderBottom: "1px solid rgba(0,0,0,0.15)", padding: "8px 6px" }}>Role</th>
                            <th align="left" style={{ borderBottom: "1px solid rgba(0,0,0,0.15)", padding: "8px 6px" }}>Active</th>
                            <th align="left" style={{ borderBottom: "1px solid rgba(0,0,0,0.15)", padding: "8px 6px" }}>Onboarding</th>
                            <th align="left" style={{ borderBottom: "1px solid rgba(0,0,0,0.15)", padding: "8px 6px" }}>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={String(u._id)}>
                                <td style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "8px 6px" }}>
                                    {u.email ?? ""}
                                </td>
                                <td style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "8px 6px" }}>
                                    {isSuperAdmin ? (
                                        <RoleSelect
                                            userId={String(u._id)}
                                            currentRole={u.role ?? "user"}
                                            userEmail={u.email ?? ""}
                                        />
                                    ) : (
                                        u.role ?? ""
                                    )}
                                </td>
                                <td style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "8px 6px" }}>
                                    {u.status?.isActive ? "yes" : "no"}
                                </td>
                                <td style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "8px 6px" }}>
                                    {u.onboarding?.isComplete ? "complete" : "incomplete"}
                                </td>
                                <td style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "8px 6px" }}>
                                    {fmt(u.updatedAt)}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: "10px 6px", opacity: 0.75 }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}