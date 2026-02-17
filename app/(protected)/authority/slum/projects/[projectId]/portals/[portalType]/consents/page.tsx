//app/authority/slum/projects/[projectId]/portals/[portalType]/consents/page.tsx
"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, AlertTriangle } from "lucide-react"

type Consent = {
    exists: boolean
    text?: string
    created_at?: string
}

export default function AuthorityConsentView() {
    const { projectId, portalType } = useParams() as {
        projectId: string
        portalType: string
    }

    const search = useSearchParams()
    const participantId = search.get("participantId")

    const [consent, setConsent] = useState<Consent | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!participantId) return

        fetch(
            `/api/slum/consents?projectId=${projectId}&portalType=${portalType}&participantId=${participantId}`,
            { cache: "no-store" }
        )
            .then(r => r.json())
            .then(setConsent)
            .finally(() => setLoading(false))
    }, [projectId, portalType, participantId])

    if (!participantId)
        return <div className="p-10 text-red-600">Missing participantId</div>

    if (loading) return <div className="p-10">Loading consent…</div>

    return (
        <div className="p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold">Consent (Authority View)</h1>
                <Link
                    href={`/authority/slum/projects/${projectId}/portals/${portalType}`}
                    className="underline flex gap-1 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
            </div>

            {!consent?.exists && (
                <div className="rounded-xl border p-6 bg-card text-center">
                    <AlertTriangle className="mx-auto h-6 w-6 text-yellow-500" />
                    <div className="mt-2 font-semibold">No Consent Submitted</div>
                </div>
            )}

            {consent?.exists && (
                <div className="rounded-xl border bg-card p-6 space-y-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <div className="font-semibold">Legal Consent</div>
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
                        {consent.text}
                    </pre>
                </div>
            )}
        </div>
    )
}
