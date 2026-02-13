import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getToken() {
    const cookieStore = await cookies()
    return cookieStore.get("auth_token")?.value
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const workflow = searchParams.get("workflow")
    const projectId = searchParams.get("projectId")
    const includeHistory = searchParams.get("includeHistory") || "false"

    if (!workflow || !projectId) {
        return NextResponse.json(
            { error: "workflow and projectId are required" },
            { status: 400 }
        )
    }

    const token = await getToken()
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendUrl =
        `${process.env.API_URL}` +
        `/api/v1/subsidized/valuer` +
        `?workflow=${workflow}` +
        `&projectId=${projectId}` +
        `&includeHistory=${includeHistory}`

    const res = await fetch(backendUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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

export async function POST(req: NextRequest) {
    const token = await getToken()
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (!body.workflow || !body.projectId || !body.status) {
        return NextResponse.json(
            { error: "workflow, projectId, status are required" },
            { status: 400 }
        )
    }

    const backendUrl =
        `${process.env.API_URL}` + `/api/v1/subsidized/valuer`

    const res = await fetch(backendUrl, {
        method: "POST",
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
