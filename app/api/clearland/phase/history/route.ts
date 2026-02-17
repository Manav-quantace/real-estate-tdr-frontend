import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
        return NextResponse.json({ error: "projectId required" }, { status: 400 })
    }

    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendUrl =
        `${process.env.API_URL}/api/v1/clearland/phase/history?projectId=${projectId}`

    const res = await fetch(backendUrl, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    })

    const text = await res.text()
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    })
}