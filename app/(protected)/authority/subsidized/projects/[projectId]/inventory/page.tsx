//app/authority/subsidized/projects/[projectId]/inventory/page.tsx
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
import { Loader2 } from 'lucide-react'

type Round = {
    id: string
    t: number
    state: 'new' | 'open' | 'closed' | 'locked'
    is_open: boolean
    is_locked: boolean
}

type Inventory = {
    roundId: string
    lu: string | null
    tdru: string | null
    pru: string | null
    dcu: string | null
}

export default function SubsidizedInventoryPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [round, setRound] = useState<Round | null>(null)
    const [inventory, setInventory] = useState<Inventory | null>(null)
    const [form, setForm] = useState({ lu: '', tdru: '', pru: '', dcu: '' })
    const [busy, setBusy] = useState(false)
    const [loading, setLoading] = useState(true)

    async function loadAll() {
        setLoading(true)
        try {
            // 1️⃣ Fetch round history (ONLY valid source of round.id)
            const rRes = await fetch(
                `/api/rounds/roundhistory?workflow=subsidized&projectId=${projectId}`,
                { cache: 'no-store' }
            )

            if (!rRes.ok) {
                throw new Error('Failed to load round history')
            }

            const rounds: Round[] = await rRes.json()

            if (!rounds.length) {
                setRound(null)
                setInventory(null)
                setForm({ lu: '', tdru: '', pru: '', dcu: '' })
                return
            }

            // 2️⃣ Current round = highest t
            const current = [...rounds].sort((a, b) => b.t - a.t)[0]
            setRound(current)

            // 3️⃣ Fetch inventory for that round.id
            const invRes = await fetch(`/api/unit-inventory?roundId=${current.id}`)
            if (!invRes.ok) {
                setInventory(null)
                setForm({ lu: '', tdru: '', pru: '', dcu: '' })
                return
            }

            const invData = await invRes.json()
            setInventory(invData)
            setForm({
                lu: invData?.lu ?? '',
                tdru: invData?.tdru ?? '',
                pru: invData?.pru ?? '',
                dcu: invData?.dcu ?? '',
            })
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || 'Failed to load inventory')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAll()
    }, [projectId])

    async function save() {
        if (!round) {
            toast.error('No active round')
            return
        }

        setBusy(true)
        try {
            const res = await fetch('/api/unit-inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roundId: round.id,
                    lu: form.lu || null,
                    tdru: form.tdru || null,
                    pru: form.pru || null,
                    dcu: form.dcu || null,
                }),
            })

            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Save failed')
            }

            toast.success('Inventory saved')
            await loadAll()
        } catch (err: any) {
            toast.error(err.message || 'Save failed')
        } finally {
            setBusy(false)
        }
    }

    if (loading) {
        return (
            <div className="p-10 flex gap-2">
                <Loader2 className="animate-spin" /> Loading inventory…
            </div>
        )
    }

    if (!round) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>No active round</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                            You must open a round before defining inventory.
                        </div>
                        <Button onClick={() => router.push(
                            `/authority/subsidized/projects/${projectId}/rounds`
                        )}>
                            Go to Rounds
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const locked = round.is_locked

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="p-6 max-w-4xl space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Round Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        Round <Badge>t = {round.t}</Badge>{' '}
                        <Badge variant="outline">{round.state}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Inventory is a **snapshot** for this round.
                        Once the round is locked, inventory becomes immutable.
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="LU" value={form.lu}
                            onChange={e => setForm({ ...form, lu: e.target.value })}
                            disabled={locked}
                        />
                        <Input placeholder="TDRU" value={form.tdru}
                            onChange={e => setForm({ ...form, tdru: e.target.value })}
                            disabled={locked}
                        />
                        <Input placeholder="PRU" value={form.pru}
                            onChange={e => setForm({ ...form, pru: e.target.value })}
                            disabled={locked}
                        />
                        <Input placeholder="DCU" value={form.dcu}
                            onChange={e => setForm({ ...form, dcu: e.target.value })}
                            disabled={locked}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button disabled={busy || locked} onClick={save}>
                            {locked ? 'Locked' : 'Save Inventory'}
                        </Button>
                        <Button variant="ghost"
                            onClick={() => router.push(
                                `/authority/subsidized/projects/${projectId}/rounds`
                            )}
                        >
                            Manage Rounds
                        </Button>
                        <Button variant="ghost"
                            onClick={() => router.push(
                                `/authority/subsidized/projects/${projectId}/valuer`
                            )}
                        >
                            Valuation
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
