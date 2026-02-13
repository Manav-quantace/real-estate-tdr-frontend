'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface RoundInfo {
    t: number
    state: string
    bidding_window_start?: string
    bidding_window_end?: string
}

interface RoundControlCardProps {
    round: RoundInfo | null
    onOpenRound: (startDate: string, endDate: string) => Promise<void>
    onCloseRound: () => Promise<void>
    onLockRound: () => Promise<void>
    isLoading?: boolean
}

export function RoundControlCard({
    round,
    onOpenRound,
    onCloseRound,
    onLockRound,
    isLoading,
}: RoundControlCardProps) {
    const [showOpenForm, setShowOpenForm] = useState(false)
    const [showLockConfirm, setShowLockConfirm] = useState(false)
    const [formData, setFormData] = useState({
        start: round?.bidding_window_start || '',
        end: round?.bidding_window_end || '',
    })
    const [actionLoading, setActionLoading] = useState(false)

    const handleOpenRound = async () => {
        if (!formData.start || !formData.end) return
        setActionLoading(true)
        try {
            await onOpenRound(formData.start, formData.end)
            setShowOpenForm(false)
        } finally {
            setActionLoading(false)
        }
    }

    const handleCloseRound = async () => {
        setActionLoading(true)
        try {
            await onCloseRound()
        } finally {
            setActionLoading(false)
        }
    }

    const handleLockRound = async () => {
        setActionLoading(true)
        try {
            await onLockRound()
            setShowLockConfirm(false)
        } finally {
            setActionLoading(false)
        }
    }

    if (!round) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
                <p className='text-foreground/60 text-sm'>No active round</p>
            </motion.div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6 rounded-xl border border-primary/20 bg-card/50'>
            <h3 className='text-lg font-bold mb-4 text-foreground'>Round Control</h3>

            <div className='mb-6 space-y-2'>
                <div>
                    <p className='text-sm text-foreground/60'>Round #</p>
                    <p className='text-2xl font-bold text-primary'>{round.t}</p>
                </div>
                <div>
                    <p className='text-sm text-foreground/60'>State</p>
                    <div className='inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary font-semibold text-sm'>
                        {round.state}
                    </div>
                </div>
            </div>

            <div className='space-y-2'>
                {round.state === 'draft' && (
                    <button
                        onClick={() => setShowOpenForm(true)}
                        className='w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-medium text-sm'
                    >
                        Open Round
                    </button>
                )}

                {round.state === 'open' && (
                    <button onClick={handleCloseRound} disabled={actionLoading} className='w-full px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 transition-all font-medium text-sm'>
                        {actionLoading ? 'Closing...' : 'Close Round'}
                    </button>
                )}

                {round.state === 'closed' && (
                    <button
                        onClick={() => setShowLockConfirm(true)}
                        className='w-full px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all font-medium text-sm'
                    >
                        Lock Round
                    </button>
                )}
            </div>

            {showOpenForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur'
                    onClick={() => setShowOpenForm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className='bg-card border border-primary/20 rounded-xl p-6 max-w-sm w-full mx-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className='text-lg font-bold mb-4 text-foreground'>Open Round {round.t}</h4>

                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium text-foreground/80 block mb-2'>Bidding Window Start</label>
                                <input
                                    type='datetime-local'
                                    value={formData.start}
                                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                    className='w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/50 text-foreground focus:outline-none focus:border-primary/50 transition-colors'
                                />
                            </div>
                            <div>
                                <label className='text-sm font-medium text-foreground/80 block mb-2'>Bidding Window End</label>
                                <input
                                    type='datetime-local'
                                    value={formData.end}
                                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                    className='w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/50 text-foreground focus:outline-none focus:border-primary/50 transition-colors'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button
                                onClick={() => setShowOpenForm(false)}
                                className='flex-1 px-4 py-2 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 transition-all font-medium text-sm'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleOpenRound}
                                disabled={actionLoading || !formData.start || !formData.end}
                                className='flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-medium text-sm'
                            >
                                {actionLoading ? 'Opening...' : 'Open'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {showLockConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur'
                    onClick={() => setShowLockConfirm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className='bg-card border border-primary/20 rounded-xl p-6 max-w-sm w-full mx-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className='text-lg font-bold mb-3 text-foreground'>Lock Round {round.t}</h4>
                        <p className='text-foreground/70 mb-6 text-sm'>This is a final action. Are you sure?</p>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => setShowLockConfirm(false)}
                                className='flex-1 px-4 py-2 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 transition-all font-medium text-sm'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLockRound}
                                disabled={actionLoading}
                                className='flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-all font-medium text-sm'
                            >
                                {actionLoading ? 'Locking...' : 'Lock'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    )
}
