import Link from "next/link";

type Props = {
  params: { workflow: string; projectId: string };
  searchParams: {
    actor?: string;
    action?: string;
    from_iso?: string;
  };
};

async function getAudit(workflow: string, projectId: string) {
  const res = await fetch(
    `${process.env.API_URL}/${workflow}/${projectId}/ledger/audit`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch audit log");
  }

  return res.json();
}

export default async function AuditReportingHub({ params, searchParams }: Props) {
  const audit = await getAudit(params.workflow, params.projectId);

  return (
    <div className="rounded-2xl border p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Audit Logs — Ledger Reporting</h1>
          <div className="mt-1 text-xs text-slate-600">
            workflow=<span className="font-mono">{params.workflow}</span> ·
            project=<span className="font-mono">{params.projectId}</span>
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Immutable ledger view. Display-only.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${params.workflow}/${params.projectId}`}
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Back
          </Link>

          <a
            href={`/${params.workflow}/${params.projectId}/reports/audit.json`}
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Export JSON
          </a>

          <a
            href={`/${params.workflow}/${params.projectId}/reports/audit.csv`}
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Export CSV
          </a>
        </div>
      </div>

      {/* Filters (UI only, as per book) */}
      <div className="mt-6 rounded-2xl border p-4">
        <div className="text-sm font-semibold">UI Filters (non-binding)</div>

        <form method="get" className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            name="actor"
            defaultValue={searchParams.actor}
            placeholder="exchange / ledger / engine"
            className="rounded-xl border p-2 text-sm"
          />

          <input
            name="action"
            defaultValue={searchParams.action}
            placeholder="MATCHING_RUN / SETTLEMENT_RUN"
            className="rounded-xl border p-2 text-sm"
          />

          <input
            name="from_iso"
            defaultValue={searchParams.from_iso}
            placeholder="2025-01-01T00:00:00"
            className="rounded-xl border p-2 text-sm font-mono"
          />

          <div className="md:col-span-3 flex justify-end">
            <button className="rounded-2xl border px-4 py-2 text-sm">
              Apply (UI only)
            </button>
          </div>
        </form>
      </div>

      {/* Ledger Table */}
      <div className="mt-6 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-2 text-left text-xs">Timestamp</th>
              <th className="p-2 text-left text-xs">Actor</th>
              <th className="p-2 text-left text-xs">Action</th>
              <th className="p-2 text-left text-xs">Reference</th>
              <th className="p-2 text-left text-xs">Payload</th>
            </tr>
          </thead>

          <tbody>
            {audit.records.map((r: any, idx: number) => (
              <tr key={idx} className="border-b">
                <td className="p-2 font-mono text-xs">
                  {r.created_at || "—"}
                </td>
                <td className="p-2 font-mono text-xs">
                  {r.actor || "—"}
                </td>
                <td className="p-2 font-mono text-xs">
                  {r.action}
                </td>
                <td className="p-2 font-mono text-xs">
                  {r.ref_id || "—"}
                </td>
                <td className="p-2">
                  <pre className="max-w-[480px] overflow-auto rounded-lg bg-slate-50 p-2 text-[11px]">
                    {JSON.stringify(r.payload, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {audit.records.length === 0 && (
          <div className="p-4 text-sm text-slate-600">
            No audit records returned by API.
          </div>
        )}
      </div>
    </div>
  );
}
