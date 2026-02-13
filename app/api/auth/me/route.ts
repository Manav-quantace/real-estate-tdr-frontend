//app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const res = await fetch(
        `${process.env.API_URL}/api/v1/auth/me`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json(await res.json());
}
