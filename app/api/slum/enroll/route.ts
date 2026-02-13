//app/api/slum/enroll/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API = process.env.API_URL!

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })

    const body = await req.json()

    const res = await fetch(`${API}/api/v1/slum/enroll`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { detail: text } }

    return NextResponse.json(data, { status: res.status })
}
