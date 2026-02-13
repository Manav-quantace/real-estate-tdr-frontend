type Props = {
    readiness: {
        status: string;
        checks?: { check: string; status: string }[];
        notes?: string;
    };
};

export default function SettlementReadinessPanel({ readiness }: Props) {
    return (
        <div className="rounded-2xl border p-4">
            <div className="text-sm font-semibold">Settlement readiness</div>

            <div className="mt-2 text-sm">
                Status: <span className="font-mono">{readiness.status}</span>
            </div>

            {readiness.checks?.length && (
                <div className="mt-3">
                    <div className="text-xs font-semibold">Checks</div>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                        {readiness.checks.map((c, i) => (
                            <div key={i} className="rounded-2xl border bg-white p-3 text-xs">
                                <div className="font-mono">{c.check}</div>
                                <div className="mt-1 font-mono">status={c.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {readiness.notes && (
                <div className="mt-3 text-xs text-slate-600">
                    {readiness.notes}
                </div>
            )}
        </div>
    );
}
