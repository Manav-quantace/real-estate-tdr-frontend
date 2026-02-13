export default function StatsPanel({
    params_init,
    bidding_window,
}: {
    params_init: unknown;
    bidding_window: {
        current_round_t: number;
        window_status: string;
    };
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4 animate-fade-in">
                <div className="text-sm font-semibold">
                    Published Parameters
                </div>
                <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">
                    {JSON.stringify(params_init, null, 2)}
                </pre>
            </div>

            <div className="rounded-xl border p-4 animate-fade-in">
                <div className="text-sm font-semibold">Bidding Window</div>
                <div className="mt-2 text-sm text-slate-700">
                    Round:{" "}
                    <span className="font-mono">
                        {bidding_window.current_round_t}
                    </span>
                    <br />
                    Status:{" "}
                    <span className="font-mono">
                        {bidding_window.window_status}
                    </span>
                </div>
            </div>
        </div>
    );
}
