//app/(protected)/slum/projects/[projectId]/portals/[portalType]/consents/page.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, AlertTriangle, ArrowLeft } from "lucide-react"

type ConsentState = {
    exists: boolean
    agreed?: boolean
    text?: string
    created_at?: string
}

export default function ConsentsPage() {
    const { projectId, portalType } = useParams() as {
        projectId: string
        portalType: string
    }

    const isSlumDweller = portalType === "SLUM_DWELLER"

    if (!isSlumDweller) {
        return (
            <div className="p-10 max-w-xl mx-auto text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
                <div className="mt-3 font-semibold">Consent Not Required</div>
                <div className="text-sm text-muted-foreground">
                    Only slum dwellers legally surrender occupancy rights.
                    Developers and land owners do not submit consent here.
                </div>
                <Link
                    href={`/slum/projects/${projectId}/portals/${portalType}`}
                    className="inline-flex items-center gap-2 text-sm underline mt-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to portal
                </Link>
            </div>
        )
    }

    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [consent, setConsent] = useState<ConsentState | null>(null)

    const CONSENT_TEXT = `
I hereby provide my legally binding consent to participate in the Slum
Rehabilitation and Redevelopment Scheme.

I acknowledge that:
• My existing rights in the property will be extinguished.
• Redevelopment will be executed by the approved developer.
• My entitlements will be governed strictly by scheme rules.
• Any false claim may result in forfeiture of benefits.

This consent is final and cannot be withdrawn after submission.
`

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch(
                    `/api/slum/consents?projectId=${projectId}&portalType=${portalType}`,
                    { cache: "no-store" }
                )
                if (!res.ok) throw new Error("Failed to load consent")

                const data = await res.json()
                if (!cancelled) setConsent(data)
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

    async function submit() {
        setSubmitting(true)
        setError(null)

        try {
            const res = await fetch(
                `/api/slum/consents?projectId=${projectId}&portalType=${portalType}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: CONSENT_TEXT }),
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Submit failed")

            setConsent({ exists: true, agreed: true, text: CONSENT_TEXT })
        } catch (e: any) {
            setError(e.message || "Failed")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="p-10 text-muted-foreground">Loading consent…</div>
    }

    if (error) {
        return (
            <div className="p-10 text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {error}
            </div>
        )
    }

    if (consent?.exists) {
        return (
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border bg-card p-6 text-center space-y-3"
                >
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                    <div className="font-semibold">Consent Submitted</div>
                    <div className="text-sm text-muted-foreground">
                        You have already submitted your legally binding consent.
                    </div>
                </motion.div>

                <Link
                    href={`/slum/projects/${projectId}/portals/${portalType}`}
                    className="inline-flex items-center gap-2 text-sm underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to portal
                </Link>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold"
            >
                Legal Consent — Slum Dweller
            </motion.h1>

            <div className="rounded-xl border bg-card p-5 space-y-4">
                <div className="text-sm text-muted-foreground">
                    This consent permanently surrenders your existing rights in return
                    for rehabilitation entitlement under the scheme.
                </div>

                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg border">
                    {CONSENT_TEXT}
                </pre>

                <label className="flex gap-3 items-start text-sm">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        className="mt-1"
                    />
                    I have read and understood the above terms and give my irrevocable consent.
                </label>

                <button
                    disabled={!checked || submitting}
                    onClick={submit}
                    className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50"
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting…
                        </span>
                    ) : (
                        "Submit Legal Consent"
                    )}
                </button>
            </div>

            <Link
                href={`/slum/projects/${projectId}/portals/${portalType}`}
                className="inline-flex items-center gap-2 text-sm underline"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to portal
            </Link>
        </div>
    )
}
