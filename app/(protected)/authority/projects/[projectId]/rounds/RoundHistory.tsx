import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoundHistory({ rounds }: { rounds: any[] }) {
    if (!rounds.length) {
        return (
            <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                    No rounds created yet.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Round History</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {rounds.map((r) => (
                    <div
                        key={r.t}
                        className="flex items-center justify-between rounded border p-3 text-sm"
                    >
                        <div>
                            <div className="font-medium">Round {r.t}</div>
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
            </CardContent>
        </Card>
    );
}
