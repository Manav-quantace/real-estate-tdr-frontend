import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const workflow = searchParams.get("workflow");
    const projectId = searchParams.get("projectId");
    const t = searchParams.get("t");

    if (!workflow || !projectId || t === null) {
        return NextResponse.json(
            { detail: "Missing workflow, projectId or t" },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();  // Await here
    const token = cookieStore.get("auth_token")?.value;  // Now .get() works
    const API = process.env.API_URL;

    const res = await fetch(
        `${API}/api/v1/matching/result?workflow=${workflow}&projectId=${projectId}&t=${t}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    const body = await res.text();
    return new NextResponse(body, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
