import Link from "next/link";
import { ClearLandItem } from "../types";

export default function ProjectCard({ item }: { item: ClearLandItem }) {
    const { project, parcel_size_sqm, size_band } = item;

    return (
        <div className="rounded-xl border p-4 transition hover:shadow-md hover:-translate-y-0.5">
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold">{project.title}</div>
                    <div className="text-xs text-slate-600">
                        {project.project_id} · {project.city} ·{" "}
                        {project.zone} · {project.status}
                    </div>

                    {(parcel_size_sqm || size_band) && (
                        <div className="mt-1 text-xs text-slate-500">
                            {parcel_size_sqm && `${parcel_size_sqm} sqm`}
                            {parcel_size_sqm && size_band && " · "}
                            {size_band && `Band ${size_band}`}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/clearland/projects/${project.project_id}`}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Details
                    </Link>
                    <Link
                        href={`/clearland/bidding/${project.project_id}`}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                        Bid
                    </Link>
                </div>
            </div>
        </div>
    );
}
