import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

/* ─────────────────────────────
   helper: resolve current round t
───────────────────────────── */
async function getCurrentRoundT(
  token: string,
  projectId: string
): Promise<number> {
  const res = await fetch(
    `${NEXT_PUBLIC_API_URL}/api/v1/rounds/current?workflow=saleable&projectId=${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to resolve current round");
  }

  const data = await res.json();
  return data.current.t;
}

/* ─────────────────────────────
   GET: logged-in developer's ask
   → FastAPI: GET /api/v1/bids/ask/my
───────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  try {
    const t = await getCurrentRoundT(token, projectId);

    const res = await fetch(
      `${API_URL}/api/v1/bids/ask/my?workflow=saleable&projectId=${projectId}&t=${t}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-workflow": "saleable",
          "x-project-id": projectId,
        },
        cache: "no-store",
      }
    );

    const text = await res.text();
    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message ?? "Upstream error" },
      { status: 500 }
    );
  }
}

/* ─────────────────────────────
   POST: submit ask
   → FastAPI: POST /api/v1/bids/ask
───────────────────────────── */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const t = await getCurrentRoundT(token, projectId);

    const res = await fetch(`${API_URL}/api/v1/bids/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-workflow": "saleable",
        "x-project-id": projectId,
      },
      body: JSON.stringify({
        workflow: "saleable",
        projectId,
        t,
        dcu_units: body.dcu_units,
        ask_price_per_unit_inr: body.ask_price_per_unit_inr,
        total_ask_inr: body.total_ask_inr, // ✅ FIX
      }),
    });

    const text = await res.text();
    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message ?? "Upstream error" },
      { status: 500 }
    );
  }
}
