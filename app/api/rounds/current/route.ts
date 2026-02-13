//app/api/rounds/current/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const workflow = searchParams.get("workflow")
  const projectId = searchParams.get("projectId")

  if (!workflow || !projectId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  const token = (await cookies()).get("auth_token")?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rounds/current?workflow=${workflow}&projectId=${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  )

  const text = await res.text()
  return new NextResponse(text, { status: res.status })
}

