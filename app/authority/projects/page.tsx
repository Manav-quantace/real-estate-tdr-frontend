// app/authority/projects/page.tsx
// app/authority/projects/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Project = {
    projectId: string;
    workflow: string;
    title: string;
    status: string;
};

export default async function AuthorityProjectsPage() {
    const token = (await cookies()).get("auth_token")?.value;
    const API = process.env.API_URL!;

    const res = await fetch(`${API}/api/v1/projects?workflow=saleable`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const res2 = await fetch(`${API}/api/v1/projects?workflow=slum`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const res3 = await fetch(`${API}/api/v1/projects?workflow=subsidized`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const res4 = await fetch(`${API}/api/v1/projects?workflow=clearland`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const saleable = (await res.json()).projects;
    const slum = (await res2.json()).projects;
    const subsidized = (await res3.json()).projects;
    const clearland = (await res4.json()).projects;

    const groups = [
        { label: "Saleable", workflow: "saleable", items: saleable },
        { label: "Slum", workflow: "slum", items: slum },
        { label: "Subsidized", workflow: "subsidized", items: subsidized },
        { label: "Clear Land", workflow: "clearland", items: clearland },
    ];

    return (
        <div className="p-6 space-y-8 max-w-6xl">
            <h1 className="text-2xl font-semibold">Authority — Projects</h1>

            {groups.map((g) => (
                <Card key={g.workflow}>
                    <CardHeader>
                        <CardTitle>{g.label} Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {g.items.length === 0 && (
                            <div className="text-sm text-muted-foreground">No projects</div>
                        )}

                        {g.items.map((p: Project) => (
                            <div
                                key={p.projectId}
                                className="flex items-center justify-between border rounded-md p-3"
                            >
                                <div>
                                    <div className="font-medium">{p.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {p.projectId}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge>{p.status}</Badge>

                                    <Link
                                        href={`/authority/projects/${p.projectId}/rounds?workflow=${p.workflow}`}
                                    >
                                        <Button size="sm">Rounds</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
