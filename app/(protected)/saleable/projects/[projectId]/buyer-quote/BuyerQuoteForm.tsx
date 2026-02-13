"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import SettlementResultCard from "./SettlementResultCard";

type BuyerQuote = {
    qbundle_inr?: number | null;
    state?: string | null;
};

type Round = {
    t: number;
    is_open: boolean;
    is_locked: boolean;
    state: string;
    bidding_window_start?: string | null;
    bidding_window_end?: string | null;
};

type RoundHistoryItem = {
    t: number;
    state: string;
    is_open?: boolean | null;
    is_locked?: boolean | null;
    bidding_window_start?: string | null;
    bidding_window_end?: string | null;
};

export default function BuyerQuoteForm({ projectId }: { projectId: string }) {
    const { toast } = useToast();

    const [round, setRound] = useState<Round | null>(null);
    const [quote, setQuote] = useState<BuyerQuote | null>(null);
    const [bundle, setBundle] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<RoundHistoryItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [settlement, setSettlement] = useState<any | null>(null);

    /* ─────────────────────────────
       Load current round
    ───────────────────────────── */
    useEffect(() => {
        async function loadRound() {
            try {
                const res = await api.getCurrentRound("saleable", projectId);
                setRound(res?.current ?? null);
            } catch (e) {
                setError("Failed to load current round.");
            }
        }
        loadRound();
    }, [projectId]);

    /* ─────────────────────────────
       Load round history
    ───────────────────────────── */
    useEffect(() => {
        async function loadHistory() {
            try {
                const qp = new URLSearchParams({ workflow: "saleable", projectId });
                const res = await fetch(`/api/rounds?${qp.toString()}`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    setHistory(null);
                    return;
                }
                const rows = await res.json();
                setHistory(rows ?? null);
            } catch {
                setHistory(null);
            }
        }
        loadHistory();
    }, [projectId]);

    /* ─────────────────────────────
       Load latest quote for round
    ───────────────────────────── */
    useEffect(() => {
        if (!round) return;
        const currentRound = round;

        async function loadQuote() {
            try {
                const res = await api.getMyBuyerQuote(projectId, currentRound.t);
                const latest =
                    Array.isArray(res) && res.length > 0 ? res[0] : null;

                if (latest) {
                    setQuote({
                        qbundle_inr: latest.payload?.qbundle_inr ?? null,
                        state: latest.state,
                    });
                    setBundle(String(latest.payload?.qbundle_inr ?? ""));
                } else {
                    setQuote(null);
                    setBundle("");
                }
            } catch {
                setQuote(null);
                setBundle("");
            }
        }

        loadQuote();
    }, [round, projectId]);

    /* ─────────────────────────────
       Derived helpers
    ───────────────────────────── */
    const canBid = Boolean(round && round.is_open && !round.is_locked);
    const quoteState = quote?.state ?? null;
    const hasQuote =
        quote?.qbundle_inr !== undefined && quote?.qbundle_inr !== null;

    function humanRoundStatus(r: Round | null) {
        if (!r) return "NO ROUND";
        if (r.is_locked) return "LOCKED";
        if (r.is_open) return "OPEN";
        return "CLOSED";
    }

    /* ─────────────────────────────
       Submit / Save
    ───────────────────────────── */
    async function submit(action: "save" | "submit") {
        if (!round) return;

        const numeric = Number(bundle);
        if (Number.isNaN(numeric) || numeric <= 0) {
            toast({
                title: "Enter a valid positive quote amount",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            await api.upsertBuyerQuote(projectId, {
                t: round.t,
                qbundle_inr: numeric,
                action,
            });

            const refreshed = await api.getMyBuyerQuote(projectId, round.t);
            const latest =
                Array.isArray(refreshed) && refreshed.length > 0
                    ? refreshed[0]
                    : null;

            if (latest) {
                setQuote({
                    qbundle_inr: latest.payload?.qbundle_inr ?? null,
                    state: latest.state,
                });
                setBundle(String(latest.payload?.qbundle_inr ?? ""));
            }

            toast({
                title:
                    action === "submit"
                        ? "Quote submitted"
                        : "Draft saved",
            });
        } catch (err: any) {
            toast({
                title: "Failed",
                description: err?.message ?? "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    /* ─────────────────────────────
       Render
    ───────────────────────────── */
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!round) {
        return <div className="text-sm text-muted-foreground">Loading round…</div>;
    }

    return (
        <div className="space-y-6 ">
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div>
                            Buyer Quote
                            <div className="text-xs text-muted-foreground">
                                Project: <span className="font-mono">{projectId}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm">Round {round.t}</div>
                            <Badge>{humanRoundStatus(round)}</Badge>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Round meta */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Round</strong></div>
                        <div>{round.t}</div>

                        <div><strong>Open</strong></div>
                        <div>{round.is_open ? "Yes" : "No"}</div>

                        <div><strong>Locked</strong></div>
                        <div>{round.is_locked ? "Yes" : "No"}</div>

                        <div><strong>Bidding window</strong></div>
                        <div>
                            {round.bidding_window_start || "—"} →{" "}
                            {round.bidding_window_end || "—"}
                        </div>
                    </div>

                    <Separator />

                    {!canBid && (
                        <Alert>
                            <AlertTitle>Bidding unavailable</AlertTitle>
                            <AlertDescription>
                                {round.is_locked
                                    ? "This round is locked — you cannot change or submit quotes now."
                                    : "Bidding is currently closed for this round."}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Quote summary */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">Your quote</div>
                            <div className="text-xs text-muted-foreground">
                                Round {round.t}
                            </div>
                        </div>

                        {hasQuote ? (
                            <div className="grid grid-cols-2 gap-2">
                                <div><strong>Amount (INR)</strong></div>
                                <div className="font-mono">
                                    {quote?.qbundle_inr}
                                </div>

                                <div><strong>Status</strong></div>
                                <div>{quoteState}</div>
                            </div>
                        ) : (
                            <Alert>
                                <AlertTitle>No quote yet</AlertTitle>
                                <AlertDescription>
                                    You haven’t placed a quote for this round yet.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <Separator />

                    {/* Round history */}
                    <div>
                        <div className="text-sm font-medium mb-2">Round History</div>

                        {history === null ? (
                            <div className="text-xs text-muted-foreground">
                                Round history not available.
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-xs text-muted-foreground">
                                No rounds yet.
                            </div>
                        ) : (
                            <div className="space-y-2 text-sm">
                                {history.slice().reverse().map((r) => (
                                    <div
                                        key={r.t}
                                        className="flex items-center justify-between rounded border p-2"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                Round {r.t}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {r.bidding_window_start || "—"} →{" "}
                                                {r.bidding_window_end || "—"}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                r.state === "locked"
                                                    ? "destructive"
                                                    : r.is_open
                                                        ? "default"
                                                        : "secondary"
                                            }
                                        >
                                            {r.state.toUpperCase()}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex gap-3 justify-between">
                    <div className="text-xs text-muted-foreground">
                        {quoteState === "submitted"
                            ? "Quote submitted and locked."
                            : "You can edit while round is OPEN and not locked."}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            className="w-44"
                            type="number"
                            value={bundle}
                            onChange={(e) => setBundle(e.target.value)}
                            disabled={!canBid || quoteState === "submitted"}
                        />

                        {canBid && quoteState !== "submitted" && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => submit("save")}
                                    disabled={loading}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    onClick={() => submit("submit")}
                                    disabled={loading}
                                >
                                    Submit Quote
                                </Button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>
            {/* 🔔 Settlement (automatic) */}
            {round.is_locked && settlement && (
                <SettlementResultCard data={settlement} />
            )}

        </div>
    );
}
