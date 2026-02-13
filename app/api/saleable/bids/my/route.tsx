import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")
  const t = searchParams.get("t")

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/my?workflow=saleable&projectId=${projectId}&t=${t}`,
    {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  )

  const text = await res.text()
  return new NextResponse(text, { status: res.status })
}
