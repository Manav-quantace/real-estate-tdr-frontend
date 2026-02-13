"use client"

import { Button } from "@/components/ui/button"

async function call(url: string) {
    await fetch(url, { method: "POST" })
    location.reload()
}

export default function SlumRounds({ params }: { params: { projectId: string } }) {
    const pid = params.projectId

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            <h1 className="text-xl font-bold">Slum Round Control</h1>

            <div className="grid gap-3">
                <Button onClick={() => call(`/api/slum/rounds/open?projectId=${pid}`)}>Open Round</Button>
                <Button onClick={() => call(`/api/slum/rounds/close?projectId=${pid}&t=0`)}>Close Round</Button>
                <Button onClick={() => call(`/api/slum/rounds/lock?projectId=${pid}&t=0`)}>Lock Round</Button>
            </div>
        </div>
    )
}
