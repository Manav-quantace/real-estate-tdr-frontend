// app/(protected)/slum/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users } from "lucide-react"

type SlumProject = {
  id: string
  title: string
  status: string
}

export default function SlumDashboard() {
  const [items, setItems] = useState<SlumProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/projects?workflow=slum", {
          cache: "no-store",
        })

        const raw = await res.json()

        let projects: any[] = []

        if (Array.isArray(raw)) {
          projects = raw
        } else if (Array.isArray(raw.items)) {
          projects = raw.items
        } else if (Array.isArray(raw.data)) {
          projects = raw.data
        } else if (Array.isArray(raw.projects)) {
          projects = raw.projects
        } else {
          console.error("Unexpected slum project payload:", raw)
          projects = []
        }

        const normalized: SlumProject[] = projects.map((p) => ({
          id: p.id ?? p.project_id ?? p.projectId,
          title: p.title ?? p.name ?? "Untitled",
          status: p.status ?? p.state ?? "unknown",
        }))

        if (!cancelled) setItems(normalized)
      } catch (e) {
        console.error("Slum dashboard fetch failed", e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Slum Redevelopment Schemes
        </motion.h1>

        {loading && (
          <p className="text-muted-foreground">Loading projects…</p>
        )}

        {!loading && items.length === 0 && (
          <div className="rounded-xl border bg-card p-10 text-center">
            No slum projects yet
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/slum/projects/${p.id}`}
                className="group block rounded-xl border bg-card p-5 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-emerald-100">
                    <Users className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Status: {p.status}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
