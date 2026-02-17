// app/authority/subsidized/projects/[projectId]/matching/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type Round = {
    id?: string
    t: number
    state: 'new' | 'open' | 'closed' | 'locked'
    is_open: boolean
    is_locked: boolean
}

type SettlementResp = {
    status: string
    settled: boolean
    winner_quote_bid_id: string | null
    winning_ask_bid_id: string | null
    second_price_quote_bid_id: string | null
    max_quote_inr?: string | null
    second_price_inr?: string | null
    min_ask_total_inr?: string | null
    computed_at_iso?: string | null
    receipt?: any
}

export default function MatchingPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [round, setRound] = useState<Round | null>(null)
    const [valuerVerified, setValuerVerified] = useState(false)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [settlement, setSettlement] = useState<SettlementResp | null>(null)

    async function loadRoundAndValuer() {
        setLoading(true)
        try {
            const [rRes, vRes] = await Promise.all([
                fetch(`/api/rounds/current?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' }),
                fetch(`/api/subsidized/valuer?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' }),
            ])

            if (!rRes.ok) throw new Error('Failed to load round')
            const rJson = await rRes.json()
            const cur: Round | null = rJson.current ?? null
            setRound(cur)

            if (vRes.ok) {
                const vJson = await vRes.json()
                const latest = vJson.latest ?? null
                setValuerVerified(latest?.status === 'verified')
            } else {
                setValuerVerified(false)
            }
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || 'Failed to load state')
        } finally {
            setLoading(false)
        }
    }

    async function loadSettlement() {
        if (!round) return
        setBusy(true)
        try {
            const q = new URLSearchParams({
                workflow: 'subsidized',
                projectId,
                t: String(round.t),
            })
            const res = await fetch(`/api/settlement/result?${q.toString()}`, { cache: 'no-store' })
            if (!res.ok) {
                // show helpful message when 409 / 404 from backend
                const body = await res.json().catch(() => ({}))
                const msg = body.detail || body.message || `Failed to fetch settlement (${res.status})`
                throw new Error(msg)
            }
            const data = await res.json()
            setSettlement(data)
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || 'Failed to load settlement')
        } finally {
            setBusy(false)
        }
    }

    useEffect(() => {
        loadRoundAndValuer()
    }, [projectId])

    useEffect(() => {
        // auto-load settlement only when prerequisites satisfied
        if (round && round.is_locked && valuerVerified) {
            loadSettlement()
        } else {
            setSettlement(null)
        }
    }, [round, valuerVerified])

    const ready = !!round && round.is_locked && valuerVerified

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="p-6 max-w-4xl space-y-6">
            <Card>
                <CardHeader><CardTitle>Final Matching & Settlement</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                        Settlement is the final, authoritative record that includes the matching result and economic settlement.
                        Matching is computed internally — the UI reads the settlement result. This avoids race-conditions and keeps a single canonical endpoint.
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                        {round?.is_locked ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-yellow-600" />}
                        <div>
                            Round: <Badge>t = {round?.t ?? '—'}</Badge>
                            <span className="ml-2">State: <Badge variant="outline">{round?.state ?? '—'}</Badge></span>
                        </div>
                    </div>

                    <div className="text-sm space-y-1">
                        <div>Independent Valuation Status: <b>{valuerVerified ? 'verified' : 'not verified'}</b></div>
                        {!valuerVerified && <div className="text-xs text-muted-foreground">Valuation must be verified before settlement may run.</div>}
                        {!round && <div className="text-xs text-muted-foreground">No rounds exist — open a round first on the Rounds page.</div>}
                        {round && !round.is_locked && <div className="text-xs text-muted-foreground">Round must be closed and then locked to compute settlement.</div>}
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button onClick={() => router.push(`/authority/subsidized/projects/${projectId}`)}>Project</Button>
                        <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/rounds`)}>Rounds</Button>
                        <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/inventory`)}>Inventory</Button>
                        <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/valuer`)}>Valuation</Button>
                        <div className="ml-auto">
                            <Button disabled={!ready || busy} onClick={loadSettlement}>
                                {busy ? 'Refreshing…' : 'Refresh Result'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <Card>
                <CardHeader><CardTitle>Result</CardTitle></CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading…</div>
                    ) : !round ? (
                        <div className="text-sm">No round available.</div>
                    ) : !ready ? (
                        <div className="text-sm text-muted-foreground">Prerequisites not met — settlement will be available once valuation is verified and round is locked.</div>
                    ) : settlement ? (
                        <div className="space-y-3">
                            <div>Settled: <b>{String(settlement.settled)}</b></div>
                            <div>Winner Quote Bid: <b>{settlement.winner_quote_bid_id ?? '—'}</b></div>
                            <div>Winning Ask Bid: <b>{settlement.winning_ask_bid_id ?? '—'}</b></div>
                            <div>Second Price Quote: <b>{settlement.second_price_quote_bid_id ?? '—'}</b></div>
                            <div>Max Quote (INR): <b>{settlement.max_quote_inr ?? '—'}</b></div>
                            <div>Min Ask Total (INR): <b>{settlement.min_ask_total_inr ?? '—'}</b></div>
                            <div>Second Price (INR): <b>{settlement.second_price_inr ?? '—'}</b></div>
                            <div>Computed At: <b>{settlement.computed_at_iso ?? '—'}</b></div>

                            <Separator />

                            <div className="text-sm font-semibold">Receipt (filtered)</div>
                            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(settlement.receipt ?? {}, null, 2)}</pre>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Settlement not yet computed on the server. Click Refresh Result after round is locked & valuation verified.</div>
                    )}
                </CardContent>
            </Card>

            {/* Guidance & Definitions */}
            <Card>
                <CardHeader><CardTitle>Guide & Definitions</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div><b>Flow (chronological)</b>: 1) Create project → 2) Independent Valuation (submit → verify) → 3) Open Round → 4) Set Inventory → 5) Submit Government Charges → 6) Close Round → 7) Lock Round → 8) Settlement (computed)</div>

                    <div><b>Key short forms</b>:
                        <ul className="ml-4 list-disc">
                            <li><b>LU</b> — Land Units</li>
                            <li><b>LUOS</b> — Open-space LU</li>
                            <li><b>PRU</b> — Public Right Units (project-specific)</li>
                            <li><b>TDRU</b> — Transferable Development Rights Units</li>
                            <li><b>DCU</b> — Developer Construction Units</li>
                            <li><b>PVIC</b> — Present Value of Infrastructure/Costs (govt input)</li>
                            <li><b>GCI/GCE/GCU</b> — Government charge components (GCU is the combined charge used in matching)</li>
                            <li><b>Ask</b> — Developer's ask (asks include DCU + price)</li>
                            <li><b>Quote</b> — Buyer's offer (qbundle_inr)</li>
                        </ul>
                    </div>

                    <div><b>Why settlement endpoint?</b> Settlement is the authoritative record: it internally runs matching and writes final immutable records (contract, ledger). Exposing matching separately creates duplication and race conditions — so we only read the settlement result here.</div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
