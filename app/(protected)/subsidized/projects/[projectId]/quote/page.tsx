'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import RoundStatusBanner from '../RoundStatusBanner'

export default function SubsidizedQuotePage() {
    const { projectId } = useParams<{ projectId: string }>()

    const [round, setRound] = useState<any>(null)
    const [quote, setQuote] = useState('')
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)

    async function load() {
        setLoading(true)
        try {
            const r = await fetch(
                `/api/rounds/current?workflow=subsidized&projectId=${projectId}`,
                { cache: 'no-store' }
            )
            const rd = await r.json()
            setRound(rd.current ?? null)

            const my = await fetch(
                `/api/bids/my-current?workflow=subsidized&projectId=${projectId}&portalType=QUOTE`,
                { cache: 'no-store' }
            )

            if (my.ok) {
                const data = await my.json()
                setQuote(data?.bid?.payload?.qbundle_inr ?? '')
            }
        } catch {
            toast.error('Failed to load quote')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (projectId) load()
    }, [projectId])

    async function submit() {
        if (!round?.is_open) {
            toast.error('Round not open')
            return
        }

        setBusy(true)
        try {
            const res = await fetch('/api/bids/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'subsidized',
                    projectId,
                    t: round.t,
                    qbundle_inr: Number(quote), // ✅ FLAT
                }),
            })

            if (!res.ok) {
                const e = await res.json()
                throw new Error(e.detail || 'Quote submission failed')
            }

            toast.success('Quote submitted')
            load()
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setBusy(false)
        }
    }

    if (loading) return <Loader2 className="animate-spin" />

    return (
        <Card className="max-w-xl p-6">
            <CardHeader>
                <CardTitle>Buyer Quote</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    Round <Badge>t = {round?.t ?? '—'}</Badge>
                </div>

                <RoundStatusBanner round={round} />

                <Input
                    type="number"
                    placeholder="Bundled Quote (INR)"
                    value={quote}
                    onChange={e => setQuote(e.target.value)}
                    disabled={!round?.is_open || round?.is_locked}
                />

                <Button disabled={busy || !round?.is_open} onClick={submit}>
                    Submit Quote
                </Button>

                <div className="text-xs text-muted-foreground">
                    Quote is a bundled valuation (LU + PRU + TDRU − GCU),
                    evaluated via Vickrey-style matching.
                </div>
            </CardContent>
        </Card>
    )
}
