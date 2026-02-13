// lib/authz.ts
import { cookies } from "next/headers";

export type ProjectRole = "OWNER" | "DEVELOPER" | "VIEWER" | "ADMIN";

export type Session = {
    userId: string;
    token: string;
    role: ProjectRole;
};

/**
 * UI-layer authorization guard.
 * - Reads auth token from cookies (Next.js latest)
 * - Asks backend for project-scoped role
 * - Enforces allowed roles
 * - Returns session for downstream API calls
 */
export async function requireProjectRole(
    projectId: string,
    allowedRoles: ProjectRole[]
): Promise<Session> {
    // ✅ cookies() is async in latest Next.js
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        throw new Error("Unauthorized: missing auth token");
    }

    const res = await fetch(
        `${process.env.API_URL}/authz/project-role`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: projectId }),
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Unauthorized: access denied");
    }

    const data = (await res.json()) as {
        user_id: string;
        role: ProjectRole;
    };

    if (!allowedRoles.includes(data.role) && data.role !== "ADMIN") {
        throw new Error("Forbidden: insufficient role");
    }

    return {
        userId: data.user_id,
        token,
        role: data.role,
    };
}
