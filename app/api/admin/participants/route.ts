//app/api/admin/participants/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

export async function GET() {
    const token = (await cookies()).get("auth_token")?.value

    if (!token) {
        return NextResponse.json(
            { detail: "Unauthenticated" },
            { status: 401 }
        )
    }

    const res = await fetch(`${API_URL}/api/v1/admin/participants`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    const text = await res.text()
    let data
    try {
        data = JSON.parse(text)
    } catch {
        data = { detail: text }
    }

    return NextResponse.json(data, { status: res.status })
}

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value

    if (!token) {
        return NextResponse.json(
            { detail: "Unauthenticated" },
            { status: 401 }
        )
    }

    const body = await req.json()

    const res = await fetch(`${API_URL}/api/v1/admin/participants`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })

    const text = await res.text()
    let data
    try {
        data = JSON.parse(text)
    } catch {
        data = { detail: text }
    }

    return NextResponse.json(data, { status: res.status })
}
