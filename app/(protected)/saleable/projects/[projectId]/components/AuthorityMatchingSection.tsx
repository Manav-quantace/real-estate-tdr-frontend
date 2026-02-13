"use client"

import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AuthorityMatchingSection({
    projectId,
    workflow,
}: {
    projectId: string
    workflow: string
}) {
    const { data } = useSWR(
        `/api/matching/result?workflow=${workflow}&projectId=${projectId}&t=0`,
        fetcher
    )

    if (!data) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Matching Result (Round {data.t})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-mono">
                <div>Status: {data.status}</div>
                <div>Matched: {String(data.matched)}</div>
                <div>Min Ask (₹): {data.min_ask_total_inr ?? "-"}</div>
                <div>Max Quote (₹): {data.max_quote_inr ?? "-"}</div>
                <div>Selected Ask: {data.selected_ask_bid_id ?? "-"}</div>
                <div>Selected Quote: {data.selected_quote_bid_id ?? "-"}</div>

                <pre className="rounded bg-muted p-3 text-xs">
                    {JSON.stringify(data.notes, null, 2)}
                </pre>
            </CardContent>
        </Card>
    )
}
