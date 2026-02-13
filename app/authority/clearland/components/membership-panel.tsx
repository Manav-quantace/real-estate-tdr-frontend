'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Member {
    participant_id: string
    role: string
    status: string
    enrolled_at: string
    name?: string
}

interface MembershipPanelProps {
    members: Member[]
    onEnroll: (participantId: string, role: string) => Promise<void>
    onRemove: (participantId: string) => Promise<void>
    isLoading?: boolean
}

export function MembershipPanel({ members, onEnroll, onRemove, isLoading }: MembershipPanelProps) {
    const [showEnrollModal, setShowEnrollModal] = useState(false)
    const [enrollForm, setEnrollForm] = useState({ participantId: '', role: '' })
    const [enrolling, setEnrolling] = useState(false)

    const handleEnroll = async () => {
        if (!enrollForm.participantId || !enrollForm.role) return
        setEnrolling(true)
        try {
            await onEnroll(enrollForm.participantId, enrollForm.role)
            setEnrollForm({ participantId: '', role: '' })
            setShowEnrollModal(false)
        } finally {
            setEnrolling(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-bold text-foreground'>Enrolled Participants</h3>
                <button
                    onClick={() => setShowEnrollModal(true)}
                    className='px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm font-medium'
                >
                    Enroll
                </button>
            </div>

            <div className='space-y-2 max-h-96 overflow-y-auto'>
                {members.length === 0 ? (
                    <div className='py-6 text-center text-foreground/60 text-sm'>No participants enrolled</div>
                ) : (
                    members.map((member, idx) => (
                        <motion.div
                            key={member.participant_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className='p-3 rounded-lg border border-primary/10 bg-card/50 hover:bg-card/80 transition-all flex items-start justify-between group'
                        >
                            <div className='flex-1'>
                                <p className='font-semibold text-foreground text-sm'>{member.name || member.participant_id}</p>
                                <p className='text-xs text-foreground/60'>
                                    {member.role} · {member.status}
                                </p>
                                <p className='text-xs text-foreground/50 mt-1'>
                                    Enrolled {new Date(member.enrolled_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => onRemove(member.participant_id)}
                                className='px-2 py-1 rounded text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all'
                            >
                                Remove
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {showEnrollModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur'
                    onClick={() => setShowEnrollModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className='bg-card border border-primary/20 rounded-xl p-6 max-w-sm w-full mx-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className='text-lg font-bold mb-4 text-foreground'>Enroll Participant</h4>

                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium text-foreground/80 block mb-2'>Participant ID</label>
                                <input
                                    type='text'
                                    value={enrollForm.participantId}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, participantId: e.target.value })}
                                    className='w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors'
                                    placeholder='Enter participant ID'
                                />
                            </div>

                            <div>
                                <label className='text-sm font-medium text-foreground/80 block mb-2'>Role</label>
                                <select
                                    value={enrollForm.role}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, role: e.target.value })}
                                    className='w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/50 text-foreground focus:outline-none focus:border-primary/50 transition-colors'
                                >
                                    <option value=''>Select role</option>
                                    <option value='DEVELOPER'>Developer</option>
                                    <option value='BUYER'>Buyer</option>
                                    <option value='AUDITOR'>Auditor</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button
                                onClick={() => setShowEnrollModal(false)}
                                className='flex-1 px-4 py-2 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 transition-all font-medium text-sm'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling || !enrollForm.participantId || !enrollForm.role}
                                className='flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-medium text-sm'
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    )
}
