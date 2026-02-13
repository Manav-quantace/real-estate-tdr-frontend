import { headers } from 'next/headers'
import WorkflowDashboard from '../../components/workflow-dashboard'


type Role = 'GOV_AUTHORITY' | 'AUDITOR' | 'DEVELOPER' | 'BUYER' | 'SLUM_DWELLER' | 'AFFORDABLE_DEVELOPER' | 'CONTRACTOR'

async function getBaseUrl() {
    const h = await headers()
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host = h.get('x-forwarded-host') ?? h.get('host')
    return `${proto}://${host}`
}

async function getCookieHeader() {
    const h = await headers()
    return h.get('cookie') ?? ''
}

async function getMe(baseUrl: string, cookie: string) {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
        cache: 'no-store',
        headers: { cookie },
    })
    if (!res.ok) throw new Error('Failed to load user')
    return res.json()
}

async function getProjects(baseUrl: string, cookie: string) {
    const res = await fetch(`${baseUrl}/api/projects?workflow=saleable`, {
        cache: 'no-store',
        headers: { cookie },
    })

    if (!res.ok) {
        const t = await res.text().catch(() => '')
        throw new Error('Failed to load projects: ' + t)
    }

    const json = await res.json()
    return Array.isArray(json) ? json : json.items ?? json.projects ?? []
}

async function getValuer(baseUrl: string, cookie: string, projectId: string) {
    const res = await fetch(
        `${baseUrl}/api/saleable/valuer?workflow=saleable&projectId=${projectId}`,
        { cache: 'no-store', headers: { cookie } }
    )
    if (!res.ok) return null
    return res.json()
}

async function getCurrentRound(baseUrl: string, cookie: string, projectId: string) {
    const res = await fetch(
        `${baseUrl}/api/rounds/current?workflow=saleable&projectId=${projectId}`,
        { cache: 'no-store', headers: { cookie } }
    )
    if (!res.ok) return null
    return res.json()
}

export default async function SaleableDashboardPage() {
    const baseUrl = await getBaseUrl()
    const cookie = await getCookieHeader()

    const [me, projects] = await Promise.all([
        getMe(baseUrl, cookie),
        getProjects(baseUrl, cookie),
    ])

    const items = await Promise.all(
        projects.map(async (proj: any) => {
            const projectId = proj.id ?? proj.project_id ?? proj.projectId ?? String(proj)

            const [valuerResp, roundResp] = await Promise.all([
                getValuer(baseUrl, cookie, projectId),
                getCurrentRound(baseUrl, cookie, projectId),
            ])

            const latest = valuerResp?.latest
                ? {
                    status: valuerResp.latest.status,
                    value_inr: valuerResp.latest.valuationInr
                        ? Number(valuerResp.latest.valuationInr)
                        : null,
                    updated_at: valuerResp.latest.valuedAtIso,
                }
                : {
                    status: 'not_submitted',
                    value_inr: null,
                    updated_at: null,
                }

            return {
                project_id: String(projectId),
                title: proj.title ?? '',
                category: proj.category ?? 'saleable',
                city: proj.metadata?.project_city ?? '',
                zone: proj.metadata?.project_zone ?? '',
                status: proj.status ?? 'draft',
                valuer_valuation: latest,
                current_round: roundResp?.current ?? null,
            }
        })
    )

    return (
        <WorkflowDashboard
            workflow='saleable'
            role={me.role as Role}
            items={items}
            userProfile={{
                name: me.name,
                email: me.email,
                organization: me.organization,
            }}
        />
    )
}
