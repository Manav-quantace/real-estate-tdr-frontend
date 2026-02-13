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

interface Project {
    id: string
    title: string
}

export default function AuthorityClearlandRoundsPage() {
    const params = useParams()
    const projectId = params.projectId as string

    const [project, setProject] = useState<Project | null>(null)
    const [rounds, setRounds] = useState<Round[]>([])
    const [currentRound, setCurrentRound] = useState<Round | null>(null)
    const [matching, setMatching] = useState<MatchingResult | null>(null)
    const [logs, setLogs] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [computing, setComputing] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const projRes = await fetch(`/api/projects/${projectId}`)
                const roundsRes = await fetch(`/api/rounds?workflow=clearland&projectId=${projectId}`)
                const currentRes = await fetch(`/api/rounds/current?projectId=${projectId}`)
                const matchingRes = await fetch(`/api/matching?workflow=clearland&projectId=${projectId}`)

                if (projRes.ok) {
                    const proj = await projRes.json()
                    setProject(proj)
                }

                if (roundsRes.ok) {
                    const rds = await roundsRes.json()
                    const roundsWithLatest = rds.map((r: Round, idx: number) => ({
                        ...r,
                        isLatest: idx === 0,
                    }))
                    setRounds(roundsWithLatest)
                }

                if (currentRes.ok) {
                    const current = await currentRes.json()
                    setCurrentRound(current)
                }

                if (matchingRes.ok) {
                    const result = await matchingRes.json()
                    setMatching(result)
                }

                setLogs(['System initialized', `Project loaded: ${projectId}`, 'Data synchronized'])
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

    const handleRoundAction = async (roundT: number, action: 'open' | 'close' | 'lock') => {
        try {
            let endpoint = ''
            if (action === 'open') {
                endpoint = '/api/rounds/open'
            } else if (action === 'close') {
                endpoint = '/api/rounds/close'
            } else {
                endpoint = '/api/rounds/lock'
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, t: roundT }),
            })

            if (res.ok) {
                const result = await res.json()
                setToast({
                    message: `Round ${action}ed successfully (Receipt: ${result.receipt_id})`,
                    type: 'success',
                })
                setLogs([`Round ${roundT} ${action}ed`, ...logs])

                // Update current round state
                if (currentRound && currentRound.t === roundT) {
                    setCurrentRound({ ...currentRound, state: action === 'open' ? 'open' : action === 'close' ? 'closed' : 'locked' })
                }
            } else {
                setToast({ message: `Failed to ${action} round`, type: 'error' })
            }
        } catch (error) {
            console.error(`Error ${action}ing round:`, error)
            setToast({ message: `Error during ${action}`, type: 'error' })
        }
    }

    const handleComputeMatching = async () => {
        try {
            setComputing(true)
            const res = await fetch('/api/matching/compute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, t: currentRound?.t }),
            })

            if (res.ok) {
                const result = await res.json()
                setMatching(result)
                setToast({ message: 'Matching computed successfully', type: 'success' })
                setLogs(['Matching algorithm executed', ...logs])
            } else {
                setToast({ message: 'Failed to compute matching', type: 'error' })
            }
        } catch (error) {
            console.error('Matching error:', error)
            setToast({ message: 'Error during matching computation', type: 'error' })
        } finally {
            setComputing(false)
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
                <div className='px-6 md:px-8 mb-8'>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className='text-4xl font-bold text-foreground mb-2'>Round Management</h1>
                        <p className='text-foreground/60'>Project: {project?.title}</p>
                    </motion.div>
                </div>

                {/* Toast */}
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

                {/* Stats */}
                <div className='px-6 md:px-8 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {[
                        { label: 'Current Phase', value: 'BUYER_BIDDING_OPEN' },
                        { label: 'Current Round', value: currentRound?.t.toString() || 'N/A' },
                        { label: 'Round State', value: currentRound?.state || 'N/A' },
                        { label: 'Total Rounds', value: rounds.length.toString() },
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className='p-4 rounded-lg border border-primary/20 bg-card/50'
                        >
                            <p className='text-xs text-foreground/60 mb-1'>{stat.label}</p>
                            <p className='text-2xl font-bold text-primary'>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main content grid */}
                <div className='px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left - Rounds table */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='lg:col-span-2 space-y-6'>
                        <div className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                            <h2 className='text-xl font-bold mb-4 text-foreground'>Rounds</h2>
                            <RoundsTable rounds={rounds} onAction={handleRoundAction} isLoading={false} />
                        </div>
                    </motion.div>

                    {/* Right - Matching & Logs */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className='space-y-6'>
                        {/* Matching Panel */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                            <h3 className='text-lg font-bold mb-4 text-foreground'>Matching Results</h3>

                            {matching ? (
                                <div className='space-y-3'>
                                    <div>
                                        <p className='text-sm text-foreground/60'>Round {matching.t}</p>
                                        <p className='text-sm font-semibold text-primary mt-1'>{matching.matched_ids.length} matches found</p>
                                    </div>
                                    <p className='text-sm text-foreground/70 leading-relaxed'>{matching.summary}</p>
                                    <p className='text-xs text-foreground/50'>
                                        Computed: {new Date(matching.computed_at).toLocaleString()}
                                    </p>
                                </div>
                            ) : (
                                <p className='text-sm text-foreground/60'>No matching data available</p>
                            )}

                            <button
                                onClick={handleComputeMatching}
                                disabled={computing}
                                className='w-full mt-4 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-medium text-sm'
                            >
                                {computing ? 'Computing...' : 'Compute Matching'}
                            </button>
                        </motion.div>

                        {/* Logs */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                            <h3 className='text-lg font-bold mb-4 text-foreground'>Activity Log</h3>
                            <div className='space-y-2 max-h-48 overflow-y-auto'>
                                {logs.map((log, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className='p-2 rounded text-xs bg-background/50 text-foreground/70 border-l-2 border-primary/30'
                                    >
                                        {log}
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
