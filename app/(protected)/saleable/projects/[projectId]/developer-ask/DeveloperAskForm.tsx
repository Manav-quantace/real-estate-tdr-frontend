// app/(protected)/saleable/projects/[projectId]/developer-ask/DeveloperAskForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type DeveloperAsk = {
  dcu_units: number;
  ask_price_per_unit_inr: number;
  total_ask_inr?: number | null; // ✅ OPTIONAL
  state: string;
};

export default function DeveloperAskForm({ projectId }: { projectId: string }) {
  const { toast } = useToast();

  const [ask, setAsk] = useState<DeveloperAsk | null>(null);
  const [loading, setLoading] = useState(false);

  const [dcuUnits, setDcuUnits] = useState("");
  const [price, setPrice] = useState("");

  /* ─────────────────────────────
     Derived total (canonical)
  ───────────────────────────── */
  const totalAskInr = useMemo(() => {
    const dcu = Number(dcuUnits);
    const ppu = Number(price);
    if (!Number.isFinite(dcu) || !Number.isFinite(ppu)) return null;
    if (dcu <= 0 || ppu <= 0) return null;
    return dcu * ppu;
  }, [dcuUnits, price]);

  /* ─────────────────────────────
     Load existing ask
  ───────────────────────────── */
  useEffect(() => {
    if (!projectId) return;

    async function load() {
      try {
        const res = await api.getMyDeveloperAsk(projectId);
        if (res) {
          setAsk(res); // ✅ now valid
          setDcuUnits(String(res.dcu_units));
          setPrice(String(res.ask_price_per_unit_inr));
        }
      } catch {
        setAsk(null);
      }
    }

    load();
  }, [projectId]);

  const locked = !!ask && ask.state !== "draft";

  async function submit(action: "save" | "submit") {
    if (!projectId) return;

    if (!totalAskInr) {
      toast({
        title: "Invalid ask",
        description: "DCU units and price must be valid",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.upsertDeveloperAsk(projectId, {
        dcu_units: Number(dcuUnits),
        ask_price_per_unit_inr: Number(price),
        action, // ⚠ total_ask_inr handled in API layer
      });

      toast({
        title: action === "submit" ? "Ask submitted" : "Draft saved",
      });

      window.location.reload();
    } catch (err: any) {
      toast({
        title: "Failed",
        description: err?.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Developer Ask
          {ask && <Badge>{ask.state}</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!ask && (
          <Alert>
            <AlertTitle>No Ask</AlertTitle>
            <AlertDescription>
              You have not submitted an ask yet.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Label>DCU Units</Label>
          <Input
            type="number"
            disabled={locked}
            value={dcuUnits}
            onChange={(e) => setDcuUnits(e.target.value)}
          />
        </div>

        <div>
          <Label>Ask Price per Unit (INR)</Label>
          <Input
            type="number"
            disabled={locked}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <Separator />

        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Total Ask (INR)</span>
          <span className="font-mono">
            {totalAskInr ? totalAskInr.toLocaleString("en-IN") : "—"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        {!locked && (
          <>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => submit("save")}
            >
              Save Draft
            </Button>
            <Button
              disabled={loading}
              onClick={() => submit("submit")}
            >
              Submit Ask
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
