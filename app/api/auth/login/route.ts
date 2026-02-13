//app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    /**
     * Expected body shape:
     * {
     *   workflow: string,
     *   username: string,
     *   password: string
     * }
     */
    const res = await fetch(
        `${process.env.API_URL}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    if (!res.ok) {
        let message = "Login failed";

        try {
            const err = await res.json();
            message = err.detail || err.message || message;
        } catch {
            // ignore
        }

        return NextResponse.json(
            { message },
            { status: res.status }
        );
    }

    const data = await res.json();
    const token: string = data.access_token;

    const response = NextResponse.json({ ok: true });

    response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",

        // ⏱ align with backend JWT expiry
        maxAge: 60 * 60 * 24, // 1 day (adjust to jwt_access_token_minutes)
    });

    return response;
}
