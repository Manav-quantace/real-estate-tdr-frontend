import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Contract = {
    contractId: string;
    version: number;
    priorContractId: string | null;
    settlementResultId: string;
    createdAtIso: string;
    contractHash: string;
    ownershipDetails: Record<string, any>;
    transactionData: Record<string, any>;
    legalObligations: Record<string, any>;
};

export default function ContractCard({ contracts }: { contracts: Contract[] }) {
    if (!contracts.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tokenized Contract</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    No contract exists yet. A contract is created only after a
                    settled round.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Tokenized Contract
                    <Badge variant="outline">
                        Version {contracts[0].version}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-sm">
                {contracts.map((c) => (
                    <div key={c.contractId} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Contract ID
                                </div>
                                <div className="font-mono break-all">
                                    {c.contractId}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Settlement Result
                                </div>
                                <div className="font-mono break-all">
                                    {c.settlementResultId}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Created At
                                </div>
                                <div>{c.createdAtIso}</div>
                            </div>

                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Contract Hash
                                </div>
                                <div className="font-mono break-all">
                                    {c.contractHash}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <Section title="Ownership Details" data={c.ownershipDetails} />
                        <Section title="Transaction Data" data={c.transactionData} />
                        <Section title="Legal Obligations" data={c.legalObligations} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function Section({
    title,
    data,
}: {
    title: string;
    data: Record<string, any>;
}) {
    return (
        <div className="space-y-2">
            <div className="font-medium">{title}</div>
            <pre className="rounded-md bg-muted p-3 text-xs overflow-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
