//app/authority/clearland/components/round-table.tsx
'use client'

import { motion } from 'framer-motion'

interface Round {
    t: number
    state: string
    bidding_window_start?: string
    bidding_window_end?: string
    isLatest?: boolean
}

interface RoundsTableProps {
    rounds: Round[]
    onAction: (roundT: number, action: 'open' | 'close' | 'lock') => Promise<void>
    isLoading?: boolean
}

export function RoundsTable({ rounds, onAction, isLoading }: RoundsTableProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className='overflow-x-auto'>
            <motion.table initial='hidden' animate='visible' variants={containerVariants} className='w-full'>
                <thead>
                    <tr className='border-b border-primary/20'>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-foreground/80'>Round #</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-foreground/80'>State</th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-foreground/80'>Bidding Window</th>
                        <th className='px-4 py-3 text-right text-sm font-semibold text-foreground/80'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map((round, idx) => (
                        <motion.tr key={round.t} variants={itemVariants} className={`border-b border-primary/10 hover:bg-primary/5 transition-colors ${round.isLatest ? 'bg-primary/10' : ''}`}>
                            <td className='px-4 py-3 text-sm font-medium text-foreground'>
                                Round {round.t}
                                {round.isLatest && <span className='ml-2 text-xs px-2 py-1 rounded-full bg-primary/20 text-primary'>Latest</span>}
                            </td>
                            <td className='px-4 py-3 text-sm'>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${round.state === 'draft'
                                        ? 'bg-gray-500/20 text-gray-500'
                                        : round.state === 'open'
                                            ? 'bg-primary/20 text-primary'
                                            : round.state === 'closed'
                                                ? 'bg-yellow-500/20 text-yellow-500'
                                                : 'bg-emerald-500/20 text-emerald-500'
                                    }`}>
                                    {round.state}
                                </span>
                            </td>
                            <td className='px-4 py-3 text-sm text-foreground/70'>
                                {round.bidding_window_start ? (
                                    <>
                                        {new Date(round.bidding_window_start).toLocaleDateString()} to{' '}
                                        {new Date(round.bidding_window_end || '').toLocaleDateString()}
                                    </>
                                ) : (
                                    <span className='text-foreground/50'>Not set</span>
                                )}
                            </td>
                            <td className='px-4 py-3 text-right'>
                                {round.isLatest && (
                                    <div className='flex justify-end gap-2'>
                                        {round.state === 'draft' && (
                                            <button
                                                onClick={() => onAction(round.t, 'open')}
                                                disabled={isLoading}
                                                className='px-3 py-1 text-xs rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 transition-all font-medium'
                                            >
                                                Open
                                            </button>
                                        )}
                                        {round.state === 'open' && (
                                            <button
                                                onClick={() => onAction(round.t, 'close')}
                                                disabled={isLoading}
                                                className='px-3 py-1 text-xs rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 disabled:opacity-50 transition-all font-medium'
                                            >
                                                Close
                                            </button>
                                        )}
                                        {round.state === 'closed' && (
                                            <button
                                                onClick={() => onAction(round.t, 'lock')}
                                                disabled={isLoading}
                                                className='px-3 py-1 text-xs rounded-lg bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 disabled:opacity-50 transition-all font-medium'
                                            >
                                                Lock
                                            </button>
                                        )}
                                    </div>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>

            {rounds.length === 0 && (
                <div className='py-8 text-center text-foreground/60'>No rounds available</div>
            )}
        </div>
    )
}
