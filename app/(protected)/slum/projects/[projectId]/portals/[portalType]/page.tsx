//app/(protected)/slum/projects/[projectId]/portals/[portalType]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Users,
    FileText,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    ShieldCheck,
    UploadCloud,
    Scale,
    Coins,
    IndianRupee,
    Lock,
} from "lucide-react"

type PortalStatus = {
    portalType: string
    enabled: boolean
    member: boolean
}

type ConsentState = {
    exists: boolean
}

type Doc = {
    filename: string
}

type RoundState = {
    t: number
    state: "new" | "open" | "closed" | "locked"
    is_open: boolean
    is_locked: boolean
}

export default function SlumPortalDashboard() {
    const params = useParams() as {
        projectId: string
        portalType: string
    }

    const projectId = params.projectId
    const portalType = params.portalType

    const isSlumDweller = portalType === "SLUM_DWELLER"

    const [portal, setPortal] = useState<PortalStatus | null>(null)
    const [consent, setConsent] = useState<ConsentState | null>(null)
    const [docs, setDocs] = useState<Doc[]>([])
    const [round, setRound] = useState<RoundState | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch(`/api/slum/portals?projectId=${projectId}`, {
                    cache: "no-store",
                })
                if (!res.ok) throw new Error("Failed to load portals")

                const data = await res.json()
                const found = data.portals.find(
                    (p: any) => p.portalType === portalType
                )
                if (!found) throw new Error("Portal not found")

                const consentRes = await fetch(
                    `/api/slum/consents?projectId=${projectId}&portalType=${portalType}`,
                    { cache: "no-store" }
                )
                const consentData = consentRes.ok
                    ? await consentRes.json()
                    : { exists: false }

                const docsRes = await fetch(
                    `/api/slum/documents?projectId=${projectId}&portalType=${portalType}`,
                    { cache: "no-store" }
                )
                const docsData = docsRes.ok ? await docsRes.json() : []

                const roundRes = await fetch(
                    `/api/rounds/current?workflow=slum&projectId=${projectId}`,
                    {
                        cache: "no-store",
                        credentials: "include",
                    }
                )
                const roundData = roundRes.ok ? await roundRes.json() : null

                if (!cancelled) {
                    setPortal(found)
                    setConsent(consentData)
                    setDocs(docsData)
                    setRound(roundData?.current || null)
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
        return <div className="p-10 text-muted-foreground">Loading portal…</div>
    }

    if (error || !portal) {
        return <div className="p-10 text-red-600">Failed: {error}</div>
    }

    if (!portal.enabled) {
        return (
            <CenteredCard
                icon={<AlertTriangle className="h-8 w-8 text-yellow-500" />}
                title="Portal Disabled"
                text="This portal is disabled for this project."
            />
        )
    }

    if (!portal.member) {
        return (
            <CenteredCard
                icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
                title="Access Denied"
                text="You are not enrolled in this portal."
            />
        )
    }

    const consentReady = isSlumDweller ? consent?.exists === true : true
    const docsReady = docs.length > 0
    const legalReady = consentReady && docsReady

    const roundOpen = round?.state === "open"
    const canBid = legalReady && roundOpen

    const roundLabel =
        round?.state === "new"
            ? "Not started"
            : round?.state === "open"
                ? "Open for bidding"
                : round?.state === "closed"
                    ? "Closed"
                    : "Locked"

    return (
        <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold">
                            {portalType.replaceAll("_", " ")} Portal
                        </h1>
                        <div className="text-xs text-muted-foreground">
                            Project: {projectId}
                        </div>
                    </div>

                    <Link
                        href={`/slum/projects/${projectId}/portals`}
                        className="inline-flex items-center gap-2 text-sm underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </motion.div>

                {/* Readiness */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border bg-card p-5 grid gap-3 md:grid-cols-4"
                >
                    {isSlumDweller && (
                        <ReadinessRow
                            ok={consentReady}
                            label="Legal Consent"
                            icon={<ShieldCheck />}
                            href={`/slum/projects/${projectId}/portals/${portalType}/consents`}
                        />
                    )}

                    <ReadinessRow
                        ok={docsReady}
                        label="Documents"
                        icon={<UploadCloud />}
                        href={`/slum/projects/${projectId}/portals/${portalType}/documents`}
                    />

                    <ReadinessRow
                        ok={roundOpen}
                        label="Round"
                        icon={<Lock />}
                    />

                    <ReadinessRow
                        ok={canBid}
                        label="Bid Ready"
                        icon={<CheckCircle2 />}
                    />
                </motion.div>

                {!roundOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border bg-card p-4 text-sm text-muted-foreground flex items-center gap-2"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        Current round is <strong>{roundLabel}</strong>. Bidding is disabled.
                    </motion.div>
                )}

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                    <ActionCard
                        icon={<Users className="h-6 w-6" />}
                        title="Participants"
                        desc="View participants in this portal"
                        href={`/slum/projects/${projectId}/portals/${portalType}/participants`}
                        disabled={!legalReady}
                    />

                    <ActionCard
                        icon={<FileText className="h-6 w-6" />}
                        title="Documents"
                        desc="Upload legally required documents"
                        href={`/slum/projects/${projectId}/portals/${portalType}/documents`}
                    />

                    {isSlumDweller && (
                        <ActionCard
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            title="Consents"
                            desc="Submit legally binding consent"
                            href={`/slum/projects/${projectId}/portals/${portalType}/consents`}
                        />
                    )}

                    {isSlumDweller && (
                        <ActionCard
                            icon={<Scale className="h-6 w-6" />}
                            title="Preference Bid"
                            desc="Submit your minimum acceptable entitlement"
                            href={`/slum/projects/${projectId}/portals/${portalType}/bids`}
                            disabled={!canBid}
                        />
                    )}

                    {portalType === "DEVELOPER" && (
                        <ActionCard
                            icon={<Coins className="h-6 w-6" />}
                            title="Ask Bid"
                            desc="Submit development offer for this round"
                            href={`/slum/projects/${projectId}/portals/${portalType}/bids`}
                            disabled={!canBid}
                        />
                    )}

                    {portalType === "AFFORDABLE_HOUSING_DEV" && (
                        <ActionCard
                            icon={<IndianRupee className="h-6 w-6" />}
                            title="Quote Bid"
                            desc="Submit rehabilitation budget for this round"
                            href={`/slum/projects/${projectId}/portals/${portalType}/bids`}
                            disabled={!canBid}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    )
}

/* ---------------- Components ---------------- */

function CenteredCard({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode
    title: string
    text: string
}) {
    return (
        <div className="p-10 max-w-xl mx-auto">
            <div className="rounded-xl border bg-card p-6 text-center">
                {icon}
                <div className="mt-3 font-semibold">{title}</div>
                <div className="text-sm text-muted-foreground">{text}</div>
            </div>
        </div>
    )
}

function ReadinessRow({
    ok,
    label,
    icon,
    href,
}: {
    ok: boolean
    label: string
    icon: React.ReactNode
    href?: string
}) {
    const row = (
        <div className="flex items-center gap-3">
            <div
                className={`h-10 w-10 flex items-center justify-center rounded-lg ${ok
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                    }`}
            >
                {icon}
            </div>
            <div>
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-muted-foreground">
                    {ok ? "Complete" : "Required"}
                </div>
            </div>
        </div>
    )

    return href ? (
        <Link href={href} className="hover:underline">
            {row}
        </Link>
    ) : (
        row
    )
}

function ActionCard({
    icon,
    title,
    desc,
    href,
    disabled,
}: {
    icon: React.ReactNode
    title: string
    desc: string
    href: string
    disabled?: boolean
}) {
    if (disabled) {
        return (
            <div className="rounded-xl border bg-card p-5 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                        {icon}
                    </div>
                    <div>
                        <div className="font-semibold">{title}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                        <div className="text-xs text-red-600 mt-1">
                            Complete consent, documents & wait for open round
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Link
            href={href}
            className="group block rounded-xl border bg-card p-5 hover:shadow-lg transition"
        >
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    {icon}
                </div>
                <div>
                    <div className="font-semibold group-hover:underline">
                        {title}
                    </div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
            </div>
        </Link>
    )
}
