//app/authority/projects/[projectId]/rounds/AuthorityRoundControl.tsx
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SettlementOverlay from "@/app/(protected)/authority/components/SettlementOverlay";

type Props = {
    projectId: string;
    workflow: string;
    round: {
        t: number;
        is_open: boolean;
        is_locked: boolean;
        state: string;
    };
};

export default function AuthorityRoundControls({
    projectId,
    workflow,
    round,
}: Props) {
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [showSettlement, setShowSettlement] = useState(false);

    async function openNextRound() {
        setLoading(true);
        try {
            await api.openRound(workflow, projectId);
            toast({ title: "Next round opened" });
            window.location.reload();
        } catch (e: any) {
            toast({
                title: "Failed to open next round",
                description: e?.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function closeRound() {
        setLoading(true);
        try {
            await api.closeRound(workflow, projectId, round.t);
            toast({ title: "Round closed" });
            window.location.reload();
        } catch (e: any) {
            toast({
                title: "Failed to close round",
                description: e?.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function lockRound() {
        setLoading(true);
        try {
            await api.lockRound(workflow, projectId, round.t);
            toast({ title: "Round locked & settlement computed" });

            // Settlement is automatic → show overlay
            setShowSettlement(true);
        } catch (e: any) {
            toast({
                title: "Failed to lock round",
                description: e?.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Authority Actions</CardTitle>
                </CardHeader>

                <CardContent className="flex gap-3 flex-wrap">
                    {/* 1️⃣ Round not opened yet */}
                    {!round.is_open && !round.is_locked && (
                        <>
                            <Button onClick={openNextRound} disabled={loading}>
                                Open Round
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={lockRound}
                                disabled={loading}
                            >
                                Lock Round & Settle
                            </Button>
                        </>
                    )}

                    {/* 2️⃣ Round is open */}
                    {round.is_open && !round.is_locked && (
                        <Button
                            variant="outline"
                            onClick={closeRound}
                            disabled={loading}
                        >
                            Close Round
                        </Button>
                    )}

                    {/* 3️⃣ Round is locked → allow next round */}
                    {round.is_locked && (
                        <Button onClick={openNextRound} disabled={loading}>
                            Open Next Round
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* 🔔 Settlement Overlay */}
            <SettlementOverlay
                open={showSettlement}
                onClose={() => {
                    setShowSettlement(false);
                    window.location.reload();
                }}
                workflow={workflow}
                projectId={projectId}
                t={round.t}
            />
        </>
    );
}
