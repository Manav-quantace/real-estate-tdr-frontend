'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/app/(protected)/components/navbar'

type Round = {
    t: number
    state: 'open' | 'closed' | 'locked'
}

type Phase = {
    phase: string
}

export default function ClearlandAskPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [round, setRound] = useState<Round | null>(null)
    const [phase, setPhase] = useState<string | null>(null)
    const [units, setUnits] = useState('')
    const [price, setPrice] = useState('')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const load = async () => {
            const [rRes, pRes] = await Promise.all([
                fetch(`/api/rounds/current?workflow=clearland&projectId=${projectId}`),
                fetch(`/api/clearland/phase/current?projectId=${projectId}`),
            ])

            if (!rRes.ok || !pRes.ok) {
                setError('No active round or phase found')
                return
            }

            const rJson = await rRes.json()
            const pJson = await pRes.json()

            // ✅ normalize round
            const normalizedRound =
                rJson?.current ?? rJson ?? null

            // ✅ normalize phase
            const normalizedPhase =
                pJson?.phase ??
                pJson?.current?.phase ??
                null

            setRound(normalizedRound)
            setPhase(normalizedPhase)
        }

        load()
    }, [projectId])

    const canSubmit =
        round?.state === 'open' &&
        phase === 'DEVELOPER_ASK_OPEN'

    const submitAsk = async () => {
        setSubmitting(true)
        setError(null)

        const res = await fetch('/api/bids/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workflow: 'clearland',
                projectId,
                t: round?.t,

                dcu_units: Number(units),
                ask_price_per_dcu: Number(price),

                notes,
            })
        })

        if (!res.ok) {
            setError('Failed to submit ask')
            setSubmitting(false)
            return
        }

        router.push('/clearland/dashboard')
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 px-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Developer Ask</h1>

                {!canSubmit && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 text-red-500">
                        Ask submissions are not allowed at this time.
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        placeholder="Units offered"
                        value={units}
                        onChange={e => setUnits(e.target.value)}
                        className="w-full p-3 rounded border"
                        disabled={!canSubmit}
                    />
                    <input
                        placeholder="Ask price per unit"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full p-3 rounded border"
                        disabled={!canSubmit}
                    />
                    <textarea
                        placeholder="Notes (optional)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full p-3 rounded border"
                        disabled={!canSubmit}
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <button
                        disabled={!canSubmit || submitting}
                        onClick={submitAsk}
                        className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
                    >
                        Submit Ask
                    </button>
                </div>
            </div>
        </main>
    )
}