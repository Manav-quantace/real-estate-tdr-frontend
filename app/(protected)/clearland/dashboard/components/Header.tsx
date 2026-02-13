import Link from "next/link";

export default function Header() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Clear Land Dashboard
                </h1>
                <p className="text-sm text-slate-600">
                    Parcels available for new construction
                </p>
            </div>

            <Link
                href="/"
                className="rounded-xl border px-4 py-2 text-sm transition hover:bg-slate-50"
            >
                Change workflow
            </Link>
        </div>
    );
}
