'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

import { useAuth } from '@/lib/auth-context'
import Navbar from '@/app/(protected)/components/navbar'

interface CurrentRound {
    t: number
    state: string
}

interface Receipt {
    receipt_id: string
    bid_id: string
    created_at: string
}

export default function ClearlandActionsPage() {
    const params = useParams()
    const { user } = useAuth()
    const projectId = params.projectId as string

    const [currentRound, setCurrentRound] = useState<CurrentRound | null>(null)
    const [activeTab, setActiveTab] = useState<'ask' | 'quote' | 'preferences'>('ask')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [receipt, setReceipt] = useState<Receipt | null>(null)
    const [formData, setFormData] = useState({
        ask_price: '',
        ask_description: '',
        ask_timeline: '',
        quote_price: '',
        quote_notes: '',
        preferences_points: '',
    })

    useEffect(() => {
        const fetchRound = async () => {
            try {
                const res = await fetch(`/api/rounds/current?projectId=${projectId}`)
                if (res.ok) {
                    const round = await res.json()
                    setCurrentRound(round)
                }
            } catch (error) {
                console.error('Error fetching current round:', error)
            } finally {
                setLoading(false)
            }
        }

        if (projectId) {
            fetchRound()
        }
    }, [projectId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmitAsk = async () => {
        if (!formData.ask_price || !formData.ask_description) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/bids/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    t: currentRound?.t,
                    price: parseFloat(formData.ask_price),
                    description: formData.ask_description,
                    timeline: formData.ask_timeline,
                }),
            })

            if (res.ok) {
                const result = await res.json()
                setReceipt(result)
                setFormData({ ...formData, ask_price: '', ask_description: '', ask_timeline: '' })
            }
        } catch (error) {
            console.error('Submit error:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmitQuote = async () => {
        if (!formData.quote_price) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/bids/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    t: currentRound?.t,
                    price: parseFloat(formData.quote_price),
                    notes: formData.quote_notes,
                }),
            })

            if (res.ok) {
                const result = await res.json()
                setReceipt(result)
                setFormData({ ...formData, quote_price: '', quote_notes: '' })
            }
        } catch (error) {
            console.error('Submit error:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmitPreferences = async () => {
        if (!formData.preferences_points) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/bids/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    t: currentRound?.t,
                    preferences: formData.preferences_points.split(',').map((p) => p.trim()),
                }),
            })

            if (res.ok) {
                const result = await res.json()
                setReceipt(result)
                setFormData({ ...formData, preferences_points: '' })
            }
        } catch (error) {
            console.error('Submit error:', error)
        } finally {
            setSubmitting(false)
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='px-6 md:px-8 mb-8'>
                    <h1 className='text-4xl font-bold text-foreground mb-2'>Submit Your Bid</h1>
                    <p className='text-foreground/60'>Project {projectId} · Round {currentRound?.t}</p>
                </motion.div>

                <div className='px-6 md:px-8 max-w-3xl mx-auto'>
                    {/* Receipt Display */}
                    {receipt && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mb-8 p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10'
                        >
                            <h3 className='text-lg font-bold text-emerald-500 mb-2'>Submission Successful</h3>
                            <p className='text-foreground/70 text-sm mb-4'>Your bid has been submitted.</p>
                            <div className='space-y-2 text-sm font-mono text-foreground/60 mb-4'>
                                <p>Receipt ID: {receipt.receipt_id}</p>
                                <p>Bid ID: {receipt.bid_id}</p>
                                <p>Submitted: {new Date(receipt.created_at).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setReceipt(null)}
                                className='px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-medium text-sm'
                            >
                                Submit Another
                            </button>
                        </motion.div>
                    )}

                    {/* Tab Navigation */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-8 border-b border-primary/10'>
                        <div className='flex gap-8 overflow-x-auto'>
                            {[
                                { id: 'ask', label: 'Submit Ask', role: 'DEVELOPER' },
                                { id: 'quote', label: 'Submit Quote', role: 'BUYER' },
                                { id: 'preferences', label: 'Submit Preferences', role: 'SLUM_DWELLER' },
                            ].map((tab) => {
                                const canAccess = user?.role === tab.role
                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`py-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : canAccess ? 'text-foreground/60 hover:text-foreground' : 'text-foreground/30'
                                            } disabled:opacity-50`}
                                        disabled={!canAccess}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && <motion.div layoutId='activeTab' className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Forms */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='space-y-6'>
                        {/* Ask Form */}
                        {activeTab === 'ask' && user?.role === 'DEVELOPER' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-8 rounded-xl border border-primary/20 bg-card/50'>
                                <h2 className='text-2xl font-bold mb-6 text-foreground'>Development Ask</h2>

                                <div className='space-y-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-foreground/80 mb-2'>Ask Price (₹)</label>
                                        <input
                                            type='number'
                                            name='ask_price'
                                            value={formData.ask_price}
                                            onChange={handleInputChange}
                                            placeholder='Enter amount in rupees'
                                            className='w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-foreground/80 mb-2'>Description</label>
                                        <textarea
                                            name='ask_description'
                                            value={formData.ask_description}
                                            onChange={handleInputChange}
                                            placeholder='Describe your development proposal...'
                                            rows={4}
                                            className='w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-foreground/80 mb-2'>Timeline</label>
                                        <input
                                            type='text'
                                            name='ask_timeline'
                                            value={formData.ask_timeline}
                                            onChange={handleInputChange}
                                            placeholder='e.g., 18 months'
                                            className='w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors'
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmitAsk}
                                        disabled={submitting || !formData.ask_price || !formData.ask_description}
                                        className='w-full px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-semibold'
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Ask'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Quote Form */}
                        {activeTab === 'quote' && user?.role === 'BUYER' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-8 rounded-xl border border-primary/20 bg-card/50'>
                                <h2 className='text-2xl font-bold mb-6 text-foreground'>Buyer Quote</h2>

                                <div className='space-y-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-foreground/80 mb-2'>Quote Price (₹)</label>
                                        <input
                                            type='number'
                                            name='quote_price'
                                            value={formData.quote_price}
                                            onChange={handleInputChange}
                                            placeholder='Enter your bid price'
                                            className='w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-foreground/80 mb-2'>Notes</label>
                                        <textarea
                                            name='quote_notes'
                                            value={formData.quote_notes}
                                            onChange={handleInputChange}
                                            placeholder='Add any additional notes...'
                                            rows={4}
                                            className='w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none'
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmitQuote}
                                        disabled={submitting || !formData.quote_price}
                                        className='w-full px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-semibold'
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Quote'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Preferences Form */}
                        {activeTab === 'preferences' && user?.role === 'SLUM_DWELLER' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-8 rounded-xl border border-primary/20 bg-card/50'>
                                <h2 className='text-2xl font-bold mb-6 text-foreground'>Preferences</h2>

                                <div className='space-y-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-foreground/80 mb-2'>Preferences (comma-separated)</label>
                                        <textarea
                                            name='preferences_points'
                                            value={formData.preferences_points}
                                            onChange={handleInputChange}
                                            placeholder='Enter preferences separated by commas...'
                                            rows={4}
                                            className='w-full px-4 py-3 rounded-lg border border-primary/20 bg-background/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none'
                                        />
                                        <p className='text-xs text-foreground/50 mt-2'>Example: Ground floor apartment, Near school, 2-3 bedroom</p>
                                    </div>

                                    <button
                                        onClick={handleSubmitPreferences}
                                        disabled={submitting || !formData.preferences_points}
                                        className='w-full px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all font-semibold'
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Preferences'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* No access message */}
                        {activeTab === 'ask' && user?.role !== 'DEVELOPER' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-center'>
                                <p className='text-foreground/70'>Only DEVELOPER role can submit an ask.</p>
                            </motion.div>
                        )}

                        {activeTab === 'quote' && user?.role !== 'BUYER' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-center'>
                                <p className='text-foreground/70'>Only BUYER role can submit a quote.</p>
                            </motion.div>
                        )}

                        {activeTab === 'preferences' && user?.role !== 'SLUM_DWELLER' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-center'>
                                <p className='text-foreground/70'>Only SLUM_DWELLER role can submit preferences.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
