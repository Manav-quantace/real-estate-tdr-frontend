//app/(protected)/subsidized/dashboard/Dashboard.tsx
'use client';

import Link from "next/link";

type Role = "GOV_AUTHORITY" | "AUDITOR" | "DEVELOPER" | "BUYER";

type RoundInfo = {
    t: number;
    state: "new" | "open" | "closed" | "locked";
    is_open: boolean;
    is_locked: boolean;
};

type ValuerValuation = {
    status: string;
    value_inr?: number | null;
    updated_at: string;
};

type SubsidizedProject = {
    project_id: string;
    title: string;
    category: string;
    city: string;
    zone: string;
    status: string;
    valuer_valuation: ValuerValuation;
    current_round?: RoundInfo | null;
};

export default function Dashboard({
    role,
    items,
}: {
    role: Role;
    items: SubsidizedProject[];
}) {
    return (
        <div className="rounded-2xl border p-5 space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-xl font-semibold">
                        Subsidized Redevelopment — Dashboard
                    </h1>
                    <p className="text-sm text-slate-600">
                        Role: <span className="font-mono">{role}</span>
                    </p>
                </div>

                <Link
                    href="/workflow/select"
                    className="rounded-xl border px-3 py-2 text-sm"
                >
                    Change workflow
                </Link>
            </div>

            {items.length === 0 && (
                <div className="rounded-xl border p-4 text-sm text-slate-600">
                    No subsidized projects available.
                </div>
            )}

            <div className="grid gap-4">
                {items.map((p) => {
                    const round = p.current_round;
                    const roundLocked = round?.is_locked;

                    return (
                        <div
                            key={p.project_id}
                            className="rounded-2xl border p-4 space-y-3"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-base font-semibold">
                                        {p.title}
                                    </div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        {p.category} · {p.city} · {p.zone}
                                    </div>
                                    {round && (
                                        <div className="mt-1 text-xs">
                                            Round t={round.t} ·{" "}
                                            <span className="font-mono">
                                                {round.state}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {role === "GOV_AUTHORITY" && (
                                        <>
                                            <Link
                                                href={`/authority/subsidized/projects/${p.project_id}/rounds`}
                                                className="btn"
                                            >
                                                Rounds
                                            </Link>
                                            <Link
                                                href={`/authority/subsidized/projects/${p.project_id}/inventory`}
                                                className="btn"
                                            >
                                                Inventory
                                            </Link>
                                            <Link
                                                href={`/authority/subsidized/projects/${p.project_id}/government-charges`}
                                                className="btn"
                                            >
                                                Govt Charges
                                            </Link>
                                        </>
                                    )}

                                    {role === "DEVELOPER" && (
                                        <Link
                                            href={`/subsidized/projects/${p.project_id}/ask`}
                                            className="btn"
                                        >
                                            Your Ask
                                        </Link>
                                    )}

                                    {role === "BUYER" && (
                                        <Link
                                            href={`/subsidized/projects/${p.project_id}/quote`}
                                            className="btn"
                                        >
                                            Your Quote
                                        </Link>
                                    )}

                                    {roundLocked && (
                                        <Link
                                            href={`/subsidized/projects/${p.project_id}/settlement`}
                                            className="btn"
                                        >
                                            Settlement
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border bg-slate-50 p-3 text-xs">
                                <div className="font-semibold">
                                    Independent Valuer
                                </div>
                                <div className="font-mono mt-1">
                                    status={p.valuer_valuation.status}
                                    <br />
                                    value_inr={p.valuer_valuation.value_inr ?? "—"}
                                    <br />
                                    updated_at={p.valuer_valuation.updated_at}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .btn {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem;
                    padding: 0.4rem 0.75rem;
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
}
