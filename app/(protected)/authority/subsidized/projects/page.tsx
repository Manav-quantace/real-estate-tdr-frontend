//app/authority/subsidized/projects/page.tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { Building2, Plus } from "lucide-react"

type Project = {
    projectId: string
    title: string
    status: string
}

export default async function AuthoritySubsidizedProjectsPage() {
    const token = (await cookies()).get("auth_token")?.value
    const API = process.env.API_URL!

    const res = await fetch(`${API}/api/v1/projects?workflow=subsidized`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    })

    const data = await res.json()
    const projects: Project[] = data.projects || []

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Subsidized Projects</h1>
                    <p className="text-muted-foreground text-sm">
                        Government-managed subsidized housing projects
                    </p>
                </div>

                <Link
                    href="/authority/subsidized/projects/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white"
                >
                    <Plus className="h-4 w-4" />
                    Create Project
                </Link>
            </div>

            <div className="grid gap-4">
                {projects.map(p => (
                    <Link
                        key={p.projectId}
                        href={`/authority/subsidized/projects/${p.projectId}`}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow"
                    >
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                            <div className="font-semibold">{p.title}</div>
                            <div className="text-xs text-muted-foreground">
                                Status: {p.status}
                            </div>
                        </div>
                    </Link>
                ))}

                {projects.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                        No slum projects created yet.
                    </div>
                )}
            </div>
        </div>
    )
}
