//app/(protected)/slum/projects/[projectId]/page.tsx
"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Status = {
    portals_present: string[]
    current_round?: number
    round_state?: string
    is_open?: boolean
    is_locked?: boolean
}

type Props = {
    params: Promise<{ projectId: string }>
}

export default function SlumProjectPage({ params }: Props) {
    const { projectId } = use(params)   // ✅ UNWRAP PROMISE CORRECTLY

    const [status, setStatus] = useState<Status | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch(`/api/slum/status?projectId=${projectId}`, {
                    cache: "no-store",
                })

                if (!res.ok) {
                    throw new Error("Failed to load slum status")
                }

                const data = await res.json()
                if (!cancelled) setStatus(data)
            } catch (e: any) {
                if (!cancelled) setError(e.message || "Unknown error")
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [projectId])

    if (error) {
        return (
            <div className="p-10 text-red-600">
                Failed to load project: {error}
            </div>
        )
    }

    if (!status) {
        return (
            <div className="p-10 text-muted-foreground">
                Loading slum project…
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold"
            >
                Slum Scheme Overview
            </motion.h1>

            <Card>
                <CardHeader>
                    <CardTitle>Tripartite Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    {Array.isArray(status.portals_present) &&
                        status.portals_present.map((p) => (
                            <div key={p}>✔ {p}</div>
                        ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Round State</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div>Round: {status.current_round ?? "-"}</div>
                    <div>State: {status.round_state ?? "-"}</div>
                    <div>Open: {String(status.is_open)}</div>
                    <div>Locked: {String(status.is_locked)}</div>
                </CardContent>
            </Card>

            <div className="flex gap-4 text-sm underline">
                <Link href={`/slum/projects/${projectId}/portals`}>Portals</Link>
                <Link href={`/slum/projects/${projectId}/rounds`}>Rounds</Link>
                <Link href={`/slum/projects/${projectId}/settlement`}>Settlement</Link>
            </div>
        </div>
    )
}
