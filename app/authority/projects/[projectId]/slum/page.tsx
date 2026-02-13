import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

async function getStatus(projectId: string) {
    const res = await fetch(`/api/slum/status?projectId=${projectId}`, { cache: "no-store" })
    return await res.json()
}

export default async function SlumAuthorityProject({ params }: { params: { projectId: string } }) {
    const status = await getStatus(params.projectId)

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Slum Redevelopment Control</h1>

            <Card>
                <CardHeader><CardTitle>Tripartite Membership</CardTitle></CardHeader>
                <CardContent>
                    {status.portals_present.map((p: string) => (
                        <div key={p}>✔ {p}</div>
                    ))}
                    {!status.tripartite_ready && (
                        <p className="text-sm text-red-500 mt-2">
                            Missing required portals
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Round Status</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div>Round: {status.current_round ?? "-"}</div>
                    <div>State: {status.round_state ?? "-"}</div>
                    <div>Open: {String(status.is_open)}</div>
                    <div>Locked: {String(status.is_locked)}</div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button asChild><Link href={`/authority/projects/${params.projectId}/slum/rounds`}>Rounds</Link></Button>
                <Button asChild variant="outline"><Link href={`/authority/projects/${params.projectId}/slum/settlement`}>Settlement</Link></Button>
            </div>
        </div>
    )
}
