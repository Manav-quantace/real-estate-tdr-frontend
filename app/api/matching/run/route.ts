//app/api/matching/run/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const workflow = searchParams.get("workflow")
    const projectId = searchParams.get("projectId")
    const t = searchParams.get("t")

    if (!workflow || !projectId || t === null) {
        return NextResponse.json(
            { detail: "Missing workflow, projectId or t" },
            { status: 400 }
        )
    }

    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
        return NextResponse.json(
            { detail: "Unauthenticated" },
            { status: 401 }
        )
    }

    const backendUrl =
        `${process.env.API_URL}/api/v1/matching/run` +
        `?workflow=${encodeURIComponent(workflow)}` +
        `&projectId=${encodeURIComponent(projectId)}` +
        `&t=${encodeURIComponent(t)}`

    const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "x-workflow": workflow,
            "x-project-id": projectId,
        },
        cache: "no-store",
    })

    const text = await res.text()

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("content-type") || "application/json",
        },
    })
}
