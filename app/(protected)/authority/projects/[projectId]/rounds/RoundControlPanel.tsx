"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Round = {
    t: number;
    state: string;
    is_open: boolean;
    is_locked: boolean;
};

export default function RoundControlPanel({
    projectId,
    workflow,
    round,
}: {
    projectId: string;
    workflow: string;
    round: Round;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function action(
        action: "open" | "close" | "lock",
        payload: any
    ) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/authority/projects/${projectId}/rounds`,
                {
                    method: "POST",
                    body: JSON.stringify({ action, payload }),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            window.location.reload();
        } catch (e: any) {
            setError(e.message || "Action failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Round Control
                    <Badge>{round?.state ?? "none"}</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!round && (
                    <Button
                        disabled={loading}
                        onClick={() =>
                            action("open", { workflow })
                        }
                    >
                        Open First Round
                    </Button>
                )}

                {round && round.is_open && !round.is_locked && (
                    <Button
                        disabled={loading}
                        onClick={() =>
                            action("close", {
                                workflow,
                                t: round.t,
                            })
                        }
                    >
                        Close Round
                    </Button>
                )}

                {round && !round.is_open && !round.is_locked && (
                    <Button
                        disabled={loading}
                        onClick={() =>
                            action("lock", {
                                workflow,
                                t: round.t,
                            })
                        }
                    >
                        Lock Round
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
