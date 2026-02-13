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

type Project = {
    projectId: string
    workflow: string
    title: string
    status: string
    isPublished: boolean
    metadata: any
}

type Round = {
    t: number
    state: string
    is_open: boolean
    is_locked: boolean
    // may or may not include id depending on backend; other pages will reconcile
    id?: string
}

type ValuerState = {
    latest?: { status: string; valuationInr?: string | null } | null
}

export default function SubsidizedProjectPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [project, setProject] = useState<Project | null>(null)
    const [round, setRound] = useState<Round | null>(null)
    const [valuer, setValuer] = useState<ValuerState | null>(null)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)

    async function loadProject() {
        const res = await fetch(`/api/projects/${projectId}?workflow=subsidized`)
        if (!res.ok) {
            const e = await res.json().catch(() => ({}))
            throw new Error(e.detail || 'Failed to load project')
        }
        return res.json()
    }

    async function loadRound() {
        // fetch current round shape; if id missing, get list and match
        const curRes = await fetch(`/api/rounds/current?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' })
        if (!curRes.ok) return null
        const curData = await curRes.json()
        const cur = curData.current || null

        if (!cur) return null

        if ((cur as any).id) return cur
        // fallback: fetch history and find the round with same t to obtain id
        const histRes = await fetch(`/api/rounds?workflow=subsidized&projectId=${projectId}`, { cache: 'no-store' })
        if (!histRes.ok) return cur
        const hist = await histRes.json()
        const matched = Array.isArray(hist) ? hist.find((r: any) => r.t === cur.t) : null
        if (matched) return { ...cur, id: matched.id }
        return cur
    }

    async function loadValuer() {
        const res = await fetch(`/api/subsidized/valuer?workflow=subsidized&projectId=${projectId}`)
        if (!res.ok) return null
        return res.json()
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([loadProject(), loadRound(), loadValuer()])
            .then(([p, r, v]) => {
                if (p?.workflow !== 'subsidized') {
                    toast.error('Not a subsidized project')
                    router.push('/authority')
                    return
                }
                setProject(p)
                setRound(r)
                setValuer(v)
            })
            .catch(e => toast.error(e?.message || 'Load failed'))
            .finally(() => setLoading(false))
    }, [projectId])

    async function publishProject() {
        if (!valuer?.latest?.status || valuer.latest.status !== 'verified') {
            toast.error('Project cannot be published until valuation is verified')
            return
        }
        setBusy(true)
        try {
            const res = await fetch(`/api/projects/${projectId}/publish?workflow=subsidized`, { method: 'POST' })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Publish failed')
            }
            toast.success('Project published')
            const updated = await loadProject()
            setProject(updated)
        } catch (err: any) {
            toast.error(err.message || 'Publish failed')
        } finally {
            setBusy(false)
        }
    }

    async function runMatching() {
        if (!round) return toast.error('No active round')
        if (valuer?.latest?.status !== 'verified') {
            toast.error('Cannot run matching until valuation is verified')
            return
        }
        if (!round.is_locked) {
            toast.error('Round must be locked first')
            return
        }
        setBusy(true)
        try {
            const res = await fetch(`/api/matching/run?workflow=subsidized&projectId=${projectId}&t=${round.t}`, { method: 'POST' })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Matching failed')
            }
            const data = await res.json()
            toast.success(data.matched ? 'Matched successfully' : 'No match found')
        } catch (err: any) {
            toast.error(err.message || 'Matching failed')
        } finally {
            setBusy(false)
        }
    }

    if (loading) {
        return (
            <div className="p-10 flex items-center gap-2">
                <Loader2 className="animate-spin" /> Loading project…
            </div>
        )
    }

    if (!project) return <div className="p-10 text-red-500">Project not found</div>

    const em = project.metadata?.economic_model || {}
    const gcu = em?.COSTS?.GCU ?? '—'
    const dcu = em?.DCU?.total ?? '—'
    const valuerStatus = valuer?.latest?.status || 'not_submitted'
    const valuerVerified = valuerStatus === 'verified'

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 space-y-6 max-w-6xl">
            {/* Header + quick nav */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{project.title}</h1>
                    <div className="text-sm text-muted-foreground">{project.projectId}</div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/rounds`)}>
                        Manage Rounds
                    </Button>
                    <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/inventory`)}>
                        Round Inventory
                    </Button>
                    <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/valuer`)}>
                        Valuation
                    </Button>
                    <Badge variant={project.isPublished ? 'default' : 'outline'}>{project.isPublished ? 'Published' : 'Draft'}</Badge>
                </div>
            </div>

            {/* Explanatory guide panel */}
            <Card>
                <CardHeader>
                    <CardTitle>Process & Definitions (quick guide)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="font-semibold">Chronological flow — required order</div>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Create project (this page)</li>
                        <li>Independent valuer submits → verifier verifies (Valuation page) — project cannot be published until valuation is <b>verified</b></li>
                        <li>Open a round (Rounds → Open)</li>
                        <li>Set Round Inventory (Inventory page) — one snapshot per round</li>
                        <li>Close round (Rounds → Close)</li>
                        <li>Lock round (Rounds → Lock) — this locks bids & inventory and allows matching</li>
                        <li>Run matching (this page → Run Matching)</li>
                        <li>Publish project (this page → Publish)</li>
                    </ol>

                    <div className="font-semibold">Short glossary</div>
                    <ul className="list-disc list-inside space-y-1">
                        <li><b>LU</b> — Land Unit (base land quantity). LUOS = open-space portion.</li>
                        <li><b>PRU</b> — Private Redevelopment Units (developer rights allocated to private redevelopment)</li>
                        <li><b>TDRU</b> — Transfer Development Rights Units (rights that can be sold/transferred)</li>
                        <li><b>DCU</b> — Direct Charge Units (government-imposed units/charges)</li>
                        <li><b>PVIC</b> — Present Value of Implementation Cost (government charge baseline)</li>
                        <li><b>GCU</b> — Government Charge Unit (derived, GCI + GCE). Objective: minimize (DCU + GCU)</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Economic model summary */}
            <Card>
                <CardHeader><CardTitle>Economic Model</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-sm">
                    <div>LU Total: {em?.LU?.total ?? '—'}</div>
                    <div>LU Open: {em?.LU?.open_space ?? '—'}</div>
                    <div>DCU Total: {dcu}</div>
                    <div>PVIC: {em?.COSTS?.PVIC ?? '—'}</div>
                    <div>α: {em?.WEIGHTS?.alpha ?? '—'}</div>
                    <div>β: {em?.WEIGHTS?.beta ?? '—'}</div>
                    <div>γ: {em?.WEIGHTS?.gamma ?? '—'}</div>
                    <Separator className="col-span-3" />
                    <div className="col-span-3 font-semibold">GCU = {gcu} → Objective: minimize (DCU + GCU)</div>
                </CardContent>
            </Card>

            {/* Valuer gate */}
            <Card>
                <CardHeader><CardTitle>Independent Valuer (Gate)</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>Status: <b>{valuerStatus}</b></div>
                    {valuerVerified ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-yellow-600" />}
                </CardContent>
                {!valuerVerified && (
                    <CardContent>
                        <Button variant="outline" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/valuer`)}>
                            Go to Valuation Page
                        </Button>
                    </CardContent>
                )}
            </Card>

            {/* Current Round summary */}
            <Card>
                <CardHeader><CardTitle>Current Round</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {round ? (
                        <>
                            <div>t = {round.t}</div>
                            <div>State: {round.state}</div>
                        </>
                    ) : <div>No rounds yet</div>}
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader><CardTitle>Authority Actions</CardTitle></CardHeader>
                <CardContent className="flex gap-4 flex-wrap">
                    <Button disabled={project.isPublished || busy || !valuerVerified} onClick={publishProject}>
                        Publish Project
                    </Button>

                    <Button disabled={!round || !round.is_locked || busy || !valuerVerified} variant="secondary" onClick={runMatching}>
                        Run Matching
                    </Button>

                    <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/rounds`)}>
                        Manage Rounds
                    </Button>

                    <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}/inventory`)}>
                        Edit Inventory
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}
