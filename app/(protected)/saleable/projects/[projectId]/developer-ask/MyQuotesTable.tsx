"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MyQuotesTable({ projectId }: { projectId: string }) {
    const { data, error } = useSWR(
        `/api/saleable/bids/my?projectId=${projectId}&t=0`,
        fetcher
    )

    if (error) return <div className="text-red-500">Failed to load quotes</div>
    if (!data) return <div>Loading quotes…</div>

    if (data.bids.length === 0) {
        return <div className="text-muted-foreground">No quotes submitted yet.</div>
    }

    return (
        <div className="rounded border p-4">
            <h2 className="font-semibold mb-2">My Quotes</h2>

            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left">
                        <th>Amount (₹)</th>
                        <th>Status</th>
                        <th>Submitted</th>
                    </tr>
                </thead>
                <tbody>
                    {data.bids.map((b: any) => (
                        <tr key={b.bidId}>
                            <td>{b.payload.qbundle_inr}</td>
                            <td>{b.state}</td>
                            <td>{b.submitted_at_iso || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
