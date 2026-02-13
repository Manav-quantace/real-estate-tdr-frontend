'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { useAuth } from '@/lib/auth-context'
import Navbar from '@/app/(protected)/components/navbar'

interface CurrentPhase {
    phase: string
    effectiveFrom: string
    description: string
}

interface PhaseEntry {
    phase: string
    effectiveFrom: string
    createdBy: string
}

interface Bid {
    id: string
    type: string
    status: string
    amount?: number
    created_at: string
}

interface Membership {
    participant_id: string
    role: string
    status: string
    enrolled_at: string
}

export default function ClearlandProjectDashboard() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const projectId = params.projectId as string

    const [currentPhase, setCurrentPhase] = useState<CurrentPhase | null>(null)
    const [phaseHistory, setPhaseHistory] = useState<PhaseEntry[]>([])
    const [myBids, setMyBids] = useState<Bid[]>([])
    const [membership, setMembership] = useState<Membership | null>(null)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const phaseRes = await fetch(`/api/clearland/phase/current?projectId=${projectId}`)
                const historyRes = await fetch(`/api/clearland/phase/history?projectId=${projectId}`)
                const bidsRes = await fetch(`/api/bids/my-current?projectId=${projectId}&workflow=clearland`)
                const membershipRes = await fetch(`/api/clearland/memberships/my?projectId=${projectId}`)

                if (phaseRes.ok) {
                    const phase = await phaseRes.json()
                    setCurrentPhase(phase)
                }

                if (historyRes.ok) {
                    const history = await historyRes.json()
                    setPhaseHistory(history.slice(0, 5))
                }

                if (bidsRes.ok) {
                    const bids = await bidsRes.json()
                    setMyBids(bids.slice(0, 3))
                }

                if (membershipRes.ok) {
                    const membership = await membershipRes.json()
                    setMembership(membership)
                    setIsEnrolled(membership?.status === 'active')
                }
            } catch (err) {
                console.error('Error fetching data:', err)
                setError('Failed to load project data')
            } finally {
                setLoading(false)
            }
        }

        if (projectId) {
            fetchData()
        }
    }, [projectId])

    const getRoleActions = () => {
        const actions = []

        if (!isEnrolled) {
            return [{ label: 'Request Access', href: '#', disabled: true, description: 'Contact authority to enroll' }]
        }

        if (user?.role === 'DEVELOPER') {
            actions.push({
                label: 'Submit Ask',
                href: `/clearland/project/${projectId}/actions`,
                disabled: false,
                description: 'Submit your development ask',
            })
        } else if (user?.role === 'BUYER') {
            actions.push({
                label: 'Submit Quote',
                href: `/clearland/project/${projectId}/actions`,
                disabled: false,
                description: 'Submit your bid quote',
            })
        }

        actions.push({
            label: 'View History',
            href: `#`,
            disabled: false,
            description: 'Full timeline of phases',
        })

        return actions
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
                {/* Phase Banner */}
                {currentPhase ? (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8 px-6 md:px-8'
                    >
                        <div className='relative overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-8 md:p-12'>
                            <div className='absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl' />
                            <div className='relative z-10'>
                                <p className='text-sm text-primary font-semibold uppercase mb-2'>Current Phase</p>
                                <div className='mb-4 inline-block px-6 py-3 rounded-full bg-primary/20 border border-primary/40'>
                                    <h1 className='text-3xl md:text-4xl font-bold text-primary'>{currentPhase.phase}</h1>
                                </div>
                                <p className='text-foreground/70 max-w-2xl leading-relaxed'>
                                    {currentPhase.description}
                                </p>
                                <p className='text-sm text-foreground/60 mt-3'>
                                    Effective from {new Date(currentPhase.effectiveFrom).toLocaleDateString()}
                                </p>
                                {!isEnrolled && (
                                    <p className='text-sm text-secondary mt-3 font-medium'>
                                        Contact authority for access
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : null}

                {/* Main content */}
                <div className='px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left - Actions & Status */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='lg:col-span-2 space-y-8'>
                        {/* Enrollment Status */}
                        {!isEnrolled && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10'
                            >
                                <h3 className='text-lg font-bold text-yellow-500 mb-2'>Not Enrolled</h3>
                                <p className='text-foreground/70 text-sm mb-4'>
                                    You are currently not enrolled in this project. To participate, contact the project authority to request enrollment as a {user?.role || 'participant'}.
                                </p>
                                <div className='text-sm text-foreground/60 space-y-1'>
                                    <p>Authority Contact: authority@redevelopment.gov</p>
                                    <p>Project ID: {projectId}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Cards */}
                        <div>
                            <h2 className='text-2xl font-bold mb-4 text-foreground'>Allowed Actions</h2>
                            <div className='grid md:grid-cols-2 gap-4'>
                                {getRoleActions().map((action, idx) => (
                                    <motion.div
                                        key={action.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link href={action.href} className={action.disabled ? 'pointer-events-none' : ''}>
                                            <div
                                                className={`p-6 rounded-xl border transition-all ${action.disabled
                                                        ? 'border-primary/10 bg-card/30 opacity-60 cursor-not-allowed'
                                                        : 'border-primary/30 bg-card/50 hover:border-primary/60 hover:bg-card/80 cursor-pointer'
                                                    }`}
                                            >
                                                <h3 className='text-lg font-bold text-foreground mb-1'>{action.label}</h3>
                                                <p className='text-sm text-foreground/60'>{action.description}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* My Bids */}
                        {isEnrolled && (
                            <div>
                                <div className='flex items-center justify-between mb-4'>
                                    <h2 className='text-2xl font-bold text-foreground'>My Bids</h2>
                                    <Link
                                        href={`/clearland/project/${projectId}/my-bids`}
                                        className='text-sm text-primary hover:text-primary/80 font-medium'
                                    >
                                        View all
                                    </Link>
                                </div>

                                {myBids.length === 0 ? (
                                    <div className='p-6 rounded-xl border border-primary/10 bg-card/50 text-center'>
                                        <p className='text-foreground/60'>No bids yet</p>
                                    </div>
                                ) : (
                                    <div className='space-y-3'>
                                        {myBids.map((bid, idx) => (
                                            <motion.div
                                                key={bid.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className='p-4 rounded-lg border border-primary/20 bg-card/50 hover:bg-card/80 transition-all'
                                            >
                                                <div className='flex items-start justify-between'>
                                                    <div>
                                                        <p className='font-semibold text-foreground'>{bid.type}</p>
                                                        <p className='text-xs text-foreground/60 mt-1'>
                                                            {new Date(bid.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-full font-medium ${bid.status === 'submitted'
                                                                ? 'bg-primary/20 text-primary'
                                                                : bid.status === 'draft'
                                                                    ? 'bg-yellow-500/20 text-yellow-500'
                                                                    : 'bg-emerald-500/20 text-emerald-500'
                                                            }`}
                                                    >
                                                        {bid.status}
                                                    </span>
                                                </div>
                                                {bid.amount && (
                                                    <p className='text-lg font-bold text-primary mt-2'>₹{bid.amount.toLocaleString()}</p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Right - Timeline & Status */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className='space-y-6'>
                        {/* Membership Status */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                            <h3 className='text-lg font-bold mb-4 text-foreground'>Status</h3>
                            {membership ? (
                                <div className='space-y-3'>
                                    <div>
                                        <p className='text-sm text-foreground/60'>Role</p>
                                        <p className='text-lg font-semibold text-primary'>{membership.role}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-foreground/60'>Enrollment</p>
                                        <p className='text-sm font-medium text-foreground'>{membership.status}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-foreground/60'>Enrolled Since</p>
                                        <p className='text-sm text-foreground'>
                                            {new Date(membership.enrolled_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className='text-sm text-foreground/60'>Not enrolled</p>
                            )}
                        </motion.div>

                        {/* Phase Timeline */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                            <h3 className='text-lg font-bold mb-4 text-foreground'>Recent Phases</h3>
                            <div className='space-y-3'>
                                {phaseHistory.length === 0 ? (
                                    <p className='text-sm text-foreground/60'>No phase history</p>
                                ) : (
                                    phaseHistory.map((phase, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className='pb-3 border-b border-primary/10 last:border-b-0 last:pb-0'
                                        >
                                            <p className='text-sm font-semibold text-primary'>{phase.phase}</p>
                                            <p className='text-xs text-foreground/60 mt-1'>
                                                {new Date(phase.effectiveFrom).toLocaleDateString()}
                                            </p>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
