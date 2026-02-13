import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
        return NextResponse.json({ error: "projectId required" }, { status: 400 })
    }

    const token = (await cookies()).get("auth_token")?.value

    const res = await fetch(
        `${process.env.API_URL}/api/v1/slum/rounds/open?projectId=${projectId}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
