//app/authority/subsidized/projects/[projectId]/valuer/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type ValuationRecord = {
    version: number
    valuationInr: number | null
    status: 'submitted' | 'verified'
    signedByParticipantId: string
    valuedAtIso: string
}

export default function SubsidizedValuerPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [latest, setLatest] = useState<ValuationRecord | null>(null)
    const [history, setHistory] = useState<ValuationRecord[]>([])
    const [valuation, setValuation] = useState('')
    const [loading, setLoading] = useState(false)

    async function loadData() {
        const res = await fetch(`/api/subsidized/valuer?workflow=subsidized&projectId=${projectId}&includeHistory=true`, { cache: 'no-store' })
        if (!res.ok) {
            toast.error('Failed to load valuation')
            return
        }
        const data = await res.json()
        setLatest(data.latest ?? null)
        setHistory(data.history ?? [])
        if (data.latest?.valuationInr) setValuation(String(data.latest.valuationInr))
    }

    async function submitValuation() {
        if (!valuation) return toast.error('Enter valuation')
        if (!confirm('Submit this valuation for verification?')) return

        setLoading(true)
        try {
            const res = await fetch('/api/subsidized/valuer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflow: 'subsidized', projectId, valuationInr: Number(valuation), status: 'submitted' }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Submit failed')
            }
            toast.success('Valuation submitted for verification')
            await loadData()
        } catch (err: any) {
            toast.error(err.message || 'Submit failed')
        } finally {
            setLoading(false)
        }
    }

    async function verifyValuation() {
        if (!latest) return
        if (!confirm('Verify the latest valuation? This will mark it verified and lock edits.')) return

        setLoading(true)
        try {
            const res = await fetch('/api/subsidized/valuer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflow: 'subsidized', projectId, valuationInr: latest.valuationInr, status: 'verified' }),
            })
            if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Verify failed')
            }
            toast.success('Valuation verified')
            await loadData()
        } catch (err: any) {
            toast.error(err.message || 'Verify failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [projectId])

    const locked = latest?.status === 'verified'

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-3xl">
            <Card>
                <CardHeader><CardTitle>Independent Valuation (Gate)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <b>Who does what?</b> — an authorized valuer (or auditor/authority account) <b>submits</b> a valuation. An authorized verifier (GOV_AUTHORITY or AUDITOR per server policy) can <b>verify</b> it. Once verified the valuation becomes read-only and acts as the gate for publishing and running matching.
                    </div>

                    <Input type="number" placeholder="Valuation (INR)" value={valuation} onChange={e => setValuation(e.target.value)} disabled={locked} />

                    <div className="flex gap-2">
                        <Button disabled={loading || locked} onClick={submitValuation}>Submit for Verification</Button>
                        <Button disabled={loading || !latest || latest.status !== 'submitted'} onClick={verifyValuation}>Verify This Valuation</Button>
                        <Button variant="ghost" onClick={() => router.push(`/authority/subsidized/projects/${projectId}`)}>Back to Project</Button>
                    </div>

                    {locked && <Badge className="bg-green-600">Verified & Locked</Badge>}

                    <Separator />

                    <div className="text-sm">Latest Version: {latest?.version ?? '—'}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                    <table className="w-full text-sm border">
                        <thead><tr className="border-b"><th className="p-2">Ver</th><th className="p-2">Value</th><th className="p-2">Status</th><th className="p-2">Signed By</th></tr></thead>
                        <tbody>
                            {history.map(h => (
                                <tr key={h.version} className="border-b">
                                    <td className="p-2">{h.version}</td>
                                    <td className="p-2">₹{h.valuationInr}</td>
                                    <td className="p-2">{h.status}</td>
                                    <td className="p-2">{h.signedByParticipantId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </motion.div>
    )
}
