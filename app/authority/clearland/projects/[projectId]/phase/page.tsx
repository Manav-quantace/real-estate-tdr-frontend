'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/app/(protected)/components/navbar'
import { PhaseTimeline } from '../../../components/phase-timeline'
import { RoundControlCard } from '../../../components/round-control-card'
import { PhaseTransitionCard } from '../../../components/phase-transition-card'
import { MembershipPanel } from '../../../components/membership-panel'


interface Project {
    id: string
    title: string
    status: string
    workflow: string
}

interface PhaseEntry {
    phase: string
    effectiveFrom: string
    createdBy: string
    notes?: string
}

interface Member {
    participant_id: string
    role: string
    status: string
    enrolled_at: string
    name?: string
}

interface RoundInfo {
    t: number
    state: string
    bidding_window_start?: string
    bidding_window_end?: string
}

interface LedgerEntry {
    timestamp: string
    action: string
    actor: string
    details: string
}

export default function ClearlandPhasePage() {
    const params = useParams()
    const projectId = params.projectId as string

    const [project, setProject] = useState<Project | null>(null)
    const [phaseHistory, setPhaseHistory] = useState<PhaseEntry[]>([])
    const [currentPhase, setCurrentPhase] = useState('')
    const [members, setMembers] = useState<Member[]>([])
    const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null)
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Simulate API calls - replace with actual endpoints
                const projectRes = await fetch(`/api/projects/${projectId}?workflow=clearland`)
                const phaseRes = await fetch(`/api/clearland/phase/history?projectId=${projectId}`)
                const membersRes = await fetch(`/api/clearland/memberships/list?projectId=${projectId}`)
                const roundRes = await fetch(`/api/rounds/current?projectId=${projectId}`)
                const ledgerRes = await fetch(`/api/ledger?workflow=clearland&projectId=${projectId}`)

                if (projectRes.ok) {
                    const proj = await projectRes.json()
                    setProject(proj)
                }

                if (phaseRes.ok) {
                    const phases = await phaseRes.json()
                    setPhaseHistory(phases)
                    if (phases.length > 0) {
                        setCurrentPhase(phases[0].phase)
                    }
                }

                if (membersRes.ok) {
                    const mbrs = await membersRes.json()
                    setMembers(mbrs)
                }

                if (roundRes.ok) {
                    const round = await roundRes.json()
                    setCurrentRound(round)
                }

                if (ledgerRes.ok) {
                    const entries = await ledgerRes.json()
                    setLedgerEntries(entries)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setToast({ message: 'Error loading page data', type: 'error' })
            } finally {
                setLoading(false)
            }
        }

        if (projectId) {
            fetchData()
        }
    }, [projectId])

    const handlePhaseTransition = async (targetPhase: string) => {
        try {
            const res = await fetch(`/api/clearland/phase/transition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    targetPhase,
                }),
            })

            if (res.ok) {
                const result = await res.json()
                setToast({ message: `Phase transitioned to ${targetPhase} (Receipt: ${result.receipt_id})`, type: 'success' })
                setCurrentPhase(targetPhase)
                // Refresh phase history
            } else {
                setToast({ message: 'Failed to transition phase', type: 'error' })
            }
        } catch (error) {
            console.error('Transition error:', error)
            setToast({ message: 'Error during transition', type: 'error' })
        }
    }

    const handleEnrollMember = async (participantId: string, role: string) => {
        try {
            const res = await fetch(`/api/clearland/memberships/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, participantId, role }),
            })

            if (res.ok) {
                setToast({ message: `Participant enrolled as ${role}`, type: 'success' })
                // Refresh members list
            } else {
                setToast({ message: 'Failed to enroll participant', type: 'error' })
            }
        } catch (error) {
            console.error('Enroll error:', error)
            setToast({ message: 'Error during enrollment', type: 'error' })
        }
    }

    const handleRemoveMember = async (participantId: string) => {
        try {
            const res = await fetch(`/api/clearland/memberships/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, participantId }),
            })

            if (res.ok) {
                setToast({ message: 'Participant removed', type: 'success' })
                setMembers(members.filter((m) => m.participant_id !== participantId))
            } else {
                setToast({ message: 'Failed to remove participant', type: 'error' })
            }
        } catch (error) {
            console.error('Remove error:', error)
            setToast({ message: 'Error during removal', type: 'error' })
        }
    }

    if (loading) {
        return (
            <main className='min-h-screen bg-background'>
                <Navbar />
                <div className='pt-20 px-6 py-12 flex items-center justify-center'>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className='w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full' />
                </div>
            </main>
        )
    }

    return (
        <main className='min-h-screen bg-background'>
            <Navbar />

            <div className='pt-20 pb-12'>
                {/* Header */}
                <div className='px-6 md:px-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className='text-sm text-foreground/60 mb-2'>Authority / Clearland / {project?.title}</div>
                        <h1 className='text-4xl font-bold text-foreground'>Phase Management</h1>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='flex items-center gap-2'>
                        <div className='px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold text-sm'>
                            Status: {project?.status}
                        </div>
                    </motion.div>
                </div>

                {/* Toast notifications */}
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mx-6 md:mx-8 mb-6 p-4 rounded-lg font-medium text-sm ${toast.type === 'success'
                                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-500 border border-red-500/30'
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}

                {/* Main content - split layout */}
                <div className='px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left column - 65% */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='lg:col-span-2 space-y-8'>
                        <PhaseTimeline entries={phaseHistory} onExportCSV={() => {
                            // Export logic
                            const csv = phaseHistory.map(p => `${p.phase},${p.effectiveFrom},${p.createdBy},${p.notes || ''}`).join('\n')
                            const blob = new Blob([csv], { type: 'text/csv' })
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `phase-history-${projectId}.csv`
                            a.click()
                        }} />
                    </motion.div>

                    {/* Right column - 35% */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className='space-y-6'>
                        <PhaseTransitionCard currentPhase={currentPhase} onTransition={handlePhaseTransition} isLoading={loading} />

                        <RoundControlCard
                            round={currentRound}
                            onOpenRound={async (start, end) => {
                                // Implement open round
                            }}
                            onCloseRound={async () => {
                                // Implement close round
                            }}
                            onLockRound={async () => {
                                // Implement lock round
                            }}
                        />

                        <MembershipPanel members={members} onEnroll={handleEnrollMember} onRemove={handleRemoveMember} />

                        {/* Ledger Summary */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                            <h3 className='text-lg font-bold mb-4 text-foreground'>Recent Activity</h3>
                            <div className='space-y-2 max-h-48 overflow-y-auto'>
                                {ledgerEntries.slice(0, 5).map((entry, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className='p-2 rounded text-xs bg-background/50'
                                    >
                                        <p className='font-semibold text-foreground'>{entry.action}</p>
                                        <p className='text-foreground/60'>{entry.actor} · {new Date(entry.timestamp).toLocaleString()}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
