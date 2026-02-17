//app/authority/slum/projects/[projectId]/portals/[portalType]/documents/page.tsx
"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react"

type Doc = {
    filename: string
    content_type: string
    created_at: string
}

export default function AuthorityDocumentsView() {
    const { projectId, portalType } = useParams() as {
        projectId: string
        portalType: string
    }

    const search = useSearchParams()
    const participantId = search.get("participantId")

    const [docs, setDocs] = useState<Doc[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!participantId) return

        fetch(
            `/api/slum/documents?projectId=${projectId}&portalType=${portalType}&participantId=${participantId}`,
            { cache: "no-store" }
        )
            .then(r => r.json())
            .then(d => setDocs(Array.isArray(d) ? d : []))
            .finally(() => setLoading(false))
    }, [projectId, portalType, participantId])

    if (!participantId)
        return <div className="p-10 text-red-600">Missing participantId</div>

    if (loading) return <div className="p-10">Loading documents…</div>

    return (
        <div className="p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold">Documents (Authority View)</h1>
                <Link
                    href={`/authority/slum/projects/${projectId}/portals/${portalType}`}
                    className="underline flex gap-1 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
            </div>

            {docs.length === 0 && (
                <div className="rounded-xl border p-6 bg-card text-center">
                    <AlertTriangle className="mx-auto h-6 w-6 text-yellow-500" />
                    <div className="mt-2 font-semibold">No Documents Uploaded</div>
                </div>
            )}

            <div className="grid gap-3">
                {docs.map((d, i) => (
                    <div key={i} className="rounded-xl border bg-card p-4 flex gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                            <div className="font-semibold">{d.filename}</div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(d.created_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
