//code/frontend/app/api/slum/documents/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API = process.env.API_URL!

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const portalType = searchParams.get("portalType")
    const participantId = searchParams.get("participantId") // ✅ optional

    if (!projectId || !portalType) {
        return NextResponse.json(
            { detail: "projectId and portalType required" },
            { status: 400 }
        )
    }

    const url =
        `${API}/api/v1/slum/documents?projectId=${projectId}&portalType=${portalType}` +
        (participantId ? `&participantId=${participantId}` : "")

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    })

    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { detail: text } }

    return NextResponse.json(data, { status: res.status })
}
