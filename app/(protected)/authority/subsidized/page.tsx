//app/authority/subsidized/page.tsx
import Link from "next/link"
import { Users, Building2, UserPlus } from "lucide-react"

export default function AuthoritySubsidizedHome() {
    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Subsidized Housing (Authority)</h1>
            <p className="text-muted-foreground">
                Manage subsidized housing projects
            </p>

            <div className="grid gap-4 md:grid-cols-2">
                <Link
                    href="/authority/subsidized/projects"
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition"
                >
                    <Building2 className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Subsidized Projects</div>
                        <div className="text-xs text-muted-foreground">
                            Create and manage subsidized housing projects
                        </div>
                    </div>
                </Link>

                <Link
                    href="/authority/participants"
                    className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition"
                >
                    <UserPlus className="h-6 w-6 text-primary" />
                    <div>
                        <div className="font-semibold">Participants</div>
                        <div className="text-xs text-muted-foreground">
                            Create developers, dwellers, housing bodies
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}