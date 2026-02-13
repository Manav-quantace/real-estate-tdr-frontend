//app/api/slum/participants/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API = process.env.API_URL!

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    if (!projectId) {
        return NextResponse.json({ detail: "projectId required" }, { status: 400 })
    }

    const res = await fetch(
        `${API}/api/v1/slum/participants/count?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
