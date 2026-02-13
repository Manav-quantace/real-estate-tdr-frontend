import Link from "next/link";

type Props = {
    params: { workflow: string; projectId: string };
};

async function getCompensatoryEvents(workflow: string, projectId: string) {
    const res = await fetch(
        `${process.env.API_URL}/${workflow}/${projectId}/settlement/compensatory`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch compensatory events");
    }

    return res.json();
}

export default async function CompensatoryEventsPage({ params }: Props) {
    const data = await getCompensatoryEvents(
        params.workflow,
        params.projectId
    );

    return (
        <div className="rounded-2xl border p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        Compensatory Events — Second Bidding Rendering
                    </h1>
                    <div className="mt-1 text-xs text-slate-600">
                        workflow=<span className="font-mono">{data.workflow}</span> ·
                        project=<span className="font-mono">{data.project_id}</span> ·
                        published_at=<span className="font-mono">{data.published_at}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={data.audit_link}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Audit log
                    </Link>

                    <Link
                        href={`/${params.workflow}/${params.projectId}/settlement`}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Back to settlement
                    </Link>
                </div>
            </div>

            {/* Events */}
            <div className="mt-6 grid gap-3">
                {data.compensatory_events?.length ? (
                    data.compensatory_events.map((e: any, idx: number) => (
                        <div key={idx} className="rounded-2xl border p-4">
                            <div className="text-sm font-semibold">
                                Compensatory Event
                            </div>

                            <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px]">
                                {JSON.stringify(e, null, 2)}
                            </pre>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border p-4 text-sm text-slate-600">
                        No compensatory events returned by API.
                    </div>
                )}
            </div>
        </div>
    );
}
