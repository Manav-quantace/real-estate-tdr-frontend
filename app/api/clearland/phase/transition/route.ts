//app/api/clearland/phase/transition/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { projectId, targetPhase } = body

    if (!projectId || !targetPhase) {
        return NextResponse.json(
            { error: "projectId and targetPhase required" },
            { status: 400 }
        )
    }

    const backendUrl =
        `${process.env.API_URL}/api/v1/clearland/phase/transition` +
        `?projectId=${encodeURIComponent(projectId)}` +
        `&targetPhase=${encodeURIComponent(targetPhase)}`

    const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "x-project-id": projectId,
            // DO NOT send x-workflow (let backend infer clearland)
        },
        cache: "no-store",
    })

    const text = await res.text()
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    })
}