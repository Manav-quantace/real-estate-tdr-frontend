//app/authority/slum/projects/[projectId]/round/SlumAuthorityRoundControl.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import {
    Lock,
    Play,
    StopCircle,
    Hammer,
    CheckCircle2,
    Shuffle,
    FileCheck,
} from "lucide-react"
import Link from "next/link"

type Props = {
    projectId: string
    workflow: string
    tripartiteReady: boolean
    round: {
        t: number
        is_open: boolean
        is_locked: boolean
        state: "new" | "open" | "closed" | "locked"
    }
}

export default function SlumAuthorityRoundControl({
    projectId,
    workflow,
    tripartiteReady,
    round,
}: Props) {
    const { toast } = useToast()
    const [loading, setLoading] = useState<null | string>(null)

    const slumBlocked = workflow === "slum" && !tripartiteReady

    async function handle(
        key: string,
        fn: () => Promise<unknown>,
        successMsg: string
    ) {
        setLoading(key)
        try {
            await fn()
            toast({ title: successMsg })
            window.location.reload()
        } catch (e: any) {
            toast({
                title: "Action failed",
                description: e?.message || "Unexpected error",
                variant: "destructive",
            })
        } finally {
            setLoading(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="border-emerald-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Authority Controls
                        {workflow === "slum" && (
                            tripartiteReady ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 ml-2">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Tripartite Ready
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground ml-2">
                                    (Tripartite required)
                                </span>
                            )
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        Round lifecycle: Open → Close → Lock → View Matching → View Settlement
                    </div>

                    {slumBlocked && (
                        <div className="flex items-center gap-2 p-3 border border-dashed rounded-md text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            Slum workflow requires all three portals before rounds can start.
                        </div>
                    )}

                    <div className="flex gap-3 flex-wrap">

                        {round.state === "new" && (
                            <Button
                                disabled={!!loading || slumBlocked}
                                onClick={() =>
                                    handle(
                                        "open",
                                        async () => {
                                            await fetch("/api/rounds/open", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ workflow, projectId }),
                                            })
                                        },
                                        "Round opened"
                                    )
                                }
                                className="gap-2"
                            >
                                <Play className="h-4 w-4" />
                                Open Round
                            </Button>
                        )}

                        {round.state === "open" && (
                            <Button
                                variant="outline"
                                disabled={!!loading || slumBlocked}
                                onClick={() =>
                                    handle(
                                        "close",
                                        async () => {
                                            await fetch("/api/rounds/close", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    workflow,
                                                    projectId,
                                                    t: round.t,
                                                }),
                                            })
                                        },
                                        "Round closed"
                                    )
                                }
                                className="gap-2"
                            >
                                <StopCircle className="h-4 w-4" />
                                Close Round
                            </Button>
                        )}

                        {round.state === "closed" && (
                            <Button
                                variant="destructive"
                                disabled={!!loading || slumBlocked}
                                onClick={() =>
                                    handle(
                                        "lock",
                                        async () => {
                                            await fetch("/api/rounds/lock", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    workflow,
                                                    projectId,
                                                    t: round.t,
                                                }),
                                            })
                                        },
                                        "Round locked"
                                    )
                                }
                                className="gap-2"
                            >
                                <Hammer className="h-4 w-4" />
                                Lock Round
                            </Button>
                        )}

                        {round.state === "locked" && (
                            <>
                                <Link href={`/authority/slum/projects/${projectId}/matching`}>
                                    <Button className="gap-2">
                                        <Shuffle className="h-4 w-4" />
                                        View Matching Result
                                    </Button>
                                </Link>

                                <Link href={`/authority/slum/projects/${projectId}/settlement`}>
                                    <Button variant="outline" className="gap-2">
                                        <FileCheck className="h-4 w-4" />
                                        View Settlement Result
                                    </Button>
                                </Link>

                                <Button
                                    disabled={!!loading}
                                    onClick={() =>
                                        handle(
                                            "next",
                                            async () => {
                                                await fetch("/api/rounds/open", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ workflow, projectId }),
                                                })
                                            },
                                            "Next round opened"
                                        )
                                    }
                                    className="gap-2"
                                >
                                    <Play className="h-4 w-4" />
                                    Open Next Round
                                </Button>
                            </>
                        )}

                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
