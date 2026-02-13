'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/navbar'
import Footer from '@/app/components/sections/footer'


export default function AuditDetailPage() {
    const params = useParams()
    const projectId = params.projectId as string
    const [activeTab, setActiveTab] = useState('overview')

    const auditTrail = [
        {
            timestamp: '2025-02-10 14:32:45',
            action: 'Round 3 Opened',
            user: 'Authority Admin',
            details: 'New round opened with 50 units available',
            icon: '🔓',
        },
        {
            timestamp: '2025-02-09 10:15:22',
            action: 'Settlement Processed',
            user: 'System',
            details: 'Payment confirmed for Round 2 winner',
            icon: '✓️',
        },
        {
            timestamp: '2025-02-08 16:45:10',
            action: 'Bid Submitted',
            user: 'Developer Corp A',
            details: 'Bid amount: ₹2,50,00,000',
            icon: '💰',
        },
        {
            timestamp: '2025-02-07 09:30:55',
            action: 'Compliance Check',
            user: 'Auditor',
            details: 'All documentation verified and approved',
            icon: '📋',
        },
        {
            timestamp: '2025-02-05 13:22:18',
            action: 'Project Initiated',
            user: 'Authority Admin',
            details: 'Dharavi Phase 1 redevelopment project created',
            icon: '🚀',
        },
    ]

    const complianceChecks = [
        { name: 'Documentation', status: 'Verified', percentage: 100 },
        { name: 'Financial', status: 'Verified', percentage: 100 },
        { name: 'Environmental', status: 'Pending', percentage: 75 },
        { name: 'Legal', status: 'Verified', percentage: 100 },
        { name: 'Social Impact', status: 'In Progress', percentage: 60 },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-emerald-500/20 text-emerald-500'
            case 'Pending':
                return 'bg-orange-500/20 text-orange-500'
            case 'In Progress':
                return 'bg-blue-500/20 text-blue-500'
            default:
                return 'bg-gray-500/20 text-gray-500'
        }
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'audit-trail', label: 'Audit Trail', icon: '📋' },
        { id: 'compliance', label: 'Compliance', icon: '✓️' },
        { id: 'participants', label: 'Participants', icon: '👥' },
        { id: 'settlements', label: 'Settlements', icon: '💳' },
    ]

    return (
        <main className='bg-background text-foreground'>
            <Navbar />

            {/* Header */}
            <section className='relative pt-32 pb-20 px-6 bg-linear-to-b from-background to-card/10'>
                <div className='max-w-6xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link href='/audit' className='inline-flex items-center gap-2 text-primary mb-6 hover:text-primary/80 transition-colors'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                            </svg>
                            Back to Audit
                        </Link>

                        <h1 className='text-5xl md:text-6xl font-light mb-4 leading-tight'>
                            <span className='block text-foreground'>Dharavi Redevelopment</span>
                            <span className='block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold'>
                                Phase 1 Audit
                            </span>
                        </h1>

                        <div className='flex flex-wrap items-center gap-6 mt-8'>
                            <div>
                                <p className='text-sm text-foreground/60 mb-1'>Project ID</p>
                                <p className='font-mono text-lg text-primary'>PRJ-2025-001</p>
                            </div>
                            <div>
                                <p className='text-sm text-foreground/60 mb-1'>Workflow</p>
                                <span className='inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-500 text-sm font-medium'>
                                    Slum Redevelopment
                                </span>
                            </div>
                            <div>
                                <p className='text-sm text-foreground/60 mb-1'>Status</p>
                                <span className='inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-sm font-medium'>
                                    Active
                                </span>
                            </div>
                            <div>
                                <p className='text-sm text-foreground/60 mb-1'>Rounds</p>
                                <p className='font-semibold text-lg'>3 Active</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tabs */}
            <section className='relative py-12 px-6 bg-background border-b border-primary/10'>
                <div className='max-w-6xl mx-auto'>
                    <div className='flex gap-2 overflow-x-auto'>
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'bg-card border border-primary/20 text-foreground/70 hover:border-primary/50'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className='relative py-20 px-6 bg-linear-to-b from-background to-card/10'>
                <div className='max-w-6xl mx-auto'>
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className='space-y-8'
                        >
                            <div className='grid md:grid-cols-2 gap-8'>
                                <div className='p-8 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur'>
                                    <h3 className='text-lg font-semibold mb-4 text-foreground'>Project Details</h3>
                                    <div className='space-y-4'>
                                        <div>
                                            <p className='text-sm text-foreground/60'>Location</p>
                                            <p className='text-foreground font-medium'>Dharavi, Mumbai</p>
                                        </div>
                                        <div>
                                            <p className='text-sm text-foreground/60'>Area</p>
                                            <p className='text-foreground font-medium'>432 acres</p>
                                        </div>
                                        <div>
                                            <p className='text-sm text-foreground/60'>Estimated Value</p>
                                            <p className='text-foreground font-medium'>₹5,000+ Crores</p>
                                        </div>
                                        <div>
                                            <p className='text-sm text-foreground/60'>Created</p>
                                            <p className='text-foreground font-medium'>2025-01-15</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-8 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur'>
                                    <h3 className='text-lg font-semibold mb-4 text-foreground'>Key Metrics</h3>
                                    <div className='space-y-4'>
                                        <div>
                                            <p className='text-sm text-foreground/60 mb-2'>Total Bids</p>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='text-3xl font-bold text-primary'>47</span>
                                                <span className='text-sm text-foreground/60'>across 3 rounds</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-sm text-foreground/60 mb-2'>Settlement Rate</p>
                                            <div className='flex items-baseline gap-2'>
                                                <span className='text-3xl font-bold text-emerald-500'>98%</span>
                                                <span className='text-sm text-foreground/60'>45 settled</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-sm text-foreground/60 mb-2'>Average Bid Value</p>
                                            <div className='text-2xl font-bold text-secondary'>₹2.3 Cr</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'audit-trail' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className='space-y-4'
                        >
                            {auditTrail.map((entry, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className='p-6 rounded-xl border border-primary/20 bg-linear-to-r from-card via-card/80 to-card/50 backdrop-blur hover:border-primary/50 transition-all group'
                                >
                                    <div className='flex gap-4'>
                                        <div className='text-3xl shrink-0'>{entry.icon}</div>
                                        <div className='flex-1'>
                                            <div className='flex items-start justify-between mb-2'>
                                                <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                                                    {entry.action}
                                                </h3>
                                                <span className='text-xs text-foreground/50 font-mono'>{entry.timestamp}</span>
                                            </div>
                                            <p className='text-sm text-foreground/70 mb-2'>{entry.details}</p>
                                            <p className='text-xs text-foreground/50'>By: {entry.user}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'compliance' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className='space-y-6'
                        >
                            {complianceChecks.map((check, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className='p-6 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur'
                                >
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3 className='font-semibold text-foreground'>{check.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                                            {check.status}
                                        </span>
                                    </div>
                                    <div className='w-full h-2 bg-card rounded-full overflow-hidden'>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${check.percentage}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className='h-full bg-linear-to-r from-primary to-secondary'
                                        />
                                    </div>
                                    <p className='text-xs text-foreground/60 mt-2'>{check.percentage}% Complete</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'participants' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className='p-8 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur'
                        >
                            <p className='text-foreground/60'>Participant data would be displayed here with roles and activities.</p>
                        </motion.div>
                    )}

                    {activeTab === 'settlements' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className='p-8 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur'
                        >
                            <p className='text-foreground/60'>Settlement records and transaction details would be shown here.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
