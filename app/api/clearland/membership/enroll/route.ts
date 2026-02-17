//app/api/clearland/membership/enroll/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const backendUrl =
        `${process.env.API_URL}/api/v1/clearland/memberships/enroll` +
        `?participant_id=${encodeURIComponent(body.participantId)}` +
        `&role=${encodeURIComponent(body.role)}`

    const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // ✅ REQUIRED
            "x-project-id": body.projectId,
            // ❌ DO NOT SEND x-workflow
        },
        cache: "no-store",
    })

    const text = await res.text()
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    })
}