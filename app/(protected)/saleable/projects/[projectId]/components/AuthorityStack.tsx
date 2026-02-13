"use client"

import AuthorityRoundsSection from "./AuthorityRoundsSection"
import AuthorityMatchingSection from "./AuthorityMatchingSection"
import AuthoritySettlementSection from "./AuthoritySettlementSection"

export default function AuthorityStack({
    projectId,
    workflow,
}: {
    projectId: string
    workflow: string
}) {
    return (
        <div className="space-y-8 border-t pt-8">
            <h2 className="text-2xl font-bold">Authority Controls</h2>

            <AuthorityRoundsSection projectId={projectId} workflow={workflow} />

            <AuthorityMatchingSection projectId={projectId} workflow={workflow} />

            <AuthoritySettlementSection projectId={projectId} workflow={workflow} />
        </div>
    )
}
