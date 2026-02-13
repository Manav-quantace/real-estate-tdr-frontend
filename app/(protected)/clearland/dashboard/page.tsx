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
    const res = await fetch(`${baseUrl}/api/projects?workflow=clearland`, {
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

async function getCurrentRound(baseUrl: string, cookie: string, projectId: string) {
    const res = await fetch(
        `${baseUrl}/api/rounds/current?workflow=clearland&projectId=${projectId}`,
        { cache: 'no-store', headers: { cookie } }
    )
    if (!res.ok) return null
    return res.json()
}

export default async function ClearlandDashboardPage() {
    const baseUrl = await getBaseUrl()
    const cookie = await getCookieHeader()

    const [me, projects] = await Promise.all([
        getMe(baseUrl, cookie),
        getProjects(baseUrl, cookie),
    ])

    const items = await Promise.all(
        projects.map(async (proj: any) => {
            const projectId = proj.id ?? proj.project_id ?? proj.projectId ?? String(proj)

            const roundResp = await getCurrentRound(baseUrl, cookie, projectId)

            return {
                project_id: String(projectId),
                title: proj.title ?? '',
                category: proj.category ?? 'clearland',
                city: proj.metadata?.project_city ?? '',
                zone: proj.metadata?.project_zone ?? '',
                status: proj.status ?? 'draft',
                current_round: roundResp?.current ?? null,
            }
        })
    )

    return (
        <WorkflowDashboard
            workflow='clearland'
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
