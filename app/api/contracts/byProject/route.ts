import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const workflow = searchParams.get("workflow");
    const projectId = searchParams.get("projectId");

    if (!workflow || !projectId) {
        return NextResponse.json(
            { detail: "Missing workflow or projectId" },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { detail: "Unauthenticated" },
            { status: 401 }
        );
    }

    const res = await fetch(
        `${process.env.API_URL}/api/v1/contracts/byProject?workflow=${workflow}&projectId=${projectId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",

                // 🔑 REQUIRED for require_workflow_project_scope
                "x-workflow": workflow,
                "x-project-id": projectId,
            },
            cache: "no-store",
        }
    );

    const body = await res.text();

    return new NextResponse(body, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
