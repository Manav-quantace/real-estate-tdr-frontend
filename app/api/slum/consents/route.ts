//app/api/slum/consents/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API = process.env.API_URL!

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const portalType = searchParams.get("portalType")
    const participantId = searchParams.get("participantId")

    if (!projectId || !portalType) {
        return NextResponse.json(
            { detail: "projectId and portalType required" },
            { status: 400 }
        )
    }

    const url =
        `${API}/api/v1/slum/consents?projectId=${projectId}&portalType=${portalType}` +
        (participantId ? `&participantId=${participantId}` : "")

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    const text = await res.text()
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    })
}

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
        return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const portalType = searchParams.get("portalType")

    if (!projectId || !portalType) {
        return NextResponse.json(
            { detail: "projectId and portalType required" },
            { status: 400 }
        )
    }

    const body = await req.json()

    if (!body?.text || typeof body.text !== "string") {
        return NextResponse.json(
            { detail: "Consent text is required" },
            { status: 400 }
        )
    }

    // ✅ CORRECT: text goes in JSON body
    const res = await fetch(
        `${API}/api/v1/slum/consents/submit?projectId=${projectId}&portalType=${portalType}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: body.text }),
            cache: "no-store",
        }
    )

    const respText = await res.text()
    return new NextResponse(respText, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    })
}
