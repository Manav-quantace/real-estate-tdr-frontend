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

export default function SubsidizedAskPage() {
    const { projectId } = useParams<{ projectId: string }>()

    const [round, setRound] = useState<any>(null)
    const [dcuUnits, setDcuUnits] = useState('')
    const [askPrice, setAskPrice] = useState('')
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
                `/api/bids/my-current?workflow=subsidized&projectId=${projectId}&portalType=ASK`,
                { cache: 'no-store' }
            )

            if (my.ok) {
                const data = await my.json()
                const bid = data?.bid
                if (bid) {
                    setDcuUnits(bid.dcu_units ?? '')
                    setAskPrice(bid.ask_price_per_unit_inr ?? '')
                }
            }
        } catch {
            toast.error('Failed to load ask data')
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
            const res = await fetch('/api/bids/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'subsidized',
                    projectId,
                    t: round.t,
                    dcu_units: Number(dcuUnits),
                    ask_price_per_unit_inr: Number(askPrice),
                }),
            })

            if (!res.ok) {
                const e = await res.json()
                throw new Error(e.detail || 'Ask submission failed')
            }

            toast.success('Ask submitted')
            load()
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setBusy(false)
        }
    }

    if (loading) return <Loader2 className="animate-spin" />

    const totalAsk =
        dcuUnits && askPrice
            ? Number(dcuUnits) * Number(askPrice)
            : null

    return (
        <Card className="max-w-xl p-6">
            <CardHeader>
                <CardTitle>Developer Ask (DCU)</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    Round <Badge>t = {round?.t ?? '—'}</Badge>
                </div>

                <RoundStatusBanner round={round} />

                <Input
                    type="number"
                    placeholder="DCU Units"
                    value={dcuUnits}
                    onChange={e => setDcuUnits(e.target.value)}
                    disabled={!round?.is_open || round?.is_locked}
                />

                <Input
                    type="number"
                    placeholder="Ask Price per DCU (INR)"
                    value={askPrice}
                    onChange={e => setAskPrice(e.target.value)}
                    disabled={!round?.is_open || round?.is_locked}
                />

                {totalAsk !== null && (
                    <div className="text-sm text-muted-foreground">
                        Total Ask (derived): ₹ {totalAsk.toLocaleString()}
                    </div>
                )}

                <Button disabled={busy || !round?.is_open} onClick={submit}>
                    Submit Ask
                </Button>

                <div className="text-xs text-muted-foreground">
                    You submit DCU units and per-unit price.
                    Total ask is derived server-side as per the book.
                </div>
            </CardContent>
        </Card>
    )
}
