// app/api/settlement/result/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Proxy to backend /api/v1/settlement/result
 * Extensive console.log added for debugging token + headers + backend response.
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
    const t = searchParams.get("t");



    if (!workflow || !projectId || t === null) {
        console.log("[proxy:/api/settlement/result] missing params");
        return NextResponse.json(
            { detail: "Missing workflow, projectId or t" },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    

    if (!token) {
        
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 });
    }

    const backendUrl = `${process.env.API_URL}/api/v1/settlement/result?workflow=${workflow}&projectId=${projectId}&t=${t}`;
    

    const res = await fetch(backendUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            "x-workflow": workflow,
            "x-project-id": projectId,
        },
        cache: "no-store",
    });

    const body = await res.text();

    return new NextResponse(body, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
