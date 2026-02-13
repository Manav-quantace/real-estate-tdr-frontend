//app/(protected)/slum/projects/[projectId]/portals/[portalType]/participants/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Users,
    ArrowLeft,
    AlertTriangle,
    UserCheck,
    ShieldCheck,
} from "lucide-react"

type PortalStatus = {
    portalType: string
    enabled: boolean
    member: boolean
}

type Participant = {
    participant_id: string
    display_name?: string
    role?: string
    status?: string
}

export default function ParticipantsPage() {
    const params = useParams() as {
        projectId: string
        portalType: string
    }

    const projectId = params.projectId
    const portalType = params.portalType

    const [portal, setPortal] = useState<PortalStatus | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                /* 1️⃣ Load portal membership */
                const res = await fetch(`/api/slum/portals?projectId=${projectId}`, {
                    cache: "no-store",
                })
                if (!res.ok) throw new Error("Failed to load portals")

                const portalData = await res.json()
                const found = portalData.portals.find(
                    (p: any) => p.portalType === portalType
                )
                if (!found) throw new Error("Portal not found")

                if (!found.enabled)
                    throw new Error("Portal disabled")

                if (!found.member)
                    throw new Error("Not enrolled in this portal")

                /* 2️⃣ Load participants */
                const pres = await fetch(
                    `/api/slum/portal/participants?projectId=${projectId}&portalType=${portalType}`,
                    { cache: "no-store" }
                )
                if (!pres.ok) throw new Error("Failed to load participants")

                const plist = await pres.json()

                if (!cancelled) {
                    setPortal(found)
                    setParticipants(Array.isArray(plist) ? plist : [])
                }
            } catch (e: any) {
                if (!cancelled) setError(e.message || "Load failed")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [projectId, portalType])

    if (loading) {
        return <div className="p-10 text-muted-foreground">Loading participants…</div>
    }

    if (error) {
        return (
            <div className="p-10 max-w-xl mx-auto">
                <div className="rounded-xl border bg-card p-6 text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
                    <div className="mt-3 font-semibold">Access Error</div>
                    <div className="text-sm text-muted-foreground">{error}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Participants
                        </h1>
                        <div className="text-xs text-muted-foreground">
                            {portalType.replaceAll("_", " ")} · Project {projectId}
                        </div>
                    </div>

                    <Link
                        href={`/slum/projects/${projectId}/portals/${portalType}`}
                        className="inline-flex items-center gap-2 text-sm underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to portal
                    </Link>
                </motion.div>

                {/* Status */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border bg-card p-5 flex items-center gap-4"
                >
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <div>
                        <div className="font-semibold">Authorized Portal View</div>
                        <div className="text-xs text-muted-foreground">
                            You are allowed to view and interact with participants in this portal.
                        </div>
                    </div>
                </motion.div>

                {/* List */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid gap-3 md:grid-cols-2"
                >
                    {participants.length === 0 && (
                        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
                            No participants enrolled yet.
                        </div>
                    )}

                    {participants.map((p, i) => (
                        <motion.div
                            key={p.participant_id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="rounded-xl border bg-card p-4 flex items-center gap-4"
                        >
                            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <UserCheck className="h-6 w-6" />
                            </div>

                            <div className="flex-1">
                                <div className="font-semibold">
                                    {p.display_name || p.participant_id}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Role: {p.role || "participant"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Status: {p.status || "active"}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
