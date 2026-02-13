import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    /**
     * Expected body shape:
     * {
     *   workflow: string,
     *   username: string,
     *   new_password: string
     * }
     */
    const res = await fetch(
        `${process.env.API_URL}/api/v1/auth/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    if (!res.ok) {
        let message = "Reset failed";

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

    return NextResponse.json({ ok: true });
}
