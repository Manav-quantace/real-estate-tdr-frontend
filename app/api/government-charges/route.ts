import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function GET(req: NextRequest) {
    const token = (await cookies()).get('auth_token')?.value
    if (!token) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const roundId = searchParams.get('roundId')
    const chargeType = searchParams.get('chargeType')

    if (!roundId || !chargeType) {
        return NextResponse.json({ message: 'Missing params' }, { status: 400 })
    }

    const res = await fetch(
        `${API_URL}/api/v1/government-charges?roundId=${roundId}&chargeType=${chargeType}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        }
    )

    const text = await res.text()
    return new NextResponse(text, { status: res.status })
}

export async function POST(req: NextRequest) {
    const token = (await cookies()).get('auth_token')?.value
    if (!token) return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    const body = await req.text()

    const res = await fetch(`${API_URL}/api/v1/government-charges`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body,
    })

    const text = await res.text()
    return new NextResponse(text, { status: res.status })
}
