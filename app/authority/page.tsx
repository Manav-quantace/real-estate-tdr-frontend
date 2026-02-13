// app/authority/page.tsx
// app/authority/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../(protected)/components/navbar'
import { toast } from 'sonner'

type Metric = {
    label: string
    value: string
    icon: string
}

export default function AuthorityPage() {
    const [activeTab, setActiveTab] =
        useState<'overview' | 'workflows' | 'rounds' | 'analytics'>('overview')

    const [metrics, setMetrics] = useState<Metric[]>([])
    const [loadingMetrics, setLoadingMetrics] = useState(true)

    /* -------------------------------------------------------------
       METRICS (best-effort, no new APIs)
       ------------------------------------------------------------- */
    useEffect(() => {
        async function loadMetrics() {
            try {
                const workflows = ['saleable', 'clearland', 'slum', 'subsidized']

                let projectCount = 0
                let openRounds = 0
                let lockedRounds = 0

                for (const wf of workflows) {
                    const pRes = await fetch(`/api/projects?workflow=${wf}`, { cache: 'no-store' })
                    if (pRes.ok) {
                        const pJson = await pRes.json()
                        const projects = Array.isArray(pJson)
                            ? pJson
                            : pJson.items ?? []

                        projectCount += projects.length

                        for (const p of projects) {
                            const rRes = await fetch(
                                `/api/rounds/current?workflow=${wf}&projectId=${p.projectId ?? p.id}`,
                                { cache: 'no-store' }
                            )
                            if (rRes.ok) {
                                const rJson = await rRes.json()
                                const r = rJson.current
                                if (r?.is_open) openRounds++
                                if (r?.is_locked) lockedRounds++
                            }
                        }
                    }
                }

                setMetrics([
                    { label: 'Active Projects', value: String(projectCount), icon: '📊' },
                    { label: 'Open Rounds', value: String(openRounds), icon: '🔄' },
                    { label: 'Locked Auctions', value: String(lockedRounds), icon: '⚡' },
                    { label: 'Participants', value: '—', icon: '👥' }, // no API yet
                    { label: 'Total Bids', value: '—', icon: '💰' }, // no aggregate API
                    { label: 'Settlement Rate', value: '—', icon: '✓️' }, // future
                ])
            } catch (e) {
                toast.error('Failed to load metrics')
            } finally {
                setLoadingMetrics(false)
            }
        }

        loadMetrics()
    }, [])

    /* -------------------------------------------------------------
       STATIC CONFIG (unchanged)
       ------------------------------------------------------------- */
    const workflows = [
        { id: 'saleable', label: 'Saleable', icon: '🏗️', href: '/authority/saleable/projects' },
        { id: 'clearland', label: 'Clear Land', icon: '🌍', href: '/authority/clearland/projects' },
        { id: 'slum', label: 'Slum Redevelopment', icon: '👥', href: '/authority/slum/projects' },
        { id: 'subsidized', label: 'Subsidized', icon: '🏠', href: '/authority/subsidized/projects' },
    ]

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-20 pb-12">
                {/* Header */}
                <div className="px-6 md:px-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Authority Dashboard
                        </h1>
                        <p className="text-foreground/60 font-light">
                            Institutional market management and oversight
                        </p>
                    </motion.div>
                </div>

                {/* Metrics */}
                <div className="px-6 md:px-8 mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {(loadingMetrics ? Array(6).fill(null) : metrics).map((m, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="p-4 rounded-xl border border-primary/20 bg-card/50 backdrop-blur"
                            >
                                <div className="text-2xl mb-2">{m?.icon ?? '⏳'}</div>
                                <div className="text-2xl font-bold text-primary">
                                    {m?.value ?? '—'}
                                </div>
                                <div className="text-xs text-foreground/60 mt-1">
                                    {m?.label ?? 'Loading'}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='px-6 md:px-8 mb-12'>
                    <div className='flex flex-wrap gap-3'>
                        {[
                            { label: 'Create Round', icon: '➕', href: '/authority/rounds/create' },
                            { label: 'View All Projects', icon: '📋', href: '/authority/projects' },
                            { label: 'Audit Trail', icon: '🔍', href: '/audit' },
                            { label: 'Settlement Review', icon: '✓️', href: '/settlements' },
                            { label: 'Live Auctions', icon: '⚡', href: '/auction' },
                            { label: 'Analytics', icon: '📊', href: '/authority/analytics' },
                        ].map((btn, idx) => (
                            <motion.div
                                key={btn.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                            >
                                <Link href={btn.href}>
                                    <button className='px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-medium text-sm flex items-center gap-2 whitespace-nowrap'>
                                        <span>{btn.icon}</span>
                                        {btn.label}
                                    </button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="px-6 md:px-8 mb-8 border-b border-primary/10">
                    <div className="flex gap-8">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'workflows', label: 'Workflows' },
                            { id: 'rounds', label: 'Active Rounds' },
                            { id: 'analytics', label: 'Analytics' },
                        ].map(tab => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 font-medium ${
                                    activeTab === tab.id
                                        ? 'text-primary'
                                        : 'text-foreground/60'
                                }`}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 md:px-8">
                    {activeTab === 'workflows' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {workflows.map(wf => (
                                <Link key={wf.id} href={wf.href}>
                                    <div className="p-6 rounded-xl border border-primary/20 bg-card/50 hover:bg-card/80 cursor-pointer">
                                        <div className="text-3xl mb-2">{wf.icon}</div>
                                        <h3 className="text-xl font-bold">{wf.label}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {activeTab === 'rounds' && (
                        <div className="text-center py-12 text-foreground/60">
                            Active round management happens inside each project.
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="text-center py-12 text-foreground/60">
                            Analytics will activate once aggregation APIs are enabled.
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
