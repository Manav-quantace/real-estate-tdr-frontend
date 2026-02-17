//app/authority/clearland/components/phase-transition-card.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PhaseTransitionCardProps {
    currentPhase: string
    onTransition: (targetPhase: string) => Promise<void>
    isLoading?: boolean
}

const CLEARLAND_PHASE_ORDER = [
    'INIT',
    'DEVELOPER_ASK_OPEN',
    'BUYER_BIDDING_OPEN',
    'PREFERENCES_COLLECTED',
    'LOCKED',
    'SETTLED',
    'CLOSED',
]

export function PhaseTransitionCard({
    currentPhase,
    onTransition,
    isLoading,
}: PhaseTransitionCardProps) {
    const [selectedPhase, setSelectedPhase] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [transitioning, setTransitioning] = useState(false)

    const currentIdx = CLEARLAND_PHASE_ORDER.indexOf(currentPhase)

    const availablePhases =
        currentIdx === -1
            ? ['INIT']
            : CLEARLAND_PHASE_ORDER.slice(currentIdx + 1)

    const handleTransition = async () => {
        if (!selectedPhase) return
        setTransitioning(true)
        try {
            await onTransition(selectedPhase)
            setSelectedPhase('')
            setShowConfirm(false)
        } finally {
            setTransitioning(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-primary/20 bg-card/50"
        >
            <h3 className="text-lg font-bold mb-4 text-foreground">
                Phase Control
            </h3>

            <div className="mb-4">
                <p className="text-sm text-foreground/60 mb-2">
                    Current Phase
                </p>
                <div className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                    {currentPhase || '—'}
                </div>
            </div>

            <div className="mb-6 space-y-3">
                <label className="text-sm font-medium text-foreground/80 block">
                    Transition to Phase
                </label>
                <select
                    value={selectedPhase}
                    onChange={(e) => setSelectedPhase(e.target.value)}
                    disabled={isLoading || availablePhases.length === 0}
                    className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/50 text-foreground disabled:opacity-50 focus:outline-none focus:border-primary/50 transition-colors"
                >
                    <option value="">Select target phase</option>
                    {availablePhases.map((phase) => (
                        <option key={phase} value={phase}>
                            {phase}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => setShowConfirm(true)}
                disabled={!selectedPhase || isLoading || transitioning}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-medium text-sm"
            >
                {transitioning ? 'Transitioning…' : 'Transition →'}
            </button>

            {showConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
                    onClick={() => setShowConfirm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-card border border-primary/20 rounded-xl p-6 max-w-sm w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-lg font-bold mb-3 text-foreground">
                            Confirm phase transition
                        </h4>
                        <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
                            Transition project to{' '}
                            <span className="font-semibold">
                                {selectedPhase}
                            </span>
                            . This action is recorded in the ledger and cannot
                            be reversed.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 transition-all font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransition}
                                disabled={transitioning}
                                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-medium text-sm"
                            >
                                {transitioning ? 'Confirming…' : 'Confirm'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    )
}