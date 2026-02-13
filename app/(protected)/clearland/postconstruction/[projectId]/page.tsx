"use client";

import { useState } from "react";
import Link from "next/link";

/* -----------------------------
   Minimal UI Types (frontend-only)
------------------------------ */

type Project = {
    project_id: string;
};

type Bundle = {
    bundle_id: string;
    label?: string;
    quantity?: number;
    unit?: string;
    price_hint?: number;
};

type BundlesResponse = {
    items: Bundle[];
};

type Props = {
    project: Project;
    bundles: BundlesResponse;
    current_t: number;
};

/* -----------------------------
   Component
------------------------------ */

export default function PostConstructionSale({
    project,
    bundles,
    current_t,
}: Props) {
    const [form] = useState<Record<string, unknown>>({});

    async function submit(action: "submit" | "save_draft") {
        await fetch("/api/bids/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, action }),
        });
    }

    return (
        <div className="rounded-2xl border p-5">
            {/* Header */}
            <div className="flex justify-between">
                <div>
                    <h1 className="text-xl font-semibold">
                        Clear Land — Post-Construction Bundle Sale
                    </h1>
                    <div className="text-xs text-slate-600">
                        Project ID:{" "}
                        <span className="font-mono">{project.project_id}</span> · Round t:{" "}
                        <span className="font-mono">{current_t}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/clearland/projects/${project.project_id}`}
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        View project
                    </Link>

                    <Link
                        href="/clearland/dashboard"
                        className="rounded-2xl border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Back
                    </Link>
                </div>
            </div>

            {/* Bundles (display-only) */}
            <div className="mt-4 grid gap-3">
                {bundles.items.length === 0 && (
                    <div className="rounded-2xl border p-4 text-sm text-slate-600">
                        No bundles available for sale.
                    </div>
                )}

                {bundles.items.map((b: Bundle) => (
                    <div key={b.bundle_id} className="rounded-2xl border p-4">
                        <div className="text-sm font-semibold">
                            {b.label || "Bundle"}
                        </div>

                        <div className="mt-1 text-xs text-slate-600 font-mono">
                            bundle_id={b.bundle_id}
                        </div>

                        <div className="mt-2 text-xs text-slate-700">
                            {b.quantity !== undefined && (
                                <div>
                                    Quantity:{" "}
                                    <span className="font-mono">
                                        {b.quantity} {b.unit || ""}
                                    </span>
                                </div>
                            )}

                            {b.price_hint !== undefined && (
                                <div>
                                    Price hint:{" "}
                                    <span className="font-mono">₹{b.price_hint}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit */}
            <div className="mt-6 rounded-2xl border p-4">
                <div className="text-sm font-semibold">
                    Submit Quote Bid (display-only UI)
                </div>

                <div className="mt-2 text-xs text-slate-600">
                    This action submits a quote reference to the backend.
                    No pricing or logic is computed in the frontend.
                </div>

                <button
                    onClick={() => submit("submit")}
                    className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white"
                >
                    Submit Quote
                </button>
            </div>
        </div>
    );
}
