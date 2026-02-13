import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
    data: any;
};

export default function MatchingResultCard({ data }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Matching Result</span>
                    <Badge variant={data.matched ? "default" : "secondary"}>
                        {data.matched ? "MATCHED" : "NOT MATCHED"}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <div><strong>Status:</strong> {data.status}</div>
                <div><strong>Round:</strong> {data.t}</div>
                <div><strong>Min Ask (₹):</strong> {data.min_ask_total_inr ?? "-"}</div>
                <div><strong>Max Quote (₹):</strong> {data.max_quote_inr ?? "-"}</div>
                <div><strong>Selected Ask Bid:</strong> {data.selected_ask_bid_id ?? "-"}</div>
                <div><strong>Selected Quote Bid:</strong> {data.selected_quote_bid_id ?? "-"}</div>

                {data.notes && (
                    <div className="pt-2">
                        <strong>Notes</strong>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-x-auto">
                            {JSON.stringify(data.notes, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
