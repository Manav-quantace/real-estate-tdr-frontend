import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

async function getStatus(projectId: string) {
    const res = await fetch(`/api/slum/status?projectId=${projectId}`, { cache: "no-store" })
    return await res.json()
}

export default async function SlumProjectPage({ params }: { params: { projectId: string } }) {
    const status = await getStatus(params.projectId)

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
                Slum Scheme Overview
            </motion.h1>

            <Card>
                <CardHeader><CardTitle>Tripartite Structure</CardTitle></CardHeader>
                <CardContent>
                    {status.portals_present.map((p: string) => (
                        <div key={p}>✔ {p}</div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Round State</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div>Round: {status.current_round ?? "-"}</div>
                    <div>State: {status.round_state ?? "-"}</div>
                    <div>Open: {String(status.is_open)}</div>
                    <div>Locked: {String(status.is_locked)}</div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Link href={`/slum/projects/${params.projectId}/portals`} className="underline">Portals</Link>
                <Link href={`/slum/projects/${params.projectId}/rounds`} className="underline">Rounds</Link>
                <Link href={`/slum/projects/${params.projectId}/settlement`} className="underline">Settlement</Link>
            </div>
        </div>
    )
}
