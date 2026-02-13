//app/api/slum/documents/upload/route.
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API = process.env.API_URL!

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return NextResponse.json({ detail: "Unauthenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")
    const portalType = searchParams.get("portalType")

    const formData = await req.formData()

    const res = await fetch(
        `${API}/api/v1/slum/documents/upload?projectId=${projectId}&portalType=${portalType}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    )

    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { detail: text } }

    return NextResponse.json(data, { status: res.status })
}
