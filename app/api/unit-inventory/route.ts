import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

async function getToken() {
    return (await cookies()).get("auth_token")?.value
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const roundId = searchParams.get("roundId")

    if (!roundId) {
        return NextResponse.json({ detail: "roundId is required" }, { status: 400 })
    }

    const token = await getToken()
    if (!token) {
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })
    }

    const res = await fetch(
        `${API_URL}/api/v1/unit-inventory?roundId=${roundId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    )

    const text = await res.text()
    return new NextResponse(text, { status: res.status })
}

export async function POST(req: NextRequest) {
    const token = await getToken()
    if (!token) {
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })
    }

    const body = await req.json()

    const res = await fetch(`${API_URL}/api/v1/unit-inventory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })

    const text = await res.text()
    return new NextResponse(text, { status: res.status })
}
