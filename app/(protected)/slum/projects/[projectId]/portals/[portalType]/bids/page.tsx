"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  IndianRupee,
  Scale,
  Coins,
} from "lucide-react";

type RoundPayload = {
  t: number;
  state: string;
  is_open: boolean;
  is_locked: boolean;
};

type BidPayload = {
  id?: string;
  state?: string;
  submitted_at_iso?: string | null;
  locked_at_iso?: string | null;
  payload?: any;
  dcu_units?: string | null;
  ask_price_per_unit_inr?: string | null;
  total_ask_inr?: string | null;
};

export default function BidsPage() {
  const { projectId, portalType } = useParams() as {
    projectId: string;
    portalType: string;
  };

  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState<RoundPayload | null>(null);
  const [bid, setBid] = useState<BidPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [quote, setQuote] = useState("");
  const [dcuUnits, setDcuUnits] = useState("");
  const [price, setPrice] = useState("");
  const [prefValue, setPrefValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);  // ← Add here

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/bids/my-current?portalType=${portalType}&projectId=${projectId}&workflow=slum`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }

        const json = await res.json();

        if (!cancelled) {
          setRound(json.round ?? null);
          setBid(json.bid ?? null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId, portalType]);

  const isOpen = Boolean(round?.is_open === true);

  // ---------------- SLUM DWELLER (Preference)
  async function submitPreference() {
    if (!prefValue) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bids/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workflow: "slum",
          projectId,
          t: round?.t ?? 0,

          rehab_option: "IN_SITU",

          household: {
            family_members: Number(prefValue),
            vulnerable_members: 0,
            income_bracket: null,
            tenure_years: null,
          },

          consents: {
            consent_redevelopment: true,
            consent_relocation: true,
            consent_data_use: true,
          },

          additional_notes: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submit failed");

      setBid(data);
    } catch (e: any) {
      setError(e.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------- DEVELOPER ASK
  async function submitAsk() {
    if (!dcuUnits || !price) return;

    const dcu = Number(dcuUnits);
    const unitPrice = Number(price);

    // 🔥 calculate total here
    const totalAsk = dcu * unitPrice;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bids/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workflow: "slum",
          projectId,
          t: round?.t ?? 0,

          // ✅ FLAT FIELDS (AskBidPayload)
          dcu_units: dcu,
          ask_price_per_unit_inr: unitPrice,
          total_ask_inr: totalAsk,

          // optional
          bid_validity_iso: null,
          notes: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submit failed");

      setBid(data);
    } catch (e: any) {
      setError(e.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------- AFFORDABLE HOUSING QUOTE
  async function submitQuote() {
    if (!quote) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bids/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workflow: "slum",
          projectId,
          t: round?.t ?? 0,

          // 🔥 REQUIRED by QuoteBidPayload
          qbundle_inr: Number(quote),

          // optional but explicit (good practice)
          qlu_inr: null,
          qtdr_inr: null,
          qpru_inr: null,
          bid_validity_iso: null,
          notes: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submit failed");

      setBid(data);
    } catch (e: any) {
      setError(e.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------- UI
  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (error)
    return (
      <div className="p-10 max-w-xl mx-auto text-red-600 flex gap-2">
        <AlertTriangle className="h-5 w-5" />
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {portalType.replaceAll("_", " ")} Bid
            </h1>
            <div className="text-xs text-muted-foreground">
              Round: {round?.t ?? "-"} · State: {round?.state ?? "-"}
            </div>
          </div>

          <Link href={`/slum/projects/${projectId}/portals/${portalType}`} className="inline-flex items-center gap-2 text-sm underline">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </motion.div>

        {!isOpen && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-6 text-center space-y-2">
            <AlertTriangle className="mx-auto h-6 w-6 text-yellow-500" />
            <div className="font-semibold">Bidding Not Open</div>
            <div className="text-sm text-muted-foreground">
              Bids can only be submitted when the round is open.
            </div>
          </motion.div>
        )}

        {bid && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-6 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
            <div className="font-semibold">Bid Submitted</div>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded mt-2 text-left">
              {JSON.stringify(bid, null, 2)}
            </pre>
          </motion.div>
        )}

        {isOpen && !bid && portalType === "AFFORDABLE_HOUSING_DEV" && (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <IndianRupee className="h-4 w-4" />
            <input type="number" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Total quote (₹)" className="w-full border rounded-lg px-4 py-2 text-sm" />
            <button disabled={!quote || submitting} onClick={submitQuote} className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Quote"}
            </button>
          </div>
        )}

        {isOpen && !bid && portalType === "SLUM_DWELLER" && (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <Scale className="h-4 w-4" />
            <input type="number" value={prefValue} onChange={(e) => setPrefValue(e.target.value)} placeholder="Family members" className="w-full border rounded-lg px-4 py-2 text-sm" />
            <button disabled={!prefValue || submitting} onClick={submitPreference} className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Preference"}
            </button>
          </div>
        )}

        {isOpen && !bid && portalType === "DEVELOPER" && (
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <Coins className="h-4 w-4" />
            <input type="number" value={dcuUnits} onChange={(e) => setDcuUnits(e.target.value)} placeholder="DCU units" className="w-full border rounded-lg px-4 py-2 text-sm" />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ask price per unit (₹)" className="w-full border rounded-lg px-4 py-2 text-sm" />
            <button disabled={!dcuUnits || !price || submitting} onClick={submitAsk} className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Ask"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

