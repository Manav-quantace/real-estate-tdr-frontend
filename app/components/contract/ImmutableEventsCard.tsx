export default function ImmutableEventsCard({
  events,
}: {
  events: any;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm font-semibold">Immutable Events</div>
      <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-xs">
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  );
}
