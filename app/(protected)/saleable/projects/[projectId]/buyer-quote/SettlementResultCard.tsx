import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
    data: {
        status: string;
        settled: boolean;
        winner_quote_bid_id: string | null;
        winning_ask_bid_id: string | null;
        second_price_inr: string | null;
        max_quote_inr: string | null;
        min_ask_total_inr: string | null;
        receipt?: any;
    };
};

export default function SettlementResultCard({ data }: Props) {
    return (
        <Card className="border-green-500/40">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Settlement Result
                    <Badge variant={data.settled ? "default" : "secondary"}>
                        {data.settled ? "SETTLED" : "NO SETTLEMENT"}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div>Status</div>
                    <div className="font-mono">{data.status}</div>

                    <div>Your Quote</div>
                    <div className="font-mono">
                        {data.winner_quote_bid_id ?? "—"}
                    </div>

                    <div>Winning Ask</div>
                    <div className="font-mono">
                        {data.winning_ask_bid_id ?? "—"}
                    </div>

                    <div>Max Quote (INR)</div>
                    <div>{data.max_quote_inr ?? "—"}</div>

                    <div>Min Ask Total (INR)</div>
                    <div>{data.min_ask_total_inr ?? "—"}</div>

                    <div>Second Price (INR)</div>
                    <div>{data.second_price_inr ?? "—"}</div>
                </div>

                {data.receipt && (
                    <>
                        <Separator />
                        <pre className="text-xs bg-muted/40 p-3 rounded overflow-auto">
                            {JSON.stringify(data.receipt, null, 2)}
                        </pre>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
