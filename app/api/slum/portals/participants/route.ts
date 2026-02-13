//app/api/slum/enroll/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API = process.env.API_URL!

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const portalType = searchParams.get("portalType")

    if (!projectId || !portalType) {
        return NextResponse.json({ detail: "projectId and portalType required" }, { status: 400 })
    }

    const res = await fetch(
        `${API}/api/v1/slum/portal/participants?projectId=${projectId}&portalType=${portalType}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    )

    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { detail: text } }

    return NextResponse.json(data, { status: res.status })
}
