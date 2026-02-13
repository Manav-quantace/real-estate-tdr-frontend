"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Round = {
    t: number;
    state: string;
    is_open: boolean;
    is_locked: boolean;
    bidding_window_start?: string | null;
    bidding_window_end?: string | null;
};

export default function RoundHistory({ projectId }: { projectId: string }) {
    const [rounds, setRounds] = useState<Round[]>([]);

    useEffect(() => {
        async function load() {
            const r = await api.listRounds("saleable", projectId);
            setRounds(r);
        }
        load();
    }, [projectId]);

    function badgeVariant(r: Round) {
        if (r.is_locked) return "destructive";
        if (r.is_open) return "default";
        return "secondary";
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Round Timeline</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {rounds.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                        No rounds created yet.
                    </div>
                )}

                {rounds.map((r, idx) => (
                    <motion.div
                        key={r.t}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative rounded-lg border p-4 bg-background shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-semibold">
                                    Round {r.t}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {r.bidding_window_start || "—"} →{" "}
                                    {r.bidding_window_end || "—"}
                                </div>
                            </div>

                            <Badge variant={badgeVariant(r)}>
                                {r.state.toUpperCase()}
                            </Badge>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <strong>Open</strong>
                                <div>{r.is_open ? "Yes" : "No"}</div>
                            </div>

                            <div>
                                <strong>Locked</strong>
                                <div>{r.is_locked ? "Yes" : "No"}</div>
                            </div>
                        </div>

                        {r.is_locked && (
                            <div className="mt-3 text-xs text-destructive">
                                This round is final and immutable.
                            </div>
                        )}
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
