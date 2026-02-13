import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const baseUrl = process.env.API_URL;
    if (!baseUrl) {
        return NextResponse.json(
            { error: "API_URL not configured" },
            { status: 500 }
        );
    }

    const res = await fetch(`${process.env.API_URL}/api/v1/saleable/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await res.text(); // ⬅️ IMPORTANT

    try {
        const json = JSON.parse(text);
        return NextResponse.json(json, { status: res.status });
    } catch {
        return new NextResponse(text, { status: res.status });
    }
}
