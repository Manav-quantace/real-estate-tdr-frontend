//app/authority/slum/projects/[projectId]/page.tsx
// app/authority/slum/projects/[projectId]/page.tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { Users, Layers, FileCheck, Shuffle, Activity } from "lucide-react"

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function AuthoritySlumProjectPage({ params }: Props) {
    const { projectId } = await params

    const token = (await cookies()).get("auth_token")?.value
    const API = process.env.API_URL!

    const headers = {
        Authorization: `Bearer ${token}`,
        "x-workflow": "slum",
        "x-project-id": projectId,
    }

    /* 1️⃣ Project */
    const projectRes = await fetch(
        `${API}/api/v1/projects/${projectId}?workflow=slum`,
        { headers, cache: "no-store" }
    )
    if (!projectRes.ok) throw new Error(await projectRes.text())
    const project = await projectRes.json()

    /* 2️⃣ Slum status */
    const statusRes = await fetch(
        `${API}/api/v1/slum/status?projectId=${projectId}`,
        { headers, cache: "no-store" }
    )
    if (!statusRes.ok) throw new Error(await statusRes.text())
    const status = await statusRes.json()

    /* 3️⃣ Current round */
    const roundRes = await fetch(
        `${API}/api/v1/rounds/current?workflow=slum&projectId=${projectId}`,
        { headers, cache: "no-store" }
    )

    let round = null
    if (roundRes.ok) {
        const data = await roundRes.json()
        round = data.current
    }

    /* 4️⃣ Participant count (from slum portal membership table) */
    /* ─────────────────────────────
       Participant count 
    ───────────────────────────── */
    const participantsRes = await fetch(
        `${API}/api/v1/slum/participants/count?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    )
    const participants = participantsRes.ok ? await participantsRes.json() : { count: "—" }

    /* 5️⃣ Stage label (SOURCE OF TRUTH = round.state) */
    let stageLabel = "Not started"

    if (!status.tripartite_ready) {
        stageLabel = "Waiting for portal enrollment"
    } else if (!round) {
        stageLabel = "Round not created"
    } else {
        switch (round.state) {
            case "new":
                stageLabel = "Round created (not opened yet)"
                break
            case "open":
                stageLabel = "Bidding open"
                break
            case "closed":
                stageLabel = "Bidding closed (awaiting lock)"
                break
            case "locked":
                stageLabel = "Round locked • Matching & settlement computed"
                break
            default:
                stageLabel = `Unknown stage (${round.state})`
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <p className="text-sm text-muted-foreground">
                    Slum Redevelopment Project Control Panel
                </p>
            </div>

            {/* STATUS BAR */}
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl border bg-muted">
                <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-primary" />
                    <strong>Stage:</strong> {stageLabel}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <strong>Participants:</strong> {participants.count}
                </div>

                <div>
                    <div className="flex items-center gap-2 text-sm"><strong>Current round:</strong>
                        <div className="font-semibold">
                            {round ? round.t : "—"}
                        </div>
                    </div>
                </div>
            </div>

            {/* NAV GRID */}
            <div className="grid gap-4 md:grid-cols-2">

                <Link
                    href={`/authority/slum/projects/${projectId}/portals`}
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow"
                >
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Portal User Data Verification</div>
                        <div className="text-xs text-muted-foreground">
                            Monitor and verify participant data across portals
                        </div>
                    </div>
                </Link>

                <Link
                    href={`/authority/slum/projects/${projectId}/rounds`}
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow"
                >
                    <Layers className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Rounds</div>
                        <div className="text-xs text-muted-foreground">
                            Open, close and lock bidding rounds
                        </div>
                    </div>
                </Link>

                <Link
                    href={`/authority/slum/projects/${projectId}/matching`}
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow"
                >
                    <Shuffle className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Matching</div>
                        <div className="text-xs text-muted-foreground">
                            View bid matching result for locked rounds
                        </div>
                    </div>
                </Link>

                <Link
                    href={`/authority/slum/projects/${projectId}/settlement`}
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow"
                >
                    <FileCheck className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Settlement</div>
                        <div className="text-xs text-muted-foreground">
                            View final Vickrey-style settlement
                        </div>
                    </div>
                </Link>

                <Link href={`/authority/slum/projects/${projectId}/stakeholder-enrollment`}
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Enroll Portals</div>
                        <div className="text-xs text-muted-foreground">
                            Assign slum dwellers, developers, housing bodies
                        </div>
                    </div>
                </Link>
            </div>

            <Link
                href="/authority/slum/projects"
                className="text-sm text-muted-foreground underline"
            >
                ← Back to Slum Projects
            </Link>
        </div>
    )
}
