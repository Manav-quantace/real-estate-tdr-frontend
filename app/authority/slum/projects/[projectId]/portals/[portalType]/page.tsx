//app/authority/slum/projects/[projectId]/portals/[portalType]/page.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldCheck, FileText, ArrowLeft, Users } from "lucide-react"

type Participant = {
    participant_id: string
    display_name?: string
    role?: string
}

export default function AuthorityPortalDetail() {
    const { projectId, portalType } = useParams() as {
        projectId: string
        portalType: string
    }

    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/slum/portals/participants?projectId=${projectId}&portalType=${portalType}`, {
            cache: "no-store",
        })
            .then(r => r.json())
            .then(d => setParticipants(Array.isArray(d) ? d : []))
            .finally(() => setLoading(false))
    }, [projectId, portalType])

    if (loading) return <div className="p-10">Loading participants…</div>

    return (
        <div className="p-10 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">
                        {portalType.replaceAll("_", " ")} — Authority View
                    </h1>
                    <div className="text-xs text-muted-foreground">Project {projectId}</div>
                </div>

                <Link
                    href={`/authority/slum/projects/${projectId}/portals`}
                    className="underline flex gap-1 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {participants.map(p => (
                    <motion.div
                        key={p.participant_id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-xl p-4 bg-card space-y-2"
                    >
                        <Users className="h-5 w-5 text-primary" />
                        <div className="font-semibold">
                            {p.display_name || p.participant_id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Role: {p.role || "participant"}
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Link
                                href={`/authority/slum/projects/${projectId}/portals/${portalType}/consents?participantId=${p.participant_id}`}
                                className="text-sm underline flex items-center gap-1"
                            >
                                <ShieldCheck className="h-4 w-4" /> Consent
                            </Link>

                            <Link
                                href={`/authority/slum/projects/${projectId}/portals/${portalType}/documents?participantId=${p.participant_id}`}
                                className="text-sm underline flex items-center gap-1"
                            >
                                <FileText className="h-4 w-4" /> Documents
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
