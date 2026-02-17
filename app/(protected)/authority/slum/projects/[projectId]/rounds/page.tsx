//app/authority/slum/projects/[projectId]/rounds/page.tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { Lock } from "lucide-react"

import AuthorityRoundControls from "./SlumAuthorityRoundControl"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function AuthoritySlumRoundsPage({ params }: Props) {
    const { projectId } = await params
    const token = (await cookies()).get("auth_token")?.value
    const API = process.env.API_URL!

    const headers = {
        Authorization: `Bearer ${token}`,
        "x-workflow": "slum",
        "x-project-id": projectId,
    }

    /* 1️⃣ Fetch slum tripartite status */
    const statusRes = await fetch(
        `${API}/api/v1/slum/status?projectId=${projectId}`,
        { headers, cache: "no-store" }
    )

    if (!statusRes.ok) {
        const txt = await statusRes.text()
        throw new Error(`Failed to load slum status: ${txt}`)
    }

    const status = await statusRes.json()

    if (!status.tripartite_ready) {
        return (
            <div className="p-10 max-w-3xl mx-auto">
                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-muted-foreground">
                            <Lock className="h-5 w-5" />
                            Rounds Locked
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Slum projects require all three portals to be enrolled before any
                            bidding rounds can be opened.
                        </p>

                        <Link
                            href={`/authority/slum/projects/${projectId}/portals`}
                            className="inline-block"
                        >
                            <Button variant="outline">
                                Go to Portal Enrollment
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    /* 2️⃣ Fetch rounds */
    const currentRes = await fetch(
        `${API}/api/v1/rounds/current?workflow=slum&projectId=${projectId}`,
        { headers, cache: "no-store" }
    )

    if (!currentRes.ok) {
        const txt = await currentRes.text()
        throw new Error(`Failed to load round: ${txt}`)
    }

    const { current: round } = await currentRes.json()

    const historyRes = await fetch(
        `${API}/api/v1/rounds?workflow=slum&projectId=${projectId}`,
        { headers, cache: "no-store" }
    )

    const rounds = historyRes.ok ? await historyRes.json() : []

    const stateBadge = (r: any) => {
        if (r.state === "locked") return "destructive"
        if (r.is_open) return "default"
        return "secondary"
    }

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">
                    Slum Authority — Round Management
                </h1>

                <div className="flex gap-3 text-sm">
                    <Link href={`/authority/slum/projects/${projectId}`}>
                        <Button variant="outline" size="sm">
                            ← Project
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Current Round</span>
                        <Badge variant={stateBadge(round)}>
                            {round.state.toUpperCase()}
                        </Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Round</strong></div>
                    <div>{round.t}</div>
                    <div><strong>Open</strong></div>
                    <div>{round.is_open ? "Yes" : "No"}</div>
                    <div><strong>Locked</strong></div>
                    <div>{round.is_locked ? "Yes" : "No"}</div>
                </CardContent>
            </Card>

            <AuthorityRoundControls
                projectId={projectId}
                workflow="slum"
                round={round}
                tripartiteReady={status.tripartite_ready}
            />

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Round History</CardTitle>
                </CardHeader>
                <CardContent>
                    {rounds.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No rounds yet.</p>
                    ) : (
                        rounds.map((r: any) => (
                            <div
                                key={r.t}
                                className="flex justify-between p-3 border rounded mb-2"
                            >
                                <span>Round {r.t}</span>
                                <Badge variant={stateBadge(r)}>
                                    {r.state.toUpperCase()}
                                </Badge>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
