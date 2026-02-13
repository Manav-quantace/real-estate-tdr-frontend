import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

async function getCurrentRound(token: string, projectId: string): Promise<number> {
    const res = await fetch(
        `${API_URL}/api/v1/rounds/current?workflow=saleable&projectId=${projectId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    if (!res.ok) throw new Error("Failed to fetch current round");
    const data = await res.json();
    return data.current.t;
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await params;
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    try {
    const t = await getCurrentRound(token, projectId);

    const res = await fetch(
        `${API_URL}/api/v1/bids/my?workflow=saleable&projectId=${projectId}&t=${t}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-workflow": "saleable",
                "x-project-id": projectId,
            },
            cache: "no-store",
        }
    );

    const text = await res.text();
    return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message ?? "Failed to load buyer quote" },
            { status: 500 }
        );
    }
}

/* ─────────────────────────────
   POST: save / submit quote
   → FastAPI: POST /api/v1/bids/quote
───────────────────────────── */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await params;
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();

    try {
    const t = await getCurrentRound(token, projectId);

    const res = await fetch(`${API_URL}/api/v1/bids/quote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-workflow": "saleable",
            "x-project-id": projectId,
        },
        body: JSON.stringify({
            workflow: "saleable",
            projectId,
            t,
            qbundle_inr: body.qbundle_inr,
            action: body.action,
        }),
    });

    const text = await res.text();
    return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message ?? "Failed to submit buyer quote" },
            { status: 500 }
        );
    }
}
