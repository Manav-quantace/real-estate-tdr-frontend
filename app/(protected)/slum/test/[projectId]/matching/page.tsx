//app/(protected)/slum/[projectId]/matching/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
    project: { project_id: string };
    dweller_id: string;
    current_t: number;
    rights: unknown;
    status?: unknown;
};

export default function SlumDwellerPortal({
    project,
    dweller_id,
    current_t,
    rights,
}: Props) {
    const [form] = useState<Record<string, unknown>>({});

    async function submit(action: "save_draft" | "submit") {
        await fetch("/api/bids/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, action }),
        });
    }

    return (
        <div className="rounded-2xl border p-5">
            <div className="flex justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        Slum Dweller Portal — Rights + Preferences
                    </h1>
                    <div className="text-xs text-slate-600">
                        Project ID: <span className="font-mono">{project.project_id}</span> ·
                        Dweller ID: <span className="font-mono">{dweller_id}</span> ·
                        Round (t): <span className="font-mono">{current_t}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/slum/projects/${project.project_id}`}
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

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">
                    <div className="text-sm font-semibold">
                        Your tokenized rights record (read-only)
                    </div>
                    <pre className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
                        {JSON.stringify(rights, null, 2)}
                    </pre>
                </div>

                <div className="rounded-2xl border p-4">
                    <div className="text-sm font-semibold">
                        Submit preferences (display-only)
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => submit("save_draft")}
                            className="rounded-2xl border px-4 py-2 text-sm"
                        >
                            Save draft
                        </button>
                        <button
                            onClick={() => submit("submit")}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white"
                        >
                            Submit (POST /bids/preferences)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
