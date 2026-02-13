//app/(protected)/saleable/page.tsx
import Header from "./_components/Header"
import ProjectCard from "./_components/ProjectCard"
import Link from "next/link"

type SaleableProject = {
    project_id: string
    title: string
    city?: string
    zone?: string
    status?: "active" | "pending" | "completed" | "draft"
    created_at?: string
}

async function getSaleableDashboard(): Promise<SaleableProject[]> {
    try {
        if (!process.env.API_URL) {
            console.error("API_URL is missing")
            return []
        }

        const res = await fetch(`${process.env.API_URL}/api/v1/saleable/dashboard`, { cache: "no-store" })

        if (!res.ok) {
            console.error("Backend error:", res.status)
            return []
        }

        const data = await res.json()

        if (Array.isArray(data)) return data
        if (Array.isArray(data.items)) return data.items

        console.error("Unexpected response shape", data)
        return []
    } catch (err) {
        console.error("Saleable dashboard fetch failed", err)
        return []
    }
}

export default async function SaleableDashboard() {
    const items = await getSaleableDashboard()

    return (
        <div className="min-h-screen bg-secondary/30 p-6 md:p-10">
            <div className="mx-auto max-w-7xl">
                <Header />

                <div className="mt-8">
                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
                            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                                <svg className="size-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-card-foreground">No projects yet</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Get started by creating your first saleable redevelopment project.
                            </p>
                            <Link
                                href="/saleable/projects/new"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Project
                            </Link>
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="space-y-3">
                            {items.map((p: SaleableProject) => (
                                <ProjectCard key={p.project_id} project={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
