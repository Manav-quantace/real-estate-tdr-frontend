import ImmutableEventsCard from "@/app/components/contract/ImmutableEventsCard";
import ObligationsCard from "@/app/components/contract/ObligationCard";
import OwnershipCard from "@/app/components/contract/OwnershipCard";
import TransactionCard from "@/app/components/contract/TransactionCard";
import Link from "next/link";


type Props = {
    params: { workflow: string; projectId: string };
};

async function getContract(workflow: string, projectId: string) {
    const res = await fetch(
        `${process.env.API_URL}/${workflow}/${projectId}/contracts/view`,
        { cache: "no-store" }
    );
    return res.json();
}

export default async function ContractViewer({ params }: Props) {
    const data = await getContract(params.workflow, params.projectId);
    const record = data.record;

    return (
        <div className="rounded-2xl border p-6">
            <div className="flex justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Tokenized Contract Viewer</h1>
                    <div className="mt-1 text-xs text-slate-600">
                        workflow=<span className="font-mono">{data.workflow}</span> ·
                        project=<span className="font-mono">{data.project_id}</span> ·
                        published_at=<span className="font-mono">{data.published_at}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                        contract_id=<span className="font-mono">{record.contract_id}</span> ·
                        version=<span className="font-mono">{record.version}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link href={data.links.settlement} className="rounded-2xl border px-3 py-2 text-sm">
                        Settlement
                    </Link>
                    <Link href={data.links.audit} className="rounded-2xl border px-3 py-2 text-sm">
                        Audit log
                    </Link>

                    <a
                        href={`/${data.workflow}/${data.project_id}/reports/contract.json`}
                        className="rounded-2xl border px-3 py-2 text-sm"
                    >
                        Export contract JSON
                    </a>
                    <a
                        href={`/${data.workflow}/${data.project_id}/reports/contract.csv`}
                        className="rounded-2xl border px-3 py-2 text-sm"
                    >
                        Export contract CSV
                    </a>

                    <Link href={data.links.back} className="rounded-2xl border px-3 py-2 text-sm">
                        Back
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <OwnershipCard ownership={record.ownership_details} />
                <TransactionCard tx={record.transaction_data} />
                <ObligationsCard obligations={record.obligations} />
                <ImmutableEventsCard events={record.immutable_event_logs} />
            </div>

            <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-xs">
                <div className="font-semibold">
                    Raw tokenized contract record (API output)
                </div>
                <pre className="mt-2 overflow-auto rounded-xl bg-white p-3 text-[11px]">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    );
}
