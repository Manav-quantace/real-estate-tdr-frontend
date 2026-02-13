import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const workflow = searchParams.get("workflow");
    const projectId = searchParams.get("projectId");
    const t = searchParams.get("t");

    if (!workflow || !projectId || !t) {
        return NextResponse.json({ detail: "Missing params" }, { status: 400 });
    }

    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 });
    }

    const res = await fetch(
        `${process.env.API_URL}/api/v1/authority/settlement/diagnostics?workflow=${workflow}&projectId=${projectId}&t=${t}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-workflow": workflow,
                "x-project-id": projectId,
            },
            cache: "no-store",
        }
    );

    const text = await res.text();
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
