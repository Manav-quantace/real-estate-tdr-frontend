"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SettlementDiagnosticsCard({ data }: { data: any }) {
    const c = data.settlement_conditions;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    Settlement Diagnostics
                    <Badge variant={data.can_settle ? "default" : "destructive"}>
                        {data.can_settle ? "CAN SETTLE" : "BLOCKED"}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
                <Section label="Locked Quotes" ok={c.has_locked_quotes} />
                <Section label="Locked Asks" ok={c.has_locked_asks} />
                <Section label="Asks Have Total INR" ok={c.has_computable_asks} />
                <Section label="Price Crossed (Ask ≤ Quote)" ok={c.price_crossed} />
                <Section label="Second Price Exists" ok={c.has_second_price} />

                <Separator />

                <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </CardContent>
        </Card>
    );
}

function Section({ label, ok }: { label: string; ok: boolean }) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <Badge variant={ok ? "default" : "secondary"}>
                {ok ? "YES" : "NO"}
            </Badge>
        </div>
    );
}
