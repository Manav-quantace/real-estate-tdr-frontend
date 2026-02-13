import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

export default function Header() {
    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary transition-colors hover:bg-secondary/80"
                            aria-label="Back to workflow hub"
                        >
                            <ArrowLeft className="size-5 text-foreground" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Saleable Redevelopment</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage Society and Private Owner redevelopment projects
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                        Change Workflow
                    </Link>

                    <Link
                        href="/saleable/projects/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                        <Plus className="size-4" />
                        New Project
                    </Link>
                </div>
            </div>
        </div>
    )
}
