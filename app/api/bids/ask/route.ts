// app/api/bids/ask/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const backend = process.env.API_URL!;
    const target = `${backend}/api/v1/bids/ask`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-workflow": body.workflow,
        "x-project-id": body.projectId,
    };

    const token = (await cookies()).get("auth_token")?.value;
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(target, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
    });

    const text = await res.text();

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") || "application/json",
        },
    });
}
