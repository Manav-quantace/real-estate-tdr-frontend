// app/api/ledger/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Proxy to backend /api/v1/ledger
 * Adds cookie-based auth read and forwards Authorization + x-workflow/x-project-id headers.
 * Extensive console.log debugging added.
 */

function trunc(s: string | undefined) {
    if (!s) return "<none>";
    if (s.length <= 12) return s;
    return `${s.slice(0, 6)}...${s.slice(-4)}`;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const workflow = searchParams.get("workflow");
    const projectId = searchParams.get("projectId");

    if (!workflow || !projectId) {
        
        return NextResponse.json(
            { detail: "Missing workflow or projectId" },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    ;

    if (!token) {
        console.log("[proxy:/api/ledger] returning 401 — no token in cookie store");
        return NextResponse.json(
            { detail: "Unauthenticated" },
            { status: 401 }
        );
    }

    const backendUrl = `${process.env.API_URL}/api/v1/ledger?workflow=${workflow}&projectId=${projectId}`;

    

    const res = await fetch(backendUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "x-workflow": workflow,
            "x-project-id": projectId,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    const body = await res.text();

    return new NextResponse(body, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
