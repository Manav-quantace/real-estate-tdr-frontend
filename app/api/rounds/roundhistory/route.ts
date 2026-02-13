//app/api/rounds/roundhistory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workflow = searchParams.get("workflow");
    const projectId = searchParams.get("projectId");

    if (!workflow || !projectId) {
        return NextResponse.json(
            { message: "Missing workflow or projectId" },
            { status: 400 }
        );
    }

    const res = await fetch(
        `${API_URL}/api/v1/rounds?workflow=${workflow}&projectId=${projectId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-workflow": workflow,
                "x-project-id": projectId,
            },
            cache: "no-store",
        }
    );

    const text = await res.text();
    return NextResponse.json(JSON.parse(text), { status: res.status });
}