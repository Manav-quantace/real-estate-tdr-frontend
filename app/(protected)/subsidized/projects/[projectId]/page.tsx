import Link from "next/link";

type PageProps = {
    params: {
        projectId: string;
    };
};

type ProjectResponse = {
    project: {
        project_id: string;
        title: string;
        category: string;
        status: string;
        valuer_valuation: {
            status: string;
            value_inr?: number | null;
            valuer_id?: string | null;
            updated_at: string;
        };
    };
};

export default async function SubsidizedProjectDetail({ params }: PageProps) {
    const res = await fetch(
        `${process.env.API_URL}/subsidized/projects/${params.projectId}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to load subsidized project");
    }

    const { project }: ProjectResponse = await res.json();

    return (
        <div className="rounded-2xl border p-5">
            <div className="flex justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">{project.title}</h1>
                    <div className="mt-1 text-xs text-slate-600">
                        Project ID:{" "}
                        <span className="font-mono">{project.project_id}</span> · Category:{" "}
                        <span className="font-mono">{project.category}</span> · Status:{" "}
                        <span className="font-mono">{project.status}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/subsidized/${project.project_id}/bidding`}
                        className="rounded-2xl border px-3 py-2 text-sm"
                    >
                        Go to bidding
                    </Link>
                    <Link
                        href={`/subsidized/${project.project_id}/settlement`}
                        className="rounded-2xl border px-3 py-2 text-sm"
                    >
                        Go to settlement
                    </Link>
                    <Link
                        href="/subsidized/dashboard"
                        className="rounded-2xl border px-3 py-2 text-sm"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">
                    <div className="text-sm font-semibold">
                        Independent Valuer Valuation
                    </div>
                    <div className="mt-3 rounded-2xl border bg-white p-3 text-xs">
                        <div className="font-mono">
                            status={project.valuer_valuation.status}
                            <br />
                            value_inr={project.valuer_valuation.value_inr ?? "—"}
                            <br />
                            valuer_id={project.valuer_valuation.valuer_id ?? "—"}
                            <br />
                            updated_at={project.valuer_valuation.updated_at}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border p-4">
                    <div className="text-sm font-semibold">Project metadata</div>
                    <pre className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
                        {JSON.stringify(project, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
