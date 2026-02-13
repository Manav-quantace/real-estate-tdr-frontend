import Link from "next/link";
import { Building2, MapPin, Calendar, ExternalLink, Edit3 } from "lucide-react";
import { ProjectPhaseBadge } from "@/app/components/lifecycle";

export default function ProjectCard({
  project,
}: {
  project: {
    project_id: string;
    title: string;
    city?: string;
    zone?: string;
    status?: "active" | "pending" | "completed" | "draft";
    created_at?: string;
  };
}) {
  /**
   * NOTE:
   * Dashboard does not know round/matching/settlement.
   * We map ONLY high-level project truth here.
   */
  const phase =
    project.status === "draft" ? "DRAFT" : "PUBLISHED";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-pretty text-lg font-semibold leading-snug text-card-foreground group-hover:text-primary">
                  {project.title}
                </h3>

                {/* ✅ Lifecycle badge (STEP 1 vocabulary) */}
                <ProjectPhaseBadge phase={phase} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-[10px] opacity-60">ID:</span>
                  {project.project_id}
                </span>

                {project.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {project.city}
                  </span>
                )}

                {project.zone && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-xs opacity-60">Zone:</span>
                    {project.zone}
                  </span>
                )}

                {project.created_at && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/saleable/projects/${project.project_id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <ExternalLink className="size-4" />
            View
          </Link>

          <Link
            href={`/saleable/projects/${project.project_id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Edit3 className="size-4" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
