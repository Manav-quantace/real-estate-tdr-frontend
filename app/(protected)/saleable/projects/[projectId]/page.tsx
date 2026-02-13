import Link from "next/link"
import type { SaleableProject } from "@/types/saleable"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Users, Code } from "lucide-react"

import AuthorityStack from "./components/AuthorityStack"
import { getServerUser } from "@/lib/auth-server"

type PageProps = {
  params: Promise<{ projectId: string }>
}

export default async function SaleableDetail({ params }: PageProps) {
  const { projectId } = await params

  // ✅ server-safe auth
  const user = await getServerUser()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/saleable/projects/${projectId}`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to load project")

  const project: SaleableProject = await res.json()

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background p-6">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-xs font-mono text-muted-foreground">
              Project ID: {project.project_id}
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/saleable/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* ACTION CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            href={`/saleable/projects/${project.project_id}/buyer-quote`}
            icon={<Users className="size-5" />}
            title="Buyer Quote"
            subtitle="Buyer quotes"
          />
          <ActionCard
            href={`/saleable/projects/${project.project_id}/developer-ask`}
            icon={<Code className="size-5" />}
            title="Developer Portal"
            subtitle="Developer bids"
          />
        </div>

        {/* PROJECT DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Immutable metadata snapshot</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {Object.entries(project).map(([k, v]) => (
              <div key={k} className="rounded border bg-muted/30 p-3">
                <div className="text-xs uppercase text-muted-foreground">{k}</div>
                <div className="font-mono text-sm break-all">
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 🔒 AUTHORITY STACK */}
        {user?.role === "GOV_AUTHORITY" && (
          <AuthorityStack
            projectId={project.project_id}
            workflow="saleable"
          />
        )}
      </div>
    </div>
  )
}

function ActionCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <Card className="hover:border-primary/50 transition">
      <CardContent className="pt-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto"
          asChild
        >
          <Link href={href}>
            <div className="size-10 flex items-center justify-center rounded bg-primary/10">
              {icon}
            </div>
            <div className="text-left">
              <div className="font-semibold">{title}</div>
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            </div>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
