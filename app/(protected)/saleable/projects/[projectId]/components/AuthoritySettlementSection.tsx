"use client"

import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AuthoritySettlementSection({
    projectId,
    workflow,
}: {
    projectId: string
    workflow: string
}) {
    const { data } = useSWR(
        `/api/settlement/result?workflow=${workflow}&projectId=${projectId}&t=0`,
        fetcher
    )

    if (!data) return null

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Settlement Result</CardTitle>
                <Badge variant={data.settled ? "default" : "secondary"}>
                    {data.settled ? "SETTLED" : "NOT SETTLED"}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3 text-sm font-mono">
                <div>Status: {data.status}</div>
                <div>Winner Quote Bid: {data.winner_quote_bid_id ?? "-"}</div>
                <div>Winning Ask Bid: {data.winning_ask_bid_id ?? "-"}</div>
                <div>Second Price (₹): {data.second_price_inr ?? "-"}</div>

                <pre className="rounded bg-muted p-3 text-xs overflow-x-auto">
                    {JSON.stringify(data.receipt, null, 2)}
                </pre>
            </CardContent>
        </Card>
    )
}
