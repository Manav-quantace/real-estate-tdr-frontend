//app/authority/slum/projects/[projectId]/matching/page.tsx
import { cookies } from "next/headers"
import Link from "next/link"
import { Lock, Shuffle, IndianRupee, FileCheck } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function SlumMatchingPage({ params }: Props) {
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
                            Matching Locked
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/authority/slum/projects/${projectId}/rounds`}>
                            <Button variant="outline">Back to Rounds</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const t = status.current_round

    const matchRes = await fetch(
        `${API}/api/v1/matching/result?workflow=slum&projectId=${projectId}&t=${t}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-workflow": "slum",
                "x-project-id": projectId,
            },
            cache: "no-store",
        }
    )

    const match = await matchRes.json()

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Matching Result</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shuffle className="h-5 w-5 text-blue-600" />
                        Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Round:</strong> {t}</div>
                    <div><strong>Status:</strong> {match.status}</div>
                    <div><strong>Matched:</strong> {match.matched ? "Yes" : "No"}</div>
                    <div><strong>Computed:</strong> {match.computed_at_iso}</div>
                    <div className="flex gap-2 items-center">
                        <IndianRupee className="h-4 w-4" /> Max Quote: ₹{match.max_quote_inr}
                    </div>
                    <div className="flex gap-2 items-center">
                        <IndianRupee className="h-4 w-4" /> Min Ask: ₹{match.min_ask_total_inr}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Matching Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded">
                        {JSON.stringify(match.notes, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Link href={`/authority/slum/projects/${projectId}/rounds`}>
                    <Button variant="outline">Back</Button>
                </Link>
                <Link href={`/authority/slum/projects/${projectId}/settlement`}>
                    <Button>
                        <FileCheck className="h-4 w-4 mr-2" />
                        View Settlement
                    </Button>
                </Link>
            </div>
        </div>
    )
}
