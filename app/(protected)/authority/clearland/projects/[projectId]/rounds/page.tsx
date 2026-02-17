//app/authority/clearland/projects/[projectId]/rounds/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/app/(protected)/components/navbar'
import { RoundsTable } from '../../../components/round-table'

interface Round {
    t: number
    state: string
    bidding_window_start?: string
    bidding_window_end?: string
}

interface MatchingResult {
    t: number
    matched_ids: string[]
    summary: string
    computed_at: string
}

export default function AuthorityClearlandRoundsPage() {
    const params = useParams()
    const projectId = params.projectId as string

    const [rounds, setRounds] = useState<Round[]>([])
    const [currentRound, setCurrentRound] = useState<Round | null>(null)
    const [matching, setMatching] = useState<MatchingResult | null>(null)
    const [logs, setLogs] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [computing, setComputing] = useState(false)
    const [creatingRound, setCreatingRound] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    /** -------------------------------
     * Fetch rounds + current round
     * -------------------------------- */
    const fetchData = async () => {
        try {
            setLoading(true)

            const roundsRes = await fetch(
                `/api/rounds?workflow=clearland&projectId=${projectId}`
            )

            const currentRes = await fetch(
                `/api/rounds/current?workflow=clearland&projectId=${projectId}`
            )

            if (roundsRes.ok) {
                const rds = await roundsRes.json()
                setRounds(
                    rds.map((r: Round, idx: number) => ({
                        ...r,
                        isLatest: idx === 0,
                    }))
                )
            }

            if (currentRes.ok) {
                const current = await currentRes.json()
                setCurrentRound(current)
            }

            setLogs([
                'System initialized',
                `Project loaded: ${projectId}`,
                'Rounds synchronized',
            ])
        } catch (err) {
            console.error(err)
            setToast({ message: 'Error loading round data', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (projectId) fetchData()
    }, [projectId])

    /** -------------------------------
     * Create / Open next round
     * -------------------------------- */
    const handleCreateRound = async () => {
        try {
            setCreatingRound(true)

            const res = await fetch('/api/rounds/open', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'clearland',
                    projectId,
                }),
            })

            if (!res.ok) {
                setToast({ message: 'Failed to create round', type: 'error' })
                return
            }

            setToast({ message: 'New round opened successfully', type: 'success' })
            setLogs(prev => ['New round opened', ...prev])

            await fetchData()
        } catch (e) {
            setToast({ message: 'Error creating round', type: 'error' })
        } finally {
            setCreatingRound(false)
        }
    }

    /** -------------------------------
     * Round actions (open/close/lock)
     * -------------------------------- */
    const handleRoundAction = async (
        roundT: number,
        action: 'open' | 'close' | 'lock'
    ) => {
        try {
            const endpoint =
                action === 'open'
                    ? '/api/rounds/open'
                    : action === 'close'
                        ? '/api/rounds/close'
                        : '/api/rounds/lock'

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, t: roundT }),
            })

            if (!res.ok) {
                setToast({ message: `Failed to ${action} round`, type: 'error' })
                return
            }

            setToast({ message: `Round ${action}ed successfully`, type: 'success' })
            setLogs(prev => [`Round ${roundT} ${action}ed`, ...prev])

            await fetchData()
        } catch {
            setToast({ message: `Error during ${action}`, type: 'error' })
        }
    }

    /** -------------------------------
     * Compute matching
     * -------------------------------- */
    const handleComputeMatching = async () => {
        if (typeof currentRound?.t !== 'number') return

        try {
            setComputing(true)

            const res = await fetch('/api/matching/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: 'clearland',
                    projectId,
                    t: currentRound.t,
                }),
            })

            if (!res.ok) {
                setToast({ message: 'Failed to compute matching', type: 'error' })
                return
            }

            const result = await res.json()
            setMatching(result)
            setLogs(prev => ['Matching computed', ...prev])
            setToast({ message: 'Matching computed successfully', type: 'success' })
        } catch {
            setToast({ message: 'Error computing matching', type: 'error' })
        } finally {
            setComputing(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-20 px-6 py-12 flex justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
                    />
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-20 pb-12 px-6 md:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold">Round Management</h1>
                        <p className="text-foreground/60">Project ID: {projectId}</p>
                    </div>

                    <button
                        onClick={handleCreateRound}
                        disabled={creatingRound}
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                        {creatingRound ? 'Creating…' : '+ Open New Round'}
                    </button>
                </div>

                {/* Toast */}
                {toast && (
                    <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium ${toast.type === 'success'
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : 'bg-red-500/20 text-red-500'
                            }`}
                    >
                        {toast.message}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Current Phase', value: 'CLEARLAND' },
                        {
                            label: 'Current Round',
                            value:
                                typeof currentRound?.t === 'number'
                                    ? currentRound.t.toString()
                                    : 'N/A',
                        },
                        { label: 'Round State', value: currentRound?.state || 'N/A' },
                        { label: 'Total Rounds', value: rounds.length.toString() },
                    ].map(stat => (
                        <div
                            key={stat.label}
                            className="p-4 rounded-lg border border-primary/20 bg-card/50"
                        >
                            <p className="text-xs text-foreground/60">{stat.label}</p>
                            <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Rounds */}
                    <div className="lg:col-span-2">
                        <div className="p-6 rounded-xl border border-primary/20 bg-card/50">
                            <h2 className="text-xl font-bold mb-4">Rounds</h2>
                            <RoundsTable
                                rounds={rounds}
                                onAction={handleRoundAction}
                                isLoading={false}
                            />
                        </div>
                    </div>

                    {/* Matching + Logs */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-primary/20 bg-card/50">
                            <h3 className="text-lg font-bold mb-4">Matching</h3>
                            <button
                                onClick={handleComputeMatching}
                                disabled={computing || typeof currentRound?.t !== 'number'}
                                className="w-full px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                            >
                                {computing ? 'Computing…' : 'Compute Matching'}
                            </button>
                        </div>

                        <div className="p-6 rounded-xl border border-primary/20 bg-card/50">
                            <h3 className="text-lg font-bold mb-4">Activity Log</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {logs.map((log, i) => (
                                    <div
                                        key={i}
                                        className="text-xs p-2 bg-background/50 border-l-2 border-primary/30"
                                    >
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}