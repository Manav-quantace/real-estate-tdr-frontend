//app/(protected)/slum/projects/[projectId]/portals/page.tsx
import { motion } from "framer-motion"

async function getPortals(projectId: string) {
    const res = await fetch(`/api/slum/portals?projectId=${projectId}`, { cache: "no-store" })
    return await res.json()
}

export default async function SlumPortals({ params }: { params: { projectId: string } }) {
    const data = await getPortals(params.projectId)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold">
                Slum Portals
            </motion.h1>

            <div className="mt-4 grid gap-3">
                {data.portals.map((p: any, i: number) => (
                    <motion.div
                        key={p.portalType}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border bg-card p-4"
                    >
                        <div className="font-semibold">{p.portalType}</div>
                        <div className="text-sm">Enabled: {String(p.enabled)}</div>
                        <div className="text-sm">Member: {String(p.member)}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
