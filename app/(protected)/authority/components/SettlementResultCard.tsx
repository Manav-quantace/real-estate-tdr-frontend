import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
    data: any;
};

export default function SettlementResultCard({ data }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Settlement Result</span>
                    <Badge variant={data.settled ? "default" : "secondary"}>
                        {data.settled ? "SETTLED" : "NOT SETTLED"}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <div><strong>Status:</strong> {data.status}</div>
                <div><strong>Winner Quote Bid:</strong> {data.winner_quote_bid_id ?? "-"}</div>
                <div><strong>Winning Ask Bid:</strong> {data.winning_ask_bid_id ?? "-"}</div>
                <div><strong>Second Price Quote:</strong> {data.second_price_quote_bid_id ?? "-"}</div>
                <div><strong>Second Price (₹):</strong> {data.second_price_inr ?? "-"}</div>

                {data.receipt && (
                    <div className="pt-2">
                        <strong>Receipt</strong>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-x-auto">
                            {JSON.stringify(data.receipt, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
