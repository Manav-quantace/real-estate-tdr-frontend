// app/api/rounds/control/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();
    const { action } = body;

    if (!action) {
        return NextResponse.json({ message: "action required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    // map action to backend endpoint
    let backendUrl = "";
    if (action === "open") backendUrl = `${process.env.API_URL}/api/v1/rounds/open`;
    else if (action === "close") backendUrl = `${process.env.API_URL}/api/v1/rounds/close`;
    else if (action === "lock") backendUrl = `${process.env.API_URL}/api/v1/rounds/lock`;
    else return NextResponse.json({ message: "Unknown action" }, { status: 400 });

    // forward call
    const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
        // try to forward JSON error if available
        try {
            const json = JSON.parse(text);
            return NextResponse.json(json, { status: res.status });
        } catch {
            return NextResponse.json({ message: text || res.statusText }, { status: res.status });
        }
    }

    if (contentType.includes("application/json")) {
        return NextResponse.json(JSON.parse(text), { status: res.status });
    }

    return NextResponse.json({ message: text }, { status: res.status });
}
