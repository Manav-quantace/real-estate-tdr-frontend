// app/api/rounds/current-with-id/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 });

    const res = await fetch(`${API_URL}/api/v1/rounds/current${req.nextUrl.search}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    return NextResponse.json(data);
}
