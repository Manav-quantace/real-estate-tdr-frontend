import { NextResponse } from "next/server";
import { requireProjectRole } from "@/lib/authz";

export async function GET() {
    // Auth check only (no project scope)
    const res = await fetch(`${process.env.API_URL}/api/v1/saleable/dashboard`, {
        cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
}
