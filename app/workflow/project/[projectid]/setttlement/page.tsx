import Link from "next/link";

type Props = {
    params: { workflow: string; projectId: string };
};

async function getSettlement(workflow: string, projectId: string) {
    const res = await fetch(
        `${process.env.API_URL}/${workflow}/${projectId}/settlement`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch settlement");
    }

    return res.json();
}

export default async function SettlementPage({ params }: Props) {
    const settlement = await getSettlement(params.workflow, params.projectId);

    return (
        <div className="rounded-2xl border p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Settlement — Vickrey Output</h1>
                    <div className="mt-1 text-xs text-slate-600">
                        workflow=<span className="font-mono">{settlement.workflow}</span> ·
                        project=<span className="font-mono">{settlement.project_id}</span> ·
                        published_at=<span className="font-mono">{settlement.published_at}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={settlement.links.penalty}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Penalty events
                    </Link>

                    <Link
                        href={settlement.links.compensatory}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Compensatory events
                    </Link>

                    <Link
                        href={settlement.links.audit}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Audit log
                    </Link>

                    <Link
                        href={`/${params.workflow}/${params.projectId}`}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Back
                    </Link>
                </div>
            </div>

            {/* Settlement Body */}
            {settlement.vickrey ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">

                    {/* Winners */}
                    <div className="rounded-2xl border p-4">
                        <div className="text-sm font-semibold">Vickrey Winners</div>
                        <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px]">
                            {JSON.stringify(settlement.vickrey.winners, null, 2)}
                        </pre>
                    </div>

                    {/* Second price */}
                    <div className="rounded-2xl border p-4">
                        <div className="text-sm font-semibold">Second-price payments</div>
                        <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px]">
                            {JSON.stringify(settlement.vickrey.second_price, null, 2)}
                        </pre>
                    </div>

                    {/* Receipts */}
                    <div className="rounded-2xl border p-4">
                        <div className="text-sm font-semibold">Settlement receipts</div>
                        <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px]">
                            {JSON.stringify(settlement.vickrey.receipts, null, 2)}
                        </pre>
                    </div>

                    {/* Status */}
                    <div className="rounded-2xl border p-4">
                        <div className="text-sm font-semibold">Settlement status</div>
                        <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px]">
                            {JSON.stringify(settlement.settlement_status, null, 2)}
                        </pre>
                    </div>

                </div>
            ) : (
                <div className="mt-6 rounded-2xl border p-4 text-sm text-slate-600">
                    No settlement result returned by API.
                </div>
            )}

            <div className="mt-6 text-[11px] text-slate-500">
                Display-only: winners, second-price payments, receipts, and readiness
                status are rendered exactly as returned by the API.
            </div>
        </div>
    );
}
