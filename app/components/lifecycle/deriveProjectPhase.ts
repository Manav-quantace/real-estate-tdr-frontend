import { ProjectPhase } from "./project-phases";

/**
 * UI-only lifecycle resolver.
 * This MUST mirror backend guarantees exactly.
 */
export function deriveProjectPhase(input: {
  isPublished: boolean;
  round?: {
    is_open: boolean;
    is_locked: boolean;
  } | null;
  matchingComputed?: boolean;
  settlementComputed?: boolean;
  finalized?: boolean;
}): ProjectPhase {
  const {
    isPublished,
    round,
    matchingComputed,
    settlementComputed,
    finalized,
  } = input;

  if (!isPublished) return "DRAFT";

  if (!round) return "PUBLISHED";

  if (round.is_open && !round.is_locked) return "ROUND_OPEN";

  if (!round.is_open && !round.is_locked) return "ROUND_CLOSED";

  if (round.is_locked && !matchingComputed) return "ROUND_LOCKED";

  if (matchingComputed && !settlementComputed) return "MATCHING_COMPUTED";

  if (settlementComputed && !finalized) return "SETTLEMENT_COMPUTED";

  return "FINALIZED";
}
