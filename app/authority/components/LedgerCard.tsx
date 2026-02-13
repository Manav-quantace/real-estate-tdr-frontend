"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type LedgerEntry = {
    seq: number;
    entry_type: string;
    contract_id: string;
    prev_hash: string;
    entry_hash: string;
    created_at: string;
    payload: Record<string, any>;
};

type LedgerVerify = {
    workflow: string;
    projectId: string;
    valid: boolean;
};

export default function LedgerCard({
    entries,
    verify,
}: {
    entries: LedgerEntry[];
    verify: LedgerVerify | null;
}) {
    const hasEntries = entries.length > 0;
    const isValid = verify?.valid ?? false;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Contract Ledger</span>
                    <div className="flex gap-2">
                        {verify && (
                            <Badge variant={isValid ? "default" : "destructive"}>
                                {isValid ? "HASH VERIFIED" : "TAMPERED"}
                            </Badge>
                        )}
                        <Badge variant={hasEntries ? "default" : "secondary"}>
                            {hasEntries ? "ACTIVE" : "EMPTY"}
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {verify && !isValid && (
                    <Alert variant="destructive">
                        <AlertTitle>Ledger Integrity Failure</AlertTitle>
                        <AlertDescription>
                            The hash-chain verification failed. This indicates
                            data mutation or corruption. Economic trust is broken.
                        </AlertDescription>
                    </Alert>
                )}

                {!hasEntries && (
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            This ledger is append-only and immutable.
                            No economic events have been finalized yet.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Settlement must be completed</li>
                            <li>Contracts are created only after settlement</li>
                            <li>Each event is hash-chained</li>
                        </ul>
                        <div className="rounded border bg-muted/40 p-3 text-xs">
                            Expected first entry:
                            <code className="ml-2 font-mono">
                                SETTLEMENT_EXECUTED
                            </code>
                        </div>
                    </div>
                )}

                {hasEntries && (
                    <ScrollArea className="h-[420px] pr-4">
                        <div className="space-y-4">
                            {entries.map((e, idx) => (
                                <div
                                    key={e.seq}
                                    className="rounded-lg border bg-card p-4 space-y-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="font-semibold">
                                            Entry #{e.seq}
                                        </div>
                                        <Badge variant="outline">
                                            {e.entry_type}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <Field label="Contract ID" value={e.contract_id} />
                                        <Field
                                            label="Created At"
                                            value={new Date(e.created_at).toISOString()}
                                        />
                                        <Field label="Prev Hash" value={e.prev_hash} mono />
                                        <Field label="Entry Hash" value={e.entry_hash} mono />
                                    </div>

                                    <Separator />

                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">
                                            Canonical Payload
                                        </div>
                                        <pre className="rounded bg-muted/40 p-3 text-xs overflow-x-auto">
                                            {JSON.stringify(e.payload, null, 2)}
                                        </pre>
                                    </div>

                                    {idx === 0 && (
                                        <div className="text-xs italic text-muted-foreground">
                                            Chained to genesis hash.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}

function Field({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div>
            <div className="text-muted-foreground">{label}</div>
            <div className={mono ? "font-mono break-all" : ""}>
                {value}
            </div>
        </div>
    );
}

