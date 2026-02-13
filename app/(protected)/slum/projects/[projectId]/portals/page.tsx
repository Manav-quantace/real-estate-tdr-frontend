//app/(protected)/slum/projects/[projectId]/portals/page.tsx
"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

type Portal = {
    portalType: string
    enabled: boolean
    member: boolean
}

type Data = {
    portals: Portal[]
}

type Props = {
    params: Promise<{ projectId: string }>
}

export default function SlumPortals({ params }: Props) {
    const { projectId } = use(params)

    const [data, setData] = useState<Data | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch(`/api/slum/portals?projectId=${projectId}`, {
                    cache: "no-store",
                })

                if (!res.ok) throw new Error("Failed to load portals")

                const json = await res.json()
                if (!cancelled) setData(json)
            } catch (e: any) {
                if (!cancelled) setError(e.message)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [projectId])

    if (error) return <div className="p-10 text-red-600">{error}</div>
    if (!data) return <div className="p-10 text-muted-foreground">Loading…</div>

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold">
                Slum Portals
            </motion.h1>

            <div className="grid gap-3">
                {data.portals.map((p, i) => (
                    <motion.div
                        key={p.portalType}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border bg-card p-4 flex justify-between items-center"
                    >
                        <div>
                            <div className="font-semibold">{p.portalType}</div>
                            <div className="text-xs">Enabled: {String(p.enabled)}</div>
                            <div className="text-xs">Member: {String(p.member)}</div>
                        </div>

                        {p.member && (
                            <Link
                                href={`/slum/projects/${projectId}/portals/${p.portalType}`}
                                className="underline text-sm"
                            >
                                Open Portal
                            </Link>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
