//app/authority/subsidized/projects/[projectId]/rounds/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Play, Square, Lock, Plus } from 'lucide-react'

type Round = {
    id?: string
    t: number
    state: 'new' | 'open' | 'closed' | 'locked'
    is_open: boolean
    is_locked: boolean
    bidding_window_start?: string | null
    bidding_window_end?: string | null
}

export default function SubsidizedRoundsPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()
    const [current, setCurrent] = useState<Round | null>(null)
    const [history, setHistory] = useState<Round[]>([])
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)

    async function loadAll() {
        setLoading(true)
        try {
            // current
            const curRes = await fetch(`/api/rounds/current?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' })
            const curData = await curRes.json()
            const cur = curData.current || null

            // history (canonical list)
            const listRes = await fetch(`/api/rounds/roundhistory?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' })
            const list = listRes.ok ? await listRes.json() : []

            // reconcile id: if current lacks id, pull it from list
            let curWithId = cur
            if (cur && !(cur as any).id && Array.isArray(list)) {
                const matched = list.find((r: any) => r.t === cur.t)
                if (matched) curWithId = { ...cur, id: matched.id }
            }

            setCurrent(curWithId)
            setHistory(list || [])
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to load rounds')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAll()
    }, [projectId])

    async function openRound() {
        setBusy(true)
        try {
            const res = await fetch('/api/rounds/open', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflow: 'subsidized', projectId, bidding_window_start_iso: null, bidding_window_end_iso: null }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Open failed')
            }
            toast.success('Round opened')
            await loadAll()
        } catch (err: any) {
            toast.error(err.message || 'Open failed')
        } finally {
            setBusy(false)
        }
    }

    async function closeRound() {
        if (!current) return
        setBusy(true)
        try {
            const res = await fetch('/api/rounds/close', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflow: 'subsidized', projectId, t: current.t }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Close failed')
            }
            toast.success('Round closed')
            await loadAll()
        } catch (err: any) {
            toast.error(err.message || 'Close failed')
        } finally {
            setBusy(false)
        }
    }

    async function lockRound() {
        if (!current) return
        setBusy(true)
        try {
            const res = await fetch('/api/rounds/lock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflow: 'subsidized', projectId, t: current.t }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Lock failed')
            }
            toast.success('Round locked')
            await loadAll()
        } catch (err: any) {
            toast.error(err.message || 'Lock failed')
        } finally {
            setBusy(false)
        }
    }

    if (loading) {
        return (
            <div className="p-10 flex gap-2">
                <Loader2 className="animate-spin" /> Loading rounds…
            </div>
        )
    }

    if (!current) return (
        <div className="p-6">
            <Card>
                <CardHeader><CardTitle>No rounds yet</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-sm">Open the first round to start the process.</div>
                    <div className="mt-4">
                        <Button disabled={busy} onClick={openRound}><Play className="mr-2 h-4 w-4" /> Open First Round</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const canOpen = current.state === 'new' || current.state === 'locked'
    const canClose = current.state === 'open'
    const canLock = current.state === 'closed'

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="p-6 max-w-5xl space-y-6">
            <Card>
                <CardHeader><CardTitle>Current Round</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div>Round: <Badge>t = {current.t}</Badge></div>
                        <div>State: <Badge variant="outline">{current.state}</Badge></div>
                        <div className="text-xs text-muted-foreground">Open: {String(current.is_open)} · Locked: {String(current.is_locked)}</div>
                    </div>

                    <div className="flex gap-3">
                        {canOpen && (
                            <Button disabled={busy} onClick={openRound}>
                                {current.state === 'locked' ? <><Plus className="mr-2 h-4 w-4" /> Open Next Round</> : <><Play className="mr-2 h-4 w-4" /> Open Round</>}
                            </Button>
                        )}

                        {canClose && (
                            <Button disabled={busy} variant="secondary" onClick={closeRound}><Square className="mr-2 h-4 w-4" /> Close Round</Button>
                        )}

                        {canLock && (
                            <Button disabled={busy} variant="destructive" onClick={lockRound}><Lock className="mr-2 h-4 w-4" /> Lock Round</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Round History</CardTitle></CardHeader>
                <CardContent>
                    {history.length === 0 ? <div className="text-sm text-muted-foreground">No rounds yet</div> : (
                        <table className="w-full text-sm border">
                            <thead className="bg-muted">
                                <tr><th className="p-2 border">t</th><th className="p-2 border">State</th><th className="p-2 border">Open</th><th className="p-2 border">Locked</th></tr>
                            </thead>
                            <tbody>
                                {history.map(r => (
                                    <tr key={r.t}>
                                        <td className="p-2 border">{r.t}</td>
                                        <td className="p-2 border">{r.state}</td>
                                        <td className="p-2 border">{String(r.is_open)}</td>
                                        <td className="p-2 border">{String(r.is_locked)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button onClick={() => router.push(`/authority/subsidized/projects/${projectId}/inventory`)}>Set Inventory</Button>
                <Button onClick={() => router.push(`/authority/subsidized/projects/${projectId}/valuer`)}>Valuation</Button>
            </div>
        </motion.div>
    )
}
