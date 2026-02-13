//app/(protected)/slum/projects/[projectId]/portals/[portalType]/documents/page.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    UploadCloud,
    FileText,
    Loader2,
    ArrowLeft,
    AlertTriangle,
} from "lucide-react"

type Doc = {
    filename: string
    content_type: string
    created_at: string
}

export default function DocumentsPage() {

    const ROLE_DOC_HINTS: Record<string, string[]> = {
        SLUM_DWELLER: [
            "Aadhaar / Identity proof",
            "Proof of residence / hutment",
            "Survey slip or photo pass",
        ],
        AFFORDABLE_HOUSING_DEVELOPER: [
            "Development agreement",
            "Government approvals",
            "Bank guarantees",
        ],
        SLUM_LAND_DEVELOPER: [
            "Land title deed",
            "7/12 extract or RTC",
            "Encumbrance certificate",
        ],
    }

    const { projectId, portalType } = useParams() as {
        projectId: string
        portalType: string
    }

    const [file, setFile] = useState<File | null>(null)
    const [docs, setDocs] = useState<Doc[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function loadDocs() {
        const res = await fetch(
            `/api/slum/documents?projectId=${projectId}&portalType=${portalType}`,
            { cache: "no-store" }
        )

        if (!res.ok) {
            // treat missing endpoint or empty as empty state, not crash
            return []
        }

        const data = await res.json()
        return Array.isArray(data) ? data : []
    }

    useEffect(() => {
        let cancelled = false

        async function run() {
            try {
                const d = await loadDocs()
                if (!cancelled) setDocs(d)
            } catch (e: any) {
                if (!cancelled) setError(e.message || "Failed to load documents")
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [projectId, portalType])

    async function upload() {
        if (!file) return
        setUploading(true)
        setError(null)

        try {
            const fd = new FormData()
            fd.append("file", file)

            const res = await fetch(
                `/api/slum/documents/upload?projectId=${projectId}&portalType=${portalType}`,
                { method: "POST", body: fd }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Upload failed")

            setFile(null)
            const fresh = await loadDocs()
            setDocs(fresh)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold">
                            Documents — {portalType.replaceAll("_", " ")}
                        </h1>
                        <div className="text-xs text-muted-foreground">
                            Upload legally required proof documents for this portal
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

                {/* Instruction Card */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border bg-card p-5 space-y-2"
                >
                    <div className="font-semibold">Required Documents</div>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {(ROLE_DOC_HINTS[portalType] || ["Relevant legal documents"]).map((d) => (
                            <li key={d}>{d}</li>
                        ))}
                    </ul>
                    <div className="text-xs text-muted-foreground">
                        Documents will be reviewed by the authority before proceeding further.
                    </div>
                </motion.div>


                {/* Upload Box */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-xl border bg-card p-6 space-y-4"
                >
                    <label
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-muted transition text-center"
                    >
                        <UploadCloud className="h-8 w-8 text-emerald-600" />
                        <div className="mt-2 font-semibold">Click to select a document</div>
                        <div className="text-xs text-muted-foreground">
                            PDF / JPG / PNG supported
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>

                    {file && (
                        <div className="text-sm">
                            Selected: <span className="font-medium">{file.name}</span>
                        </div>
                    )}

                    <button
                        disabled={!file || uploading}
                        onClick={upload}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-5 py-2 text-sm disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading…
                            </>
                        ) : (
                            "Upload Document"
                        )}
                    </button>
                </motion.div>

                {/* Errors */}
                {error && (
                    <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600 flex gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Document List */}
                <div className="space-y-2">
                    <div className="font-semibold text-sm">Your Uploaded Documents</div>

                    {loading && (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                    )}

                    {!loading && docs.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No documents uploaded yet.
                        </div>
                    )}

                    {docs.map((d, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-3 rounded-lg border bg-card p-3"
                        >
                            <FileText className="h-4 w-4 text-emerald-600" />
                            <div className="text-sm">{d.filename}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
