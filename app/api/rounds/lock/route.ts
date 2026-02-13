//app/api/rounds/lock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/api/v1/rounds/lock`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
}
