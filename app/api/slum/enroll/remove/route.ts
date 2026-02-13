// app/api/slum/enroll/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
const API = process.env.API_URL!;

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 });

    const body = await req.json();

    const res = await fetch(`${API}/api/v1/slum/enroll/remove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: res.status });
    } catch {
        return new NextResponse(text, { status: res.status });
    }
}
