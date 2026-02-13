"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function DeveloperQuoteForm({ projectId }: { projectId: string }) {
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    async function submit() {
        setLoading(true)

        const res = await fetch("/api/saleable/bids/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                workflow: "saleable",
                projectId,
                t: 0,
                qbundle_inr: amount,
            }),
        })

        setLoading(false)

        if (!res.ok) {
            toast.error(await res.text())
            return
        }

        toast.success("Quote submitted")
        setAmount("")
    }

    return (
        <div className="rounded border p-4 space-y-3">
            <h2 className="font-semibold">Submit Quote (₹)</h2>

            <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Total bundle price (INR)"
            />

            <Button onClick={submit} disabled={loading || !amount}>
                Submit Quote
            </Button>
        </div>
    )
}
