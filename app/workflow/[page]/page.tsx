import Link from "next/link";

type Props = {
  params: { workflow: string; page: string };
};

export default function WorkflowPlaceholder({ params }: Props) {
  const navItems = [
    { label: "dashboard", href: `/${params.workflow}/dashboard` },
    { label: "settlement", href: `/${params.workflow}/settlement` },
    { label: "audit", href: `/${params.workflow}/reports/audit` },
  ];

  return (
    <>
      <div className="flex justify-between rounded-2xl border p-4">
        <div>
          <div className="text-sm font-semibold">
            Real Estate and TDR Exchange
          </div>
          <div className="text-xs text-slate-600">
            {params.workflow.toUpperCase()}
          </div>
        </div>

        <form method="post" action="/workflow/clear">
          <button className="rounded-2xl border px-3 py-1.5 text-sm">
            Change workflow
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {navItems.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-2xl border px-3 py-2 text-sm"
          >
            {n.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          {params.workflow} — {params.page}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Placeholder screen (Part 1 scaffold only). No bidding logic implemented yet.
        </p>
      </div>
    </>
  );
}
