import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
        return NextResponse.json(
            { detail: 'Missing projectId' },
            { status: 400 }
        )
    }

    const token = (await cookies()).get('auth_token')?.value
    if (!token) {
        return NextResponse.json(
            { detail: 'Unauthenticated' },
            { status: 401 }
        )
    }

    const backendUrl =
        `${process.env.API_URL}/api/v1/clearland/phase/current` +
        `?projectId=${encodeURIComponent(projectId)}`

    const res = await fetch(backendUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            'x-workflow': 'clearland',
            'x-project-id': projectId,
        },
        cache: 'no-store',
    })

    const text = await res.text()

    return new NextResponse(text, {
        status: res.status,
        headers: {
            'Content-Type': res.headers.get('content-type') || 'application/json',
        },
    })
}