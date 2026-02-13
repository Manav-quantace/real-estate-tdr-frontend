//app/api/slum/portals/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
        return NextResponse.json({ error: "projectId required" }, { status: 400 })
    }

    const token = (await cookies()).get("auth_token")?.value

    const res = await fetch(
        `${process.env.API_URL}/api/v1/slum/portals?workflow=slum&projectId=${projectId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
