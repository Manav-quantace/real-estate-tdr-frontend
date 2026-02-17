//app/authority/slum/projects/[projectId]/stakeholder-enrollment/page.tsx      
'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    CheckCircle2,
    Users,
    Home,
    Building2,
    AlertCircle,
    Loader2,
    UserCheck,
    Trash2,
    Search,
    X,
    Info,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

type Participant = {
    id: string
    display_name: string
    role: string
}

type SlumStatus = {
    portals_present: string[]
    tripartite_ready: boolean
    current_round?: number
    is_locked?: boolean
    is_open?: boolean
}

type Membership = {
    participant_id: string
    portal_type: string
    display_name?: string
}

const PORTALS = [
    {
        key: 'SLUM_DWELLER',
        label: 'Slum Dweller Portal',
        allowedRole: 'SLUM_DWELLER',
        description: 'Represents slum residents and cooperative bodies working toward community betterment',
        icon: Users,
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        key: 'DEVELOPER',
        label: 'Land Developer Portal',
        allowedRole: 'DEVELOPER',
        description: 'Represents land owner or private developer facilitating urban development',
        icon: Building2,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
        key: 'AFFORDABLE_HOUSING_DEV',
        label: 'Affordable Housing Portal',
        allowedRole: 'AFFORDABLE_HOUSING_DEV',
        description: 'Represents rehab housing authority or NGO ensuring sustainable housing solutions',
        icon: Home,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        badgeColor: 'bg-amber-100 text-amber-700',
    },
]

function PortalCard({
    portal,
    enrolled,
    availableParticipants,
    selected,
    onSelectChange,
    onEnroll,
    loading,
    searchQuery,
    onSearchChange,
}: {
    portal: (typeof PORTALS)[0]
    enrolled: Membership[]
    availableParticipants: Participant[]
    selected: string
    onSelectChange: (value: string) => void
    onEnroll: () => void
    loading: boolean
    searchQuery: string
    onSearchChange: (query: string) => void
}) {
    const Icon = portal.icon
    const isEnrolled = enrolled.length > 0
    const selectedParticipant = availableParticipants.find((p) => p.id === selected)

    const filteredParticipants = availableParticipants.filter((p) =>
        p.display_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleSelectParticipant = (participantId: string) => {
        onSelectChange(participantId)
        onSearchChange('')
    }

    return (
        <Card className={`border-2 ${portal.borderColor} ${portal.bgColor}`}>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={`p-3 rounded-lg ${portal.badgeColor} bg-opacity-20`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-900">{portal.label}</CardTitle>
                            <p className="text-xs text-slate-500 mt-1">{portal.allowedRole.replace(/_/g, ' ')}</p>
                        </div>
                    </div>
                    <Badge className={`${portal.badgeColor} border`}>
                        {isEnrolled ? (
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {enrolled.length}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Add
                            </div>
                        )}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{portal.description}</p>

                {/* Search Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Find & Select Participant</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder={`Search ${portal.allowedRole.replace(/_/g, ' ').toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={`pl-10 pr-8 border-2 ${portal.borderColor} focus:border-slate-400`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                type="button"
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Participant List Dropdown */}
                {filteredParticipants.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="max-h-56 overflow-y-auto">
                            {filteredParticipants.map((participant) => (
                                <button
                                    key={participant.id}
                                    onClick={() => handleSelectParticipant(participant.id)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b last:border-b-0 ${selected === participant.id
                                        ? 'bg-slate-200 font-medium text-slate-900'
                                        : 'bg-white hover:bg-slate-100 text-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{participant.display_name}</span>
                                        {selected === participant.id && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searchQuery && filteredParticipants.length === 0 && (
                    <div className="p-4 bg-slate-100 rounded-lg text-center text-sm text-slate-600">
                        No participants found
                    </div>
                )}

                {/* Selection Confirmation */}
                {selectedParticipant && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-emerald-800">
                            <strong>{selectedParticipant.display_name}</strong> selected
                        </div>
                    </div>
                )}

                {/* Enroll Button */}
                <Button
                    onClick={onEnroll}
                    disabled={loading || !selected || (isEnrolled && enrolled.length >= 1)}
                    className="w-full font-medium h-10 bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEnrolled ? `Enrolled (${enrolled.length})` : 'Enroll Participant'}
                </Button>
            </CardContent>
        </Card>
    )
}

function EnrolledListCard({ memberships }: { memberships: Membership[] }) {
    if (memberships.length === 0) return null

    return (
        <Card className="border-2 border-slate-300 bg-slate-50 mt-8">
            <CardHeader className="bg-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-700" />
                        <CardTitle className="text-lg text-slate-900">All Enrolled Participants</CardTitle>
                    </div>
                    <Badge className="bg-slate-700 text-white">{memberships.length}</Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-slate-200">
                    {memberships.map((member) => {
                        const portal = PORTALS.find((p) => p.key === member.portal_type)
                        if (!portal) return null

                        return (
                            <div key={`${member.participant_id}-${member.portal_type}`} className="p-4 hover:bg-slate-100 transition-colors flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`p-3 rounded-lg ${portal.badgeColor} bg-opacity-20 shrink-0`}>
                                        <portal.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{member.display_name || member.participant_id}</p>
                                        <p className="text-xs text-slate-500">{portal.label}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Badge className={`${portal.badgeColor}`}>{member.portal_type.replace(/_/g, ' ')}</Badge>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

function CompletionCard({ tripartiteReady }: { tripartiteReady: boolean }) {
    if (!tripartiteReady) return null

    return (
        <Card className="border-2 border-emerald-300 bg-emerald-50 mt-8">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-200 rounded-full shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                    <h3 className="font-semibold text-emerald-900">Tripartite Structure Complete</h3>
                    <p className="text-sm text-emerald-700">All stakeholders enrolled. Ready for rounds.</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default function StakeholderEnrollmentPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const [participants, setParticipants] = useState<Participant[]>([])
    const [memberships, setMemberships] = useState<Membership[]>([])
    const [status, setStatus] = useState<SlumStatus | null>(null)
    const [selected, setSelected] = useState<Record<string, string>>({})
    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})
    const [loadingPortal, setLoadingPortal] = useState<string | null>(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function loadAll() {
        try {
            setInitialLoading(true)
            setError(null)

            const [pRes, sRes] = await Promise.all([
                fetch('/api/admin/participants'),
                fetch(`/api/slum/status?projectId=${projectId}`),
            ])

            let pData: Participant[] = []
            let sData: SlumStatus | null = null

            if (pRes.ok) {
                const pRaw = await pRes.json()
                pData = Array.isArray(pRaw)
                    ? pRaw
                    : Array.isArray(pRaw.participants)
                        ? pRaw.participants
                        : []
            }

            if (sRes.ok) {
                sData = await sRes.json()
            }

            let membershipsData: Membership[] = []

            try {
                const mRes = await fetch(`/api/slum/memberships?projectId=${projectId}`)
                if (mRes.ok) {
                    const mJson = await mRes.json()
                    if (Array.isArray(mJson)) {
                        membershipsData = mJson.map((m: any) => ({
                            participant_id: m.participant_id || m.id,
                            portal_type: m.portal_type || m.portalType,
                            display_name: m.display_name || m.displayName,
                        }))
                    } else if (mJson.memberships && Array.isArray(mJson.memberships)) {
                        membershipsData = mJson.memberships
                    }
                }
            } catch (e) {
                // Fallback to participants endpoint
                try {
                    const pCountRes = await fetch(`/api/slum/participants?projectId=${projectId}`)
                    if (pCountRes.ok) {
                        const json = await pCountRes.json()
                        if (Array.isArray(json)) {
                            membershipsData = json.map((m: any) => ({
                                participant_id: m.participant_id || m.id,
                                portal_type: m.portal_type || m.portalType,
                                display_name: m.display_name || m.displayName,
                            }))
                        }
                    }
                } catch (e) {
                    // Silent fallback
                }
            }

            setParticipants(pData)
            setStatus(sData)
            setMemberships(membershipsData)
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to load data'
            setError(errorMsg)
            console.error('[v0] loadAll error:', err)
        } finally {
            setInitialLoading(false)
        }
    }

    useEffect(() => {
        if (!projectId) return
        loadAll()
    }, [projectId])

    async function enroll(portalType: string) {
        const participantId = selected[portalType]
        if (!participantId) {
            toast.error('Please select a participant')
            return
        }

        const alreadyEnrolled = memberships.find((m) => m.participant_id === participantId)
        if (alreadyEnrolled) {
            toast.error('Already enrolled', {
                description: 'This participant is already enrolled',
            })
            return
        }

        try {
            setLoadingPortal(portalType)
            const res = await fetch('/api/slum/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'slum',
                    projectId,
                    participantId,
                    portalType,
                }),
            })

            if (!res.ok) {
                const body = await res.json().catch(() => ({ detail: 'Enrollment failed' }))
                throw new Error(body?.detail || 'Enrollment failed')
            }

            toast.success('Enrolled successfully')
            setSelected({ ...selected, [portalType]: '' })
            await loadAll()
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Network error'
            toast.error(msg)
            console.error('[v0] enroll error:', err)
        } finally {
            setLoadingPortal(null)
        }
    }

    async function removeEnrollment(portalType: string, participantId: string) {
        if (!window.confirm('Remove this enrollment?')) return

        try {
            setLoadingPortal(`${portalType}-remove`)
            const res = await fetch('/api/slum/enroll/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'slum',
                    projectId,
                    participantId,
                    portalType,
                }),
            })

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body?.detail || 'Failed to remove')
            }

            toast.success('Enrollment removed')
            await loadAll()
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Network error'
            toast.error(msg)
            console.error('[v0] removeEnrollment error:', err)
        } finally {
            setLoadingPortal(null)
        }
    }

    function availableForPortal(portalAllowedRole: string) {
        const enrolledIds = new Set(memberships.map((m) => m.participant_id))
        return participants.filter((p) => p.role === portalAllowedRole && !enrolledIds.has(p.id))
    }

    function enrolledForPortal(portalKey: string) {
        return memberships.filter((m) => m.portal_type === portalKey)
    }

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Loading stakeholder data...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Stakeholder Enrollment</h1>
                    <p className="text-slate-600 mt-2">Enroll participants across the three portals</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                            <p className="font-medium text-red-900">Error loading data</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Info Banner */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <strong>Tripartite Structure:</strong> Each stakeholder category needs at least one representative. You can add multiple representatives to each portal.
                    </div>
                </div>

                {/* Portal Cards Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {PORTALS.map((portal) => (
                        <PortalCard
                            key={portal.key}
                            portal={portal}
                            enrolled={enrolledForPortal(portal.key)}
                            availableParticipants={availableForPortal(portal.allowedRole)}
                            selected={selected[portal.key] || ''}
                            onSelectChange={(v) => setSelected({ ...selected, [portal.key]: v })}
                            onEnroll={() => enroll(portal.key)}
                            loading={loadingPortal === portal.key}
                            searchQuery={searchQueries[portal.key] || ''}
                            onSearchChange={(q) => setSearchQueries({ ...searchQueries, [portal.key]: q })}
                        />
                    ))}
                </div>

                {/* Completion Status */}
                <CompletionCard tripartiteReady={status?.tripartite_ready ?? false} />

                {/* All Enrolled List */}
                <EnrolledListCard memberships={memberships} />

                {/* Safety Info */}
                {memberships.length > 0 && (
                    <Card className="mt-8 border-slate-200 bg-slate-50">
                        <CardContent className="p-4 text-sm text-slate-600 flex gap-2">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-slate-900">Note:</strong> Removal requires confirmation. All enrollments are tracked for audit purposes.
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    )
}
