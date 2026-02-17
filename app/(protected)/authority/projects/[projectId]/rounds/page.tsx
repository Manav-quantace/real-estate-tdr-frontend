// app/authority/projects/[projectId]/rounds/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";

import AuthorityRoundControls from "./AuthorityRoundControl";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ workflow?: string }>;
};

export default async function AuthorityProjectRoundsPage({
  params,
  searchParams,
}: Props) {
  const { projectId } = await params;
  const { workflow } = await searchParams;

  if (!workflow) {
    throw new Error("Missing workflow in URL (?workflow=...)");
  }

  const token = (await cookies()).get("auth_token")?.value;
  const API = process.env.API_URL!;

  const headers = {
    Authorization: `Bearer ${token}`,
    "x-workflow": workflow,
    "x-project-id": projectId,
  };

  /* ───────────────────────────
     Fetch current round
  ─────────────────────────── */
  const currentRes = await fetch(
    `${API}/api/v1/rounds/current?workflow=${workflow}&projectId=${projectId}`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!currentRes.ok) {
    const txt = await currentRes.text();
    throw new Error(`Failed to load round: ${currentRes.status} ${txt}`);
  }

  const { current: round } = await currentRes.json();

  /* ───────────────────────────
     Fetch round history
  ─────────────────────────── */
  const historyRes = await fetch(
    `${API}/api/v1/rounds?workflow=${workflow}&projectId=${projectId}`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!historyRes.ok) {
    const txt = await historyRes.text();
    throw new Error(`Failed to load round history: ${txt}`);
  }

  const rounds: any[] = await historyRes.json();

  const stateBadge = (r: any) => {
    if (r.state === "locked") return "destructive";
    if (r.is_open) return "default";
    return "secondary";
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Authority — Round Management ({workflow})
        </h1>

        <div className="flex gap-3 text-sm">
          <Link href="/authority/projects">
            <Button variant="outline" size="sm">
              ← Authority Projects
            </Button>
          </Link>

          <Link href={`/${workflow}/dashboard`}>
            <Button variant="ghost" size="sm">
              Workflow Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Round */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Round</span>
            <Badge variant={stateBadge(round)}>
              {round.state.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Round Number</strong></div>
          <div>{round.t}</div>

          <div><strong>Open</strong></div>
          <div>{round.is_open ? "Yes" : "No"}</div>

          <div><strong>Locked</strong></div>
          <div>{round.is_locked ? "Yes" : "No"}</div>

          <div><strong>Bidding Opens</strong></div>
          <div>{round.bidding_window_start || "-"}</div>

          <div><strong>Bidding Closes</strong></div>
          <div>{round.bidding_window_end || "-"}</div>
        </CardContent>
      </Card>

      {/* Controls */}
      <AuthorityRoundControls
        projectId={projectId}
        workflow={workflow}
        round={round}
      />

      <Separator />

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Round History</CardTitle>
        </CardHeader>

        <CardContent>
          {rounds.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No rounds have been created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {rounds.map((r) => (
                <div
                  key={r.t}
                  className={`rounded-md border p-3 flex items-center justify-between ${
                    r.t === round.t
                      ? "bg-muted/50"
                      : "opacity-80"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-medium">Round {r.t}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.bidding_window_start || "—"} →{" "}
                      {r.bidding_window_end || "—"}
                    </div>
                  </div>

                  <Badge variant={stateBadge(r)}>
                    {r.state.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
