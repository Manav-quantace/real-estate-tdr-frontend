//app/api/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getToken() {
    const cookieStore = await cookies()
    return cookieStore.get("auth_token")?.value
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await context.params

    const { searchParams } = new URL(req.url)
    const workflow = searchParams.get("workflow")

    if (!workflow)
        return NextResponse.json({ error: "workflow is required" }, { status: 400 })

    const token = await getToken()
    if (!token)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const backendUrl = `${process.env.API_URL}/api/v1/projects/${projectId}?workflow=${workflow}`

    const res = await fetch(backendUrl, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    })

    const text = await res.text()

    try {
        return NextResponse.json(JSON.parse(text), { status: res.status })
    } catch {
        return NextResponse.json(
            { error: "Backend returned non-JSON", raw: text },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await context.params

    const { searchParams } = new URL(req.url)
    const workflow = searchParams.get("workflow")

    if (!workflow)
        return NextResponse.json({ error: "workflow is required" }, { status: 400 })

    const token = await getToken()
    if (!token)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const backendUrl = `${process.env.API_URL}/api/v1/projects/${projectId}?workflow=${workflow}`

    const res = await fetch(backendUrl, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    })

    const text = await res.text()

    try {
        return NextResponse.json(JSON.parse(text), { status: res.status })
    } catch {
        return NextResponse.json(
            { error: "Backend returned non-JSON", raw: text },
            { status: 500 }
        )
    }
}
