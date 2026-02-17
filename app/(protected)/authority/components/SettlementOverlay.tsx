"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SettlementResult = {
    status: string;
    settled: boolean;
    winner_quote_bid_id?: string | null;
    winning_ask_bid_id?: string | null;
    second_price_inr?: string | null;
    min_ask_total_inr?: string | null;
    max_quote_inr?: string | null;
    computed_at_iso?: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    workflow: string;
    projectId: string;
    t: number;
};

export default function SettlementOverlay({
    open,
    onClose,
    workflow,
    projectId,
    t,
}: Props) {
    const [data, setData] = useState<SettlementResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        fetch(
            `/api/settlement/result?workflow=${workflow}&projectId=${projectId}&t=${t}`,
            { cache: "no-store" }
        )
            .then((r) => r.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [open, workflow, projectId, t]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Settlement Result — Round {t}
                        {data && (
                            <Badge variant={data.settled ? "default" : "secondary"}>
                                {data.settled ? "SETTLED" : "NO SETTLEMENT"}
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {loading && (
                    <div className="text-sm text-muted-foreground">
                        Computing settlement…
                    </div>
                )}

                {data && (
                    <div className="space-y-3 text-sm">
                        <Separator />

                        <div className="grid grid-cols-2 gap-2">
                            <div>Max Quote (INR)</div>
                            <div>{data.max_quote_inr ?? "—"}</div>

                            <div>Min Ask Total (INR)</div>
                            <div>{data.min_ask_total_inr ?? "—"}</div>

                            <div>Second Price (INR)</div>
                            <div>{data.second_price_inr ?? "—"}</div>

                            <div>Status</div>
                            <div>{data.status}</div>
                        </div>

                        <Separator />

                        <div className="text-xs text-muted-foreground">
                            Computed at: {data.computed_at_iso ?? "—"}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
