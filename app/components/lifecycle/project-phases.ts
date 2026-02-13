// Canonical project lifecycle phases (UI only)

export type ProjectPhase =
    | "DRAFT"
    | "PUBLISHED"
    | "ROUND_OPEN"
    | "ROUND_CLOSED"
    | "ROUND_LOCKED"
    | "MATCHING_COMPUTED"
    | "SETTLEMENT_COMPUTED"
    | "FINALIZED";

export const PROJECT_PHASE_META: Record<
    ProjectPhase,
    {
        label: string;
        description: string;
        tone:
        | "neutral"
        | "info"
        | "success"
        | "warning"
        | "danger"
        | "final";
    }
> = {
    DRAFT: {
        label: "Draft",
        description: "Project is not yet part of the exchange.",
        tone: "neutral",
    },

    PUBLISHED: {
        label: "Published",
        description: "Project is visible but bidding has not started.",
        tone: "info",
    },

    ROUND_OPEN: {
        label: "Round Open",
        description: "Bidding is currently open for this round.",
        tone: "success",
    },

    ROUND_CLOSED: {
        label: "Bidding Closed",
        description: "Bidding window has closed. No new submissions allowed.",
        tone: "warning",
    },

    ROUND_LOCKED: {
        label: "Round Locked",
        description: "Economic inputs are locked and immutable.",
        tone: "danger",
    },

    MATCHING_COMPUTED: {
        label: "Matching Computed",
        description: "Matching results have been computed.",
        tone: "info",
    },

    SETTLEMENT_COMPUTED: {
        label: "Settlement Computed",
        description: "Settlement amounts have been calculated.",
        tone: "info",
    },

    FINALIZED: {
        label: "Finalized",
        description: "Settlement executed and permanently recorded.",
        tone: "final",
    },
};
