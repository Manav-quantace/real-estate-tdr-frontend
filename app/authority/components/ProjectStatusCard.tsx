"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ProjectStatus = {
    round: number;
    settlement: string; // "settled" | "computed" | "not_computed"
    contractExists: boolean;
    ledgerEntries: number;
    chainValid: boolean;
};

export function ProjectStatusCard({ status }: { status: ProjectStatus }) {
    const isFinal =
        status.settlement === "settled" &&
        status.contractExists &&
        status.chainValid;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Project Economic Status
                    <Badge variant={isFinal ? "default" : "secondary"}>
                        {isFinal ? "ECONOMICALLY FINAL" : "IN PROGRESS"}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>Round</div>
                <div>{status.round}</div>

                <div>Settlement</div>
                <div className="font-mono">{status.settlement}</div>

                <div>Contract</div>
                <div>{status.contractExists ? "Created" : "Not created"}</div>

                <div>Ledger Entries</div>
                <div>{status.ledgerEntries}</div>

                <div>Ledger Integrity</div>
                <div>{status.chainValid ? "Valid" : "Broken"}</div>
            </CardContent>
        </Card>
    );
}

// keep default export for any code expecting default import
export default ProjectStatusCard;
