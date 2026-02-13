import Link from "next/link";

export default function Filters({
    filter_options,
    filters,
}: {
    filter_options: any;
    filters: any;
}) {
    return (
        <form className="grid gap-3 rounded-xl border p-4 md:grid-cols-4">
            {(["city", "zone", "band", "status"] as const).map((key) => (
                <select
                    key={key}
                    name={key}
                    defaultValue={filters[key] || ""}
                    className="rounded-lg border p-2 text-sm"
                >
                    <option value="">All</option>
                    {filter_options[`${key}s`].map((v: string) => (
                        <option key={v}>{v}</option>
                    ))}
                </select>
            ))}

            <div className="md:col-span-4 flex justify-end gap-2">
                <Link
                    href="/clearland/dashboard"
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
                >
                    Reset
                </Link>
                <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
                    Apply
                </button>
            </div>
        </form>
    );
}
