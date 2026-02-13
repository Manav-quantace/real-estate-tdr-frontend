"use client";

import { Badge } from "@/components/ui/badge";
import { PROJECT_PHASE_META, ProjectPhase } from "./project-phases";
import clsx from "clsx";

type Props = {
  phase: ProjectPhase;
};

export default function ProjectPhaseBadge({ phase }: Props) {
  const meta = PROJECT_PHASE_META[phase];

  const variantByTone: Record<
    typeof meta.tone,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    neutral: "outline",
    info: "secondary",
    success: "default",
    warning: "secondary",
    danger: "destructive",
    final: "default",
  };

  return (
    <Badge
      variant={variantByTone[meta.tone]}
      className={clsx(
        meta.tone === "final" && "bg-emerald-600 text-white",
        meta.tone === "success" && "bg-blue-600 text-white"
      )}
      title={meta.description}
    >
      {meta.label}
    </Badge>
  );
}
