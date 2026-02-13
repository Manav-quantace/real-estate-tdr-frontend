//app/(protected)/slum/projects/[projectId]/settlement/page.tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function PortalDashboard({ params }: { params: { portalType: string, projectId: string } }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-5xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">{params.portalType} Portal</h1>

            <div className="rounded-xl border p-4 bg-card">
                This is the engagement portal for this participant type.
            </div>

            <Link href={`/slum/projects/${params.projectId}`} className="underline text-sm">
                ← Back to project
            </Link>
        </motion.div>
    )
}

