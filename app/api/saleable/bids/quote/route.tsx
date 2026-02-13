import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json()

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/quote?workflow=saleable&projectId=${body.projectId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // forward auth cookie
                cookie: req.headers.get("cookie") || "",
            },
            body: JSON.stringify(body),
        }
    )

    const text = await res.text()
    return new NextResponse(text, { status: res.status })
}
