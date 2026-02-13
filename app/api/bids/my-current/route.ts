// app/api/bids/my-current/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);

    const portalType = url.searchParams.get("portalType");
    const projectId = url.searchParams.get("projectId");
    const workflow = url.searchParams.get("workflow");

    if (!portalType || !projectId || !workflow) {
        return NextResponse.json(
            { detail: "portalType, projectId, workflow required" },
            { status: 400 }
        );
    }

    const backend = process.env.API_URL!;
    const target =
        `${backend}/api/v1/bids/my-current` +
        `?workflow=${encodeURIComponent(workflow)}` +
        `&projectId=${encodeURIComponent(projectId)}` +
        `&portalType=${encodeURIComponent(portalType)}`;

    // 🍪 read token from cookie
    const token = (await cookies()).get("auth_token")?.value;

    const headers: Record<string, string> = {
        "x-workflow": workflow,
        "x-project-id": projectId,
    };

    // 🔥 THIS IS THE REAL FIX
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(target, {
        method: "GET",
        headers,
    });

    const text = await res.text();

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") || "application/json",
        },
    });
}
