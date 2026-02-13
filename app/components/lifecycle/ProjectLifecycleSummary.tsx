"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectPhaseBadge from "./ProjectPhaseBadge";
import { PROJECT_PHASE_META, ProjectPhase } from "./project-phases";

type Props = {
    phase: ProjectPhase;

    // Optional contextual info (safe, read-only)
    roundInfo?: {
        t: number;
        bidding_window_start?: string | null;
        bidding_window_end?: string | null;
    };

    role: "BUYER" | "DEVELOPER" | "GOV_AUTHORITY" | "AUDITOR";
};

export default function ProjectLifecycleSummary({
    phase,
    roundInfo,
    role,
}: Props) {
    const meta = PROJECT_PHASE_META[phase];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                    Project Status
                </CardTitle>
                <ProjectPhaseBadge phase={phase} />
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
                {/* Primary message */}
                <p className="text-muted-foreground">{meta.description}</p>

                {/* Round context */}
                {roundInfo && (
                    <div className="rounded-md border bg-muted/30 p-3 space-y-1">
                        <div>
                            <strong>Round</strong>: t = {roundInfo.t}
                        </div>
                        {roundInfo.bidding_window_start && (
                            <div>
                                <strong>Opens</strong>: {roundInfo.bidding_window_start}
                            </div>
                        )}
                        {roundInfo.bidding_window_end && (
                            <div>
                                <strong>Closes</strong>: {roundInfo.bidding_window_end}
                            </div>
                        )}
                    </div>
                )}

                {/* Role-based permission hint */}
                <div className="text-xs text-muted-foreground">
                    {roleHint(role, phase)}
                </div>

                {/* Irreversibility warning */}
                {phase === "ROUND_LOCKED" ||
                    phase === "MATCHING_COMPUTED" ||
                    phase === "SETTLEMENT_COMPUTED" ||
                    phase === "FINALIZED" ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs">
                        ⚠️ Actions affecting economic outcomes are irreversible at this
                        stage.
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

/* --------------------------------------------------
   Role-aware explanation (UI text only)
-------------------------------------------------- */

function roleHint(role: Props["role"], phase: ProjectPhase): string {
    switch (role) {
        case "BUYER":
            if (phase === "ROUND_OPEN")
                return "You may submit or update your quote during the open bidding window.";
            if (phase === "ROUND_CLOSED" || phase === "ROUND_LOCKED")
                return "Quote submission is closed for this round.";
            return "You can view project details and results.";

        case "DEVELOPER":
            if (phase === "ROUND_OPEN")
                return "You may submit or update your development ask during the open bidding window.";
            if (phase === "ROUND_CLOSED" || phase === "ROUND_LOCKED")
                return "Ask submission is closed for this round.";
            return "You can view project details and outcomes.";

        case "GOV_AUTHORITY":
            if (phase === "PUBLISHED")
                return "You may open the first bidding round.";
            if (phase === "ROUND_OPEN")
                return "You may close the round after the bidding window ends.";
            if (phase === "ROUND_CLOSED")
                return "You may lock the round to finalize economic inputs.";
            return "This project is now read-only for audit purposes.";

        case "AUDITOR":
            return "This project is available in read-only audit mode.";

        default:
            return "";
    }
}
