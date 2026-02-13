"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

import { FileText, CheckCircle2, Upload, Loader2 } from "lucide-react"

type Document = {
    name: string
    url: string
    type?: string
    uploaded_at: string
}

type Dashboard = {
    portalType: string
    member: boolean
    consent?: {
        value: boolean
        note?: string
        submitted_at: string
    }
    documents: Document[]
}

export default function SlumPortalDashboardPage() {
    const { projectId, portalType } = useParams<{
        projectId: string
        portalType: string
    }>()

    const [data, setData] = useState<Dashboard | null>(null)
    const [loading, setLoading] = useState(true)

    const [consent, setConsent] = useState<boolean | null>(null)
    const [note, setNote] = useState("")
    const [docName, setDocName] = useState("")
    const [docUrl, setDocUrl] = useState("")
    const [docType, setDocType] = useState("")

    async function load() {
        setLoading(true)
        try {
            const res = await fetch(
                `/api/slum/portal/dashboard?projectId=${projectId}&portalType=${portalType}`
            )
            const json = await res.json()
            if (!res.ok) throw new Error(json.detail || "Failed to load")
            setData(json)
            setConsent(json.consent?.value ?? null)
            setNote(json.consent?.note || "")
        } catch (e: any) {
            toast.error("Failed to load portal", { description: e.message })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [projectId, portalType])

    async function submitConsent() {
        const res = await fetch("/api/slum/portal/consent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                projectId,
                portalType,
                consent,
                note,
            }),
        })

        const json = await res.json()
        if (!res.ok) {
            toast.error("Consent failed", { description: json.detail })
            return
        }

        toast.success("Consent submitted")
        load()
    }

    async function addDocument() {
        const res = await fetch("/api/slum/portal/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                projectId,
                portalType,
                name: docName,
                url: docUrl,
                docType,
            }),
        })

        const json = await res.json()
        if (!res.ok) {
            toast.error("Upload failed", { description: json.detail })
            return
        }

        toast.success("Document registered")
        setDocName("")
        setDocUrl("")
        setDocType("")
        load()
    }

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    if (!data) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-5xl mx-auto p-8 space-y-8"
        >
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {portalType.replaceAll("_", " ")} Portal
                    </h1>
                    <p className="text-muted-foreground">
                        Project engagement & compliance dashboard
                    </p>
                </div>
                <Badge variant="secondary">SLUM WORKFLOW</Badge>
            </div>

            {/* CONSENT */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Consent
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.consent ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">
                                    {data.consent.value ? "Approved" : "Rejected"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {data.consent.note}
                                </div>
                            </div>
                            <Badge>{new Date(data.consent.submitted_at).toLocaleDateString()}</Badge>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-3">
                                <Button
                                    variant={consent === true ? "default" : "outline"}
                                    onClick={() => setConsent(true)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant={consent === false ? "destructive" : "outline"}
                                    onClick={() => setConsent(false)}
                                >
                                    Reject
                                </Button>
                            </div>

                            <Textarea
                                placeholder="Optional note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />

                            <Button onClick={submitConsent} disabled={consent === null}>
                                Submit Consent
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* DOCUMENTS */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {data.documents.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            No documents uploaded yet.
                        </div>
                    ) : (
                        data.documents.map((d, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between border rounded-md p-3"
                            >
                                <div>
                                    <div className="font-medium">{d.name}</div>
                                    <div className="text-xs text-muted-foreground">{d.type}</div>
                                </div>
                                <a
                                    href={d.url}
                                    target="_blank"
                                    className="text-sm underline"
                                >
                                    View
                                </a>
                            </div>
                        ))
                    )}

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Document name"
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                        />
                        <Input
                            placeholder="Document URL"
                            value={docUrl}
                            onChange={(e) => setDocUrl(e.target.value)}
                        />
                        <Input
                            placeholder="Type (layout, consent, etc)"
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                        />
                    </div>

                    <Button onClick={addDocument} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Register Document
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}
