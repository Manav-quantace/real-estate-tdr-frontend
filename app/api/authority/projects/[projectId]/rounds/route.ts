import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const res = await fetch(
    `${API_URL}/api/v1/rounds/current?projectId=${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  const token = (await cookies()).get("auth_token")?.value;
  const body = await req.json();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const res = await fetch(
    `${API_URL}/api/v1/rounds/${body.action}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body.payload,
        projectId,
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
