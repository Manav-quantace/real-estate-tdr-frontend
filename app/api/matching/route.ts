import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)

    const res = await fetch(
        `${process.env.API_URL}/api/v1/matching?${searchParams.toString()}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    )

    return new NextResponse(await res.text(), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    })
}