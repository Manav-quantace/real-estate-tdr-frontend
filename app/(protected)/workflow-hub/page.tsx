'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import { Building2, Users, Home, MapPin, Lock, BarChart3, Clock, Gavel } from 'lucide-react'
import Navbar from "../components/navbar"
import Footer from "@/app/components/sections/footer"

interface Workflow {
    id: number
    title: string
    description: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    details: string
    roles?: string[]
    features: string[]
    status?: 'active' | 'coming' | 'limited'
}

const workflows: Workflow[] = [
    {
        id: 1,
        title: 'Saleable Property',
        description: 'Society & Private Owner Redevelopment',
        href: '/saleable',
        icon: Building2,
        details: 'Efficient property redevelopment through algorithmic price discovery',
        features: ['Real-time bidding', 'Transparent pricing', 'Owner verification'],
        status: 'active',
    },
    {
        id: 2,
        title: 'Slum Redevelopment',
        description: 'Tripartite Matching & UO Integration',
        href: '/slum/dashboard',
        icon: Users,
        details: 'Market-based allocation for inclusive urban development',
        roles: ['Slum-dweller', 'Housing Developer', 'Infrastructure Provider'],
        features: ['Multi-stakeholder matching', 'Equitable distribution', 'Community benefit'],
        status: 'active',
    },
    {
        id: 3,
        title: 'Subsidized Buildings',
        description: 'MHADA, Pagadi & Heritage Projects',
        href: '/subsidized/dashboard',
        icon: Home,
        details: 'Specialized redevelopment for assisted housing schemes',
        features: ['Value preservation', 'Community protection', 'Heritage compliance'],
        status: 'active',
    },
    {
        id: 4,
        title: 'Clear Land Parcels',
        description: 'New Construction & Bundle Sales',
        href: '/clearland/dashboard',
        icon: MapPin,
        details: 'Transparent allocation of land for greenfield development',
        features: ['Parcel bundling', 'Algorithmic matching', 'Infrastructure bundling'],
        status: 'active',
    },
]

const accessPoints = [
    { label: 'Dashboard', icon: '📊', color: 'from-primary to-primary/50', access: 'all' },
    { label: 'My Settlements', icon: '✓', color: 'from-primary to-secondary', access: 'participant' },
    { label: 'Authority Panel', icon: '🔐', color: 'from-secondary to-primary', access: 'admin' },
    { label: 'Market Analytics', icon: '📈', color: 'from-primary to-emerald-500', access: 'all' },
    { label: 'Audit Trail', icon: '🔍', color: 'from-emerald-500 to-primary', access: 'admin' },
    { label: 'My Bids', icon: '🏆', color: 'from-secondary to-secondary/50', access: 'participant' },
]

export default function WorkflowHubPage() {
    const [activeWorkflow, setActiveWorkflow] = useState<number | null>(null)
    const [selectedAccess, setSelectedAccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleWorkflowClick = (workflowId: number) => {
        setActiveWorkflow(activeWorkflow === workflowId ? null : workflowId)
    }

    return (
        <div className='min-h-screen bg-linear-to-b from-background via-background to-card/5'>
            <Navbar />

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className='relative px-6 py-20 md:py-32 overflow-hidden'
            >
                {/* Animated background elements */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className='absolute -top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
                />
                <motion.div
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 18, repeat: Infinity, delay: 2 }}
                    className='absolute -bottom-40 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl'
                />

                <div className='max-w-6xl mx-auto relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='text-center mb-16'
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.2 }}
                            className='h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs'
                        />
                        <h1 className='text-5xl md:text-7xl font-light mb-6 text-balance text-foreground'>
                            <span className='block'>Workflow</span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className='block bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent font-bold'
                            >
                                Execution Hub
                            </motion.span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className='text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light'
                        >
                            Access specialized workflows for your project type. Each market operates under algorithmic price discovery and transparent settlement mechanisms.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Main Content */}
            <section className='px-6 py-12 md:py-20'>
                <div className='max-w-7xl mx-auto'>
                    {/* Access Points Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='mb-20'
                    >
                        <div className='mb-8'>
                            <h2 className='text-3xl font-light mb-2'>
                                <span className='text-foreground'>Quick</span>{' '}
                                <span className='bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold'>
                                    Access Points
                                </span>
                            </h2>
                            <p className='text-foreground/60 text-lg'>Select your entry point into the marketplace</p>
                        </div>

                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                            {accessPoints.map((point, idx) => (
                                <motion.button
                                    key={point.label}
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                                    onClick={() => setSelectedAccess(point.label)}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative group p-4 rounded-xl border border-primary/20 transition-all duration-300 overflow-hidden ${selectedAccess === point.label ? 'border-primary/70 bg-primary/10' : 'hover:border-primary/50'
                                        }`}
                                >
                                    {/* Gradient background */}
                                    <div
                                        className={`absolute inset-0 bg-linear-to-br ${point.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                    />

                                    <div className='relative z-10'>
                                        <div className='text-2xl mb-2'>{point.icon}</div>
                                        <p className='text-xs font-semibold text-foreground/80 text-center leading-tight'>
                                            {point.label}
                                        </p>
                                    </div>

                                    {/* Active indicator */}
                                    {selectedAccess === point.label && (
                                        <motion.div
                                            layoutId='activeAccess'
                                            className='absolute inset-0 border-2 border-primary rounded-xl'
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Workflows Grid with Auction Theme */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className='mb-20'
                    >
                        <div className='mb-12'>
                            <h2 className='text-3xl font-light mb-2'>
                                <span className='text-foreground'>Active</span>{' '}
                                <span className='bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold'>
                                    Workflows
                                </span>
                            </h2>
                            <p className='text-foreground/60 text-lg'>Select a marketplace to begin bidding and participation</p>
                        </div>

                        <div className='grid gap-6 md:grid-cols-2'>
                            <AnimatePresence>
                                {workflows.map((workflow, idx) => {
                                    const Icon = workflow.icon
                                    const isActive = activeWorkflow === workflow.id

                                    return (
                                        <motion.div
                                            key={workflow.id}
                                            initial={{ opacity: 0, y: 40, rotateX: 15 }}
                                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: idx * 0.12,
                                                ease: [0.23, 1, 0.32, 1],
                                            }}
                                            layoutId={`workflow-${workflow.id}`}
                                            onClick={() => handleWorkflowClick(workflow.id)}
                                            className='group cursor-pointer'
                                        >
                                            <motion.div
                                                layout
                                                className={`relative h-full p-8 rounded-2xl border transition-all duration-500 overflow-hidden ${isActive
                                                        ? 'border-primary/70 bg-linear-to-br from-primary/15 via-card to-card'
                                                        : 'border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 hover:border-primary/50'
                                                    }`}
                                            >
                                                {/* Background glow */}
                                                <motion.div
                                                    className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                                                />

                                                {/* Top accent line */}
                                                <motion.div
                                                    layout
                                                    initial={{ scaleX: 0 }}
                                                    whileInView={{ scaleX: 1 }}
                                                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                                                    className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
                                                />

                                                <div className='relative z-10'>
                                                    {/* Header with icon */}
                                                    <div className='flex items-start justify-between mb-6'>
                                                        <motion.div
                                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                                            className='w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center'
                                                        >
                                                            <Icon className='w-7 h-7 text-primary' />
                                                        </motion.div>
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className='w-2 h-2 rounded-full bg-primary'
                                                        />
                                                    </div>

                                                    {/* Workflow info */}
                                                    <h3 className='text-2xl font-semibold text-foreground mb-2'>{workflow.title}</h3>
                                                    <p className='text-foreground/60 mb-4 text-sm leading-relaxed'>{workflow.description}</p>

                                                    {/* Status badge */}
                                                    <div className='mb-6 inline-block'>
                                                        <span className='text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold'>
                                                            {workflow.status === 'active' ? '● Active' : 'Coming Soon'}
                                                        </span>
                                                    </div>

                                                    {/* Expandable details */}
                                                    <motion.div
                                                        layout
                                                        initial={false}
                                                        animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className='overflow-hidden'
                                                    >
                                                        <motion.div layout className='pt-6 border-t border-primary/20'>
                                                            <p className='text-foreground/70 text-sm mb-6 leading-relaxed'>{workflow.details}</p>

                                                            {workflow.roles && workflow.roles.length > 0 && (
                                                                <div className='mb-6'>
                                                                    <p className='text-xs font-bold text-primary uppercase tracking-widest mb-3'>
                                                                        Available Roles
                                                                    </p>
                                                                    <div className='flex flex-wrap gap-2'>
                                                                        {workflow.roles.map((role) => (
                                                                            <span
                                                                                key={role}
                                                                                className='text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-foreground/80'
                                                                            >
                                                                                {role}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className='text-xs font-bold text-primary uppercase tracking-widest mb-3'>Key Features</p>
                                                                <ul className='space-y-2'>
                                                                    {workflow.features.map((feature, i) => (
                                                                        <li
                                                                            key={i}
                                                                            className='text-sm text-foreground/70 flex items-center gap-3'
                                                                        >
                                                                            <motion.span
                                                                                animate={{ scale: [1, 1.3, 1] }}
                                                                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                                                                className='w-1.5 h-1.5 rounded-full bg-primary shrink-0'
                                                                            />
                                                                            {feature}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* CTA Button */}
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.15 }}
                                                                className='mt-8'
                                                            >
                                                                <Link href={workflow.href}>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsl(155, 78%, 48%, 0.3)' }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className='w-full py-3 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2'
                                                                    >
                                                                        <Gavel className='w-4 h-4' />
                                                                        Enter Workflow
                                                                    </motion.button>
                                                                </Link>
                                                            </motion.div>
                                                        </motion.div>
                                                    </motion.div>

                                                    {/* Expandable arrow indicator */}
                                                    <motion.div
                                                        layout
                                                        animate={{ rotate: isActive ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className='mt-4 flex justify-center'
                                                    >
                                                        <svg
                                                            className='w-5 h-5 text-primary/60'
                                                            fill='none'
                                                            stroke='currentColor'
                                                            viewBox='0 0 24 24'
                                                        >
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                strokeWidth={2}
                                                                d='M19 14l-7 7m0 0l-7-7m7 7V3'
                                                            />
                                                        </svg>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Authority Section - Conditional Render */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='mb-20 relative p-10 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl overflow-hidden'
                    >
                        {/* Top accent */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 1 }}
                            className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-secondary to-primary origin-left'
                        />

                        <div className='relative z-10'>
                            <div className='flex items-start gap-4 mb-8'>
                                <div className='w-12 h-12 rounded-xl bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center shrink-0'>
                                    <Lock className='w-6 h-6 text-secondary' />
                                </div>
                                <div>
                                    <h3 className='text-2xl font-semibold text-foreground mb-2'>Authority Controls</h3>
                                    <p className='text-foreground/60'>Manage market operations, open/close rounds, and oversee settlements</p>
                                </div>
                            </div>

                            <div className='grid gap-4 md:grid-cols-3'>
                                {[
                                    { label: 'Round Management', desc: 'Open, close, and lock auction rounds' },
                                    { label: 'Settlement Review', desc: 'Verify and approve market transactions' },
                                    { label: 'Analytics Dashboard', desc: 'Monitor real-time market metrics' },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        className='p-6 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer group'
                                    >
                                        <h4 className='font-semibold text-foreground mb-2 group-hover:text-primary transition-colors'>
                                            {item.label}
                                        </h4>
                                        <p className='text-sm text-foreground/60'>{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className='relative p-8 rounded-2xl border border-primary/20 bg-linear-to-r from-primary/5 via-transparent to-secondary/5 overflow-hidden'
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 1 }}
                            className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
                        />

                        <div className='relative z-10 flex items-start gap-4'>
                            <div className='text-2xl shrink-0'>❓</div>
                            <div>
                                <h4 className='font-semibold text-foreground mb-1'>Selecting the Right Workflow?</h4>
                                <p className='text-sm text-foreground/70'>
                                    Each workflow is specialized for different project types. Your role determines which workflows are accessible. Contact your administrator for guidance.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}
