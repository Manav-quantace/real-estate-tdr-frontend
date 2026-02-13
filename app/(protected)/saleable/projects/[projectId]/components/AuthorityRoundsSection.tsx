"use client"

import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AuthorityRoundControls from "@/app/authority/projects/[projectId]/rounds/AuthorityRoundControl"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AuthorityRoundsSection({
    projectId,
    workflow,
}: {
    projectId: string
    workflow: string
}) {
    const { data, error } = useSWR(
        `/api/rounds/current?workflow=${workflow}&projectId=${projectId}`,
        fetcher
    )

    if (error) {
        return (
            <Card>
                <CardContent className="text-sm text-destructive">
                    Failed to load round state
                </CardContent>
            </Card>
        )
    }

    if (!data) return null

    const round = data.current

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    Round Management (Round {round.t})
                </CardTitle>
                <Badge variant={round.is_locked ? "destructive" : "secondary"}>
                    {round.state.toUpperCase()}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Open</div>
                    <div>{round.is_open ? "Yes" : "No"}</div>

                    <div>Locked</div>
                    <div>{round.is_locked ? "Yes" : "No"}</div>

                    <div>Bidding Opens</div>
                    <div>{round.bidding_window_start ?? "-"}</div>

                    <div>Bidding Closes</div>
                    <div>{round.bidding_window_end ?? "-"}</div>
                </div>

                <AuthorityRoundControls
                    projectId={projectId}
                    workflow={workflow}
                    round={round}
                />
            </CardContent>
        </Card>
    )
}
