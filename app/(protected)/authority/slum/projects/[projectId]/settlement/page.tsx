//app/authority/slum/projects/[projectId]/settlement/page.tsx
import { cookies } from "next/headers"
import Link from "next/link"
import { Lock, FileCheck, IndianRupee, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function SlumSettlementPage({ params }: Props) {
    const { projectId } = await params
    const token = (await cookies()).get("auth_token")?.value
    const API = process.env.API_URL!

    const statusRes = await fetch(
        `${API}/api/v1/slum/status?projectId=${projectId}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    )

    const status = await statusRes.json()

    if (!status.tripartite_ready || !status.is_locked) {
        return (
            <div className="p-10 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Settlement Locked
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/authority/slum/projects/${projectId}/rounds`}>
                            <Button variant="outline">Back</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const t = status.current_round

    const settlementRes = await fetch(
        `${API}/api/v1/settlement/result?workflow=slum&projectId=${projectId}&t=${t}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-workflow": "slum",
                "x-project-id": projectId,
            },
            cache: "no-store",
        }
    )

    const settlement = await settlementRes.json()

    const showPrice = (v: number | null | undefined) =>
        typeof v === "number" ? `₹${v.toLocaleString("en-IN")}` : "—"

    const noSettlement = settlement.status === "no_settlement" || !settlement.settled

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Settlement Result</h1>

            {noSettlement && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="flex gap-3 p-4 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <strong>No Settlement Occurred.</strong>
                            <div>
                                Matching condition failed: Max Quote was lower than Min Ask.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-emerald-600" />
                        Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Round:</strong> {t}</div>
                    <div><strong>Status:</strong> {settlement.status}</div>
                    <div><strong>Settled:</strong> {settlement.settled ? "Yes" : "No"}</div>
                    <div><strong>Computed:</strong> {settlement.computed_at_iso}</div>

                    <div className="flex gap-2 items-center">
                        <IndianRupee className="h-4 w-4" /> Max Quote: {showPrice(settlement.max_quote_inr)}
                    </div>

                    <div className="flex gap-2 items-center">
                        <IndianRupee className="h-4 w-4" /> Second Price: {showPrice(settlement.second_price_inr)}
                    </div>

                    <div className="flex gap-2 items-center">
                        <IndianRupee className="h-4 w-4" /> Min Ask: {showPrice(settlement.min_ask_total_inr)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded">
                        {JSON.stringify(settlement.receipt, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <Link href={`/authority/slum/projects/${projectId}/rounds`}>
                <Button variant="outline">← Back to Rounds</Button>
            </Link>
        </div>
    )
}
