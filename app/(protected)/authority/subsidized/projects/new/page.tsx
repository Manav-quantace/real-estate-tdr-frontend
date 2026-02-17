//app/authority/subsidized/projects/new/page.
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function NewSubsidizedProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // ─── Base ───────────────────────────────
    const [title, setTitle] = useState('')
    const [city, setCity] = useState('')
    const [zone, setZone] = useState('')

    // ─── Land Units ─────────────────────────
    const [luTotal, setLuTotal] = useState('')
    const [luOpenSpace, setLuOpenSpace] = useState('')

    // ─── Policy / Govt Weights ─────────────
    const [pvic, setPvic] = useState('')
    const [alpha, setAlpha] = useState('0.5')
    const [beta, setBeta] = useState('0.3')
    const [gamma, setGamma] = useState('0.2')

    // ─── Derived (Book Math) ───────────────
    const luos = Number(luOpenSpace || 0)
    const ec = Number(gamma || 0) * luos
    const gci = Number(alpha || 0) * Number(pvic || 0)
    const gce = Number(beta || 0) * ec
    const gcu = gci + gce

    const isFormValid = useMemo(() => {
        if (!title || !city) return false
        if (!luTotal || !pvic) return false
        if (Number(luOpenSpace) > Number(luTotal)) return false
        return true
    }, [title, city, luOpenSpace, luTotal, pvic])

    async function createProject() {
        if (!isFormValid) {
            toast.error('Please complete required fields correctly')
            return
        }

        setLoading(true)

        const payload = {
            workflow: 'subsidized',
            title,
            metadata: {
                kind: 'subsidized',
                project_city: city,
                project_zone: zone || null,

                economic_model: {
                    POLICY: {
                        LU: {
                            total: Number(luTotal),
                            open_space: Number(luOpenSpace),
                        },
                        PVIC: Number(pvic),
                        WEIGHTS: {
                            alpha: Number(alpha),
                            beta: Number(beta),
                            gamma: Number(gamma),
                        },
                    },

                    COMPUTED: {
                        EC: ec,
                        GCI: gci,
                        GCE: gce,
                        GCU: gcu,
                    },

                    OBJECTIVE: 'minimize(DCU + GCU)',
                    SOURCE: 'Patil Real Estate & TDR Exchange Model',
                },
            },
        }

        const res = await fetch('/api/projects?workflow=subsidized', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const e = await res.json()
            toast.error(e.detail || 'Create failed')
            setLoading(false)
            return
        }

        const data = await res.json()
        toast.success('Subsidized project created')
        router.push(`/authority/subsidized/projects/${data.projectId}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-6 max-w-5xl"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">New Subsidized Project</h1>
                <Badge variant="outline">Policy Model</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Identity</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Project Title *</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <Label>City *</Label>
                        <Input value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                    <div>
                        <Label>Zone</Label>
                        <Input value={zone} onChange={e => setZone(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Land Units</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Total LU</Label>
                        <Input type="number" value={luTotal} onChange={e => setLuTotal(e.target.value)} />
                    </div>
                    <div>
                        <Label>Open Space LU (LUOS)</Label>
                        <Input type="number" value={luOpenSpace} onChange={e => setLuOpenSpace(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Government Policy</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>PVIC</Label>
                        <Input type="number" value={pvic} onChange={e => setPvic(e.target.value)} />
                    </div>
                    <div>
                        <Label>α</Label>
                        <Input type="number" step="0.01" value={alpha} onChange={e => setAlpha(e.target.value)} />
                    </div>
                    <div>
                        <Label>β</Label>
                        <Input type="number" step="0.01" value={beta} onChange={e => setBeta(e.target.value)} />
                    </div>
                    <div>
                        <Label>γ</Label>
                        <Input type="number" step="0.01" value={gamma} onChange={e => setGamma(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Derived (Book Formula)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div>EC = γ × LUOS = <b>{ec.toFixed(2)}</b></div>
                    <div>GCI = α × PVIC = <b>{gci.toFixed(2)}</b></div>
                    <div>GCE = β × EC = <b>{gce.toFixed(2)}</b></div>
                    <Separator />
                    <div className="text-lg font-semibold">GCU = {gcu.toFixed(2)}</div>
                    <div className="text-muted-foreground">Objective: Minimize (DCU + GCU)</div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button disabled={!isFormValid || loading} onClick={createProject}>
                    {loading ? 'Creating…' : 'Create Subsidized Project'}
                </Button>
            </div>
        </motion.div>
    )
}
