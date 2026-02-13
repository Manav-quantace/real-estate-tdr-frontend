export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
            <div className="mx-auto max-w-7xl">
                <div className="animate-pulse rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-8 w-64 rounded bg-secondary"></div>
                            <div className="mt-2 h-4 w-48 rounded bg-secondary"></div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 w-32 rounded-lg bg-secondary"></div>
                            <div className="h-10 w-32 rounded-lg bg-secondary"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-secondary"></div>
                                    <div>
                                        <div className="h-6 w-48 rounded bg-secondary"></div>
                                        <div className="mt-2 h-4 w-64 rounded bg-secondary"></div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-9 w-20 rounded-lg bg-secondary"></div>
                                    <div className="h-9 w-20 rounded-lg bg-secondary"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
