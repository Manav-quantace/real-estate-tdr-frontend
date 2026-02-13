'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/navbar'
import Footer from '@/app/components/sections/footer'


export default function AuditPage() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 80%', 'end 20%'],
    })
    const [searchQuery, setSearchQuery] = useState('')

    const auditCapabilities = [
        {
            title: 'Transaction Verification',
            description: 'Complete audit trail of all bids, quotes, and transactions',
            icon: '✓️',
        },
        {
            title: 'Compliance Tracking',
            description: 'Real-time regulatory compliance status monitoring',
            icon: '📋',
        },
        {
            title: 'Approval Workflows',
            description: 'Track approvals, rejections, and amendments',
            icon: '⚙️',
        },
        {
            title: 'User Activity Log',
            description: 'Comprehensive user action and access logs',
            icon: '👁️',
        },
        {
            title: 'Financial Reconciliation',
            description: 'Settlement and payment verification audits',
            icon: '💰',
        },
        {
            title: 'Data Integrity',
            description: 'Cryptographic verification of data immutability',
            icon: '🔐',
        },
    ]

    const recentProjects = [
        {
            id: 1,
            name: 'Dharavi Redevelopment Phase 1',
            workflow: 'Slum',
            rounds: 3,
            status: 'Active',
            timestamp: '2025-02-10',
        },
        {
            id: 2,
            name: 'Bandra Market Complex',
            workflow: 'Saleable',
            rounds: 2,
            status: 'Settled',
            timestamp: '2025-02-08',
        },
        {
            id: 3,
            name: 'Colaba Open Space',
            workflow: 'Clearland',
            rounds: 1,
            status: 'Bidding',
            timestamp: '2025-02-05',
        },
        {
            id: 4,
            name: 'Affordable Housing - East',
            workflow: 'Subsidized',
            rounds: 4,
            status: 'Active',
            timestamp: '2025-02-01',
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-500/20 text-emerald-500'
            case 'Settled':
                return 'bg-blue-500/20 text-blue-500'
            case 'Bidding':
                return 'bg-orange-500/20 text-orange-500'
            default:
                return 'bg-gray-500/20 text-gray-500'
        }
    }

    const getWorkflowColor = (workflow: string) => {
        switch (workflow) {
            case 'Slum':
                return 'text-rose-500'
            case 'Saleable':
                return 'text-emerald-500'
            case 'Clearland':
                return 'text-cyan-500'
            case 'Subsidized':
                return 'text-purple-500'
            default:
                return 'text-primary'
        }
    }

    const filteredProjects = recentProjects.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.workflow.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className='bg-background text-foreground'>
            <Navbar />

            {/* Hero Section */}
            <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20'>
                <div className='absolute inset-0'>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className='absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-primary/20 to-primary/5 rounded-full blur-3xl'
                    />
                    <motion.div
                        animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        className='absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-tr from-secondary/15 to-secondary/5 rounded-full blur-3xl'
                    />
                </div>

                <div className='relative z-10 max-w-6xl mx-auto px-6 text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className='h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs'
                        />
                        <p className='text-sm font-medium tracking-widest text-primary uppercase'>Institutional Auditability</p>

                        <h1 className='text-6xl md:text-7xl lg:text-8xl font-light mt-6 mb-6 leading-[1.1] text-balance'>
                            <span className='block text-foreground'>Complete</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className='block bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent font-bold'
                            >
                                Transparency
                            </motion.span>
                            <span className='block text-foreground'>for Markets</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className='text-lg md:text-xl text-foreground/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed'
                        >
                            Comprehensive audit trails for every transaction, approval, and round across all institutional markets.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Audit Capabilities */}
            <section className='relative py-32 px-6 bg-linear-to-b from-background to-card/10'>
                <div className='max-w-6xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='mb-20 text-center'
                    >
                        <h2 className='text-5xl md:text-6xl font-light mb-6 text-balance'>
                            <span className='block text-foreground'>Audit</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className='block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold'
                            >
                                Capabilities
                            </motion.span>
                        </h2>
                    </motion.div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {auditCapabilities.map((capability, idx) => (
                            <motion.div
                                key={capability.title}
                                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: idx * 0.1,
                                }}
                            >
                                <div className='relative p-8 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 h-full group'>
                                    <motion.div
                                        className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl'
                                    />

                                    <div className='relative z-10'>
                                        <div className='text-4xl mb-4 group-hover:scale-125 transition-transform duration-300'>
                                            {capability.icon}
                                        </div>
                                        <h3 className='text-xl font-semibold mb-3 text-foreground'>
                                            {capability.title}
                                        </h3>
                                        <p className='text-foreground/60 leading-relaxed text-sm'>
                                            {capability.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Search & List */}
            <section ref={sectionRef} className='relative py-32 px-6 bg-background'>
                <div className='max-w-6xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='mb-16'
                    >
                        <h2 className='text-4xl md:text-5xl font-light mb-6 text-balance'>
                            <span className='block text-foreground'>Auditable</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className='block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold'
                            >
                                Projects
                            </motion.span>
                        </h2>

                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='relative'
                        >
                            <input
                                type='text'
                                placeholder='Search projects by name or workflow...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full px-6 py-4 rounded-xl border border-primary/30 bg-card/50 backdrop-blur text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/60 transition-colors'
                            />
                            <svg
                                className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                />
                            </svg>
                        </motion.div>
                    </motion.div>

                    {/* Projects List */}
                    <div className='space-y-4'>
                        {filteredProjects.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: idx * 0.08,
                                }}
                            >
                                <Link href={`/audit/${project.id}`}>
                                    <motion.div
                                        whileHover={{ x: 8, boxShadow: '0 10px 30px hsl(155, 78%, 48%, 0.1)' }}
                                        className='relative p-6 rounded-xl border border-primary/20 bg-linear-to-r from-card via-card/80 to-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group'
                                    >
                                        <motion.div
                                            className='absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl'
                                        />

                                        <div className='relative z-10 flex items-center justify-between'>
                                            <div className='flex-1'>
                                                <h3 className='text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors'>
                                                    {project.name}
                                                </h3>
                                                <div className='flex items-center gap-4'>
                                                    <span className={`text-sm font-medium ${getWorkflowColor(project.workflow)}`}>
                                                        {project.workflow}
                                                    </span>
                                                    <span className='text-xs text-foreground/50'>{project.rounds} rounds</span>
                                                    <span className='text-xs text-foreground/50'>{project.timestamp}</span>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-4'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                                <motion.svg
                                                    animate={{ x: [0, 4, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className='w-5 h-5 text-primary'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                                </motion.svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='text-center py-12'
                        >
                            <p className='text-foreground/60'>No projects found matching your search.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
