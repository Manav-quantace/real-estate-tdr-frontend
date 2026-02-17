//app/authority/clearland/components/phase-timeline.tsx
'use client'

import { motion } from 'framer-motion'

interface PhaseEntry {
    phase: string
    effectiveFrom: string
    createdBy: string
    notes?: unknown
}

interface PhaseTimelineProps {
    entries: PhaseEntry[]
    onExportCSV?: () => void
}

export function PhaseTimeline({ entries, onExportCSV }: PhaseTimelineProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    }

    const renderNotes = (notes: unknown) => {
        if (!notes) return null

        if (typeof notes === 'string') {
            return notes
        }

        if (typeof notes === 'object') {
            const obj = notes as Record<string, any>

            if (obj.requested_by) {
                return `Requested by ${obj.requested_by}`
            }

            // fallback for future structured metadata
            return JSON.stringify(obj)
        }

        return String(notes)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-bold text-foreground'>Phase Timeline</h3>
                {onExportCSV && (
                    <button
                        onClick={onExportCSV}
                        className='px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all text-sm font-medium'
                    >
                        Export CSV
                    </button>
                )}
            </div>

            <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='relative space-y-4'
            >
                {entries.length === 0 ? (
                    <div className='py-8 text-center text-foreground/60'>
                        No phase history available
                    </div>
                ) : (
                    <>
                        <div className='absolute left-6 top-8 bottom-0 w-0.5 bg-linear-to-b from-primary to-transparent' />
                        {entries.map((entry, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className='pl-20 relative'
                            >
                                <div
                                    className={`absolute left-0 w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                                        idx === 0
                                            ? 'border-primary bg-primary/20 text-primary font-bold'
                                            : 'border-primary/30 bg-card text-foreground/60'
                                    }`}
                                >
                                    {idx + 1}
                                </div>

                                <div className='p-4 rounded-lg border border-primary/20 bg-card/50 hover:bg-card/80 transition-all'>
                                    <div className='flex items-start justify-between mb-2'>
                                        <span className='text-lg font-semibold text-primary'>
                                            {entry.phase}
                                        </span>
                                        <span className='text-xs text-foreground/60'>
                                            {entry.createdBy}
                                        </span>
                                    </div>

                                    <div className='text-sm text-foreground/70 mb-2'>
                                        Effective:{' '}
                                        {new Date(
                                            entry.effectiveFrom
                                        ).toLocaleDateString()}
                                    </div>

                                    {renderNotes(entry.notes) && (
                                        <div className='text-sm text-foreground/60 italic'>
                                            {renderNotes(entry.notes)}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}
            </motion.div>
        </div>
    )
}