export default function OwnershipCard({
  ownership,
}: {
  ownership: any;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm font-semibold">Ownership</div>
      <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-xs">
        {JSON.stringify(ownership, null, 2)}
      </pre>
    </div>
  );
}
