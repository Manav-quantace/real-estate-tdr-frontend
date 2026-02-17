'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/app/(protected)/components/navbar'

export default function ClearlandQuotePage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [round, setRound] = useState<any>(null)
    const [phase, setPhase] = useState<string | null>(null)
    const [units, setUnits] = useState('')
    const [price, setPrice] = useState('')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            const r = await fetch(`/api/rounds/current?workflow=clearland&projectId=${projectId}`)
            const p = await fetch(`/api/clearland/phase/current?projectId=${projectId}`)

            if (!r.ok || !p.ok) return

            setRound(await r.json())
            setPhase((await p.json()).phase)
        }

        load()
    }, [projectId])

    const canSubmit =
        round?.state === 'open' &&
        phase === 'BUYER_BIDDING_OPEN'

    const submitQuote = async () => {
        const res = await fetch('/api/bids/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workflow: 'clearland',
                projectId,
                t: round.t,
                units_requested: Number(units),
                bid_price_per_unit: Number(price),
                notes,
            }),
        })

        if (!res.ok) {
            setError('Failed to submit quote')
            return
        }

        router.push('/clearland/dashboard')
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 px-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Buyer Quote</h1>

                {!canSubmit && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 text-red-500">
                        Quotes are not allowed at this time.
                    </div>
                )}

                <input
                    placeholder="Units requested"
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    className="w-full p-3 rounded border mb-3"
                    disabled={!canSubmit}
                />

                <input
                    placeholder="Bid price per unit"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full p-3 rounded border mb-3"
                    disabled={!canSubmit}
                />

                <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full p-3 rounded border mb-4"
                    disabled={!canSubmit}
                />

                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={submitQuote}
                    disabled={!canSubmit}
                    className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
                >
                    Submit Quote
                </button>
            </div>
        </main>
    )
}