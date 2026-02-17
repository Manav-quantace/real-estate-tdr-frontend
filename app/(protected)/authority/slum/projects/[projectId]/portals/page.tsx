//app/authority/slum/projects/[projectId]/portals/page.                                                                                                                                                                                                                                                                                                                                                    
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldCheck, Users, ArrowLeft } from "lucide-react"

type Portal = {
    portalType: string
    enabled: boolean
}

export default function AuthorityPortalsPage() {
    const { projectId } = useParams() as { projectId: string }
    const [portals, setPortals] = useState<Portal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/slum/portals?projectId=${projectId}`, { cache: "no-store" })
            .then(r => r.json())
            .then(d => setPortals(d.portals || []))
            .finally(() => setLoading(false))
    }, [projectId])

    if (loading) return <div className="p-10">Loading…</div>

    return (
        <div className="p-10 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Authority — Slum Portals</h1>
                <Link href={`/authority/slum/projects`} className="underline flex gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {portals.map(p => (
                    <Link
                        key={p.portalType}
                        href={`/authority/slum/projects/${projectId}/portals/${p.portalType}`}
                        className="border rounded-xl p-5 hover:shadow-lg transition bg-card"
                    >
                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                        <div className="font-semibold mt-2">{p.portalType.replaceAll("_", " ")}</div>
                        <div className="text-xs text-muted-foreground">
                            Monitor participants, consent and documents
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
