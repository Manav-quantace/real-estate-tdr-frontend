export default function ObligationsCard({
  obligations,
}: {
  obligations: any;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm font-semibold">Obligations</div>
      <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-xs">
        {JSON.stringify(obligations, null, 2)}
      </pre>
    </div>
  );
}
