'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Info } from 'lucide-react'

type Round = {
    id?: string
    t: number
    state: string
    is_open: boolean
    is_locked: boolean
}

export default function GovernmentChargesPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [round, setRound] = useState<Round | null>(null)
    const [roundId, setRoundId] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const [loading, setLoading] = useState(true)

    const [gc, setGc] = useState('')
    const [gcu, setGcu] = useState('')

    async function loadRound() {
        const r = await fetch(`/api/rounds/current?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' })
        const j = await r.json()
        const cur = j.current

        if (!cur) return

        // history is canonical for id
        const h = await fetch(`/api/rounds/roundhistory?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' })
        const list = await h.json()
        const matched = list.find((x: any) => x.t === cur.t)

        setRound({ ...cur, id: matched?.id })
        setRoundId(matched?.id ?? null)
    }

    async function loadCharges(rid: string) {
        const gcRes = await fetch(`/api/government-charges?roundId=${rid}&chargeType=GC`)
        const gcuRes = await fetch(`/api/government-charges?roundId=${rid}&chargeType=GCU`)

        if (gcRes.ok) {
            const j = await gcRes.json()
            setGc(j?.valueInr ?? '')
        }
        if (gcuRes.ok) {
            const j = await gcuRes.json()
            setGcu(j?.valueInr ?? '')
        }
    }

    async function loadAll() {
        setLoading(true)
        try {
            await loadRound()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAll()
    }, [projectId])

    useEffect(() => {
        if (roundId) loadCharges(roundId)
    }, [roundId])

    async function save() {
        if (!roundId) return
        setBusy(true)

        try {
            await fetch('/api/government-charges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roundId,
                    chargeType: 'GC',
                    weights: {},
                    inputs: {},
                    valueInr: gc || null,
                }),
            })

            await fetch('/api/government-charges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roundId,
                    chargeType: 'GCU',
                    weights: {},
                    inputs: {},
                    valueInr: gcu || null,
                }),
            })

            toast.success('Government charges saved')
        } catch {
            toast.error('Save failed')
        } finally {
            setBusy(false)
        }
    }

    if (loading) {
        return (
            <div className="p-10 flex gap-2">
                <Loader2 className="animate-spin" /> Loading…
            </div>
        )
    }

    if (!round) {
        return (
            <Card className="p-6">
                <div className="text-sm">Open a round first.</div>
                <Button className="mt-4" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/rounds`)}>
                    Go to Rounds
                </Button>
            </Card>
        )
    }

    const locked = round.is_locked

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-4xl space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Government Charges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        Round <Badge>t = {round.t}</Badge>
                        {locked && <Badge className="ml-2 bg-red-600">Locked</Badge>}
                    </div>

                    <div className="text-sm text-muted-foreground flex gap-2">
                        <Info className="h-4 w-4" />
                        These charges represent statutory government costs applied to this round.
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">GC (Government Charges)</label>
                            <Input value={gc} disabled={locked} onChange={e => setGc(e.target.value)} />
                            <p className="text-xs text-muted-foreground">
                                Base government levy applied to the round.
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">GCU (Government Charges – Urban)</label>
                            <Input value={gcu} disabled={locked} onChange={e => setGcu(e.target.value)} />
                            <p className="text-xs text-muted-foreground">
                                Urban surcharge component used in subsidized settlements.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button disabled={locked || busy} onClick={save}>
                            {locked ? 'Locked' : 'Save Charges'}
                        </Button>

                        <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/rounds`)}>
                            Back to Rounds
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
