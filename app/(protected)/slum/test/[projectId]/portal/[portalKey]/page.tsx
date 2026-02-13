import Link from "next/link";

type PageProps = {
    params: {
        projectId: string;
        portalKey: string;
    };
};

type PortalResponse = {
    project: { project_id: string };
    portal_title: string;
    params_init: unknown;
};

export default async function SlumPortalEntry({ params }: PageProps) {
    const res = await fetch(
        `${process.env.API_URL}/slum/${params.projectId}/portal/${params.portalKey}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to load slum portal");
    }

    const data: PortalResponse = await res.json();

    return (
        <div className="rounded-2xl border p-5">
            <h1 className="text-xl font-semibold">Slum Portal</h1>

            <div className="mt-2 text-sm font-semibold">{data.portal_title}</div>

            <pre className="mt-6 rounded-xl bg-slate-50 p-3 text-xs">
                {JSON.stringify(data.params_init, null, 2)}
            </pre>

            <div className="mt-4 flex gap-2">
                <Link
                    href={`/slum/projects/${data.project.project_id}`}
                    className="rounded-2xl border px-3 py-2 text-sm"
                >
                    View project
                </Link>
                <Link
                    href="/slum/dashboard"
                    className="rounded-2xl border px-3 py-2 text-sm"
                >
                    Back
                </Link>
            </div>
        </div>
    );
}
