'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navbar from '../components/navbar'
import Footer from '@/app/components/sections/footer'


export default function AuctionPage() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 80%', 'end 20%'],
    })
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

    const lockedRounds = [
        {
            id: 1,
            projectName: 'Dharavi Phase 1',
            workflow: 'Slum',
            roundNumber: 3,
            totalUnits: 150,
            remainingUnits: 42,
            reservePrice: '₹2.5 Cr',
            currentBid: '₹3.2 Cr',
            status: 'Bidding Active',
            endsAt: '2025-02-15 18:30:00',
            participants: 23,
            icon: '👥',
            locked: true,
        },
        {
            id: 2,
            projectName: 'Bandra Market',
            workflow: 'Saleable',
            roundNumber: 2,
            totalUnits: 85,
            remainingUnits: 12,
            reservePrice: '₹4.0 Cr',
            currentBid: '₹4.8 Cr',
            status: 'Price Locked',
            endsAt: '2025-02-14 15:00:00',
            participants: 18,
            icon: '🏢',
            locked: true,
        },
        {
            id: 3,
            projectName: 'Colaba Open Space',
            workflow: 'Clearland',
            roundNumber: 1,
            totalUnits: 50,
            remainingUnits: 8,
            reservePrice: '₹1.8 Cr',
            currentBid: '₹2.4 Cr',
            status: 'Settlement Pending',
            endsAt: '2025-02-13 10:00:00',
            participants: 14,
            icon: '🌍',
            locked: true,
        },
        {
            id: 4,
            projectName: 'Affordable Housing - East',
            workflow: 'Subsidized',
            roundNumber: 4,
            totalUnits: 200,
            remainingUnits: 67,
            reservePrice: '₹1.2 Cr',
            currentBid: '₹1.6 Cr',
            status: 'Quote Collection',
            endsAt: '2025-02-16 14:30:00',
            participants: 31,
            icon: '🏠',
            locked: true,
        },
        {
            id: 5,
            projectName: 'Eastern Gateway',
            workflow: 'Saleable',
            roundNumber: 1,
            totalUnits: 120,
            remainingUnits: 45,
            reservePrice: '₹3.1 Cr',
            currentBid: '₹3.9 Cr',
            status: 'Bidding Active',
            endsAt: '2025-02-17 16:45:00',
            participants: 25,
            icon: '🏗️',
            locked: true,
        },
        {
            id: 6,
            projectName: 'Kumbhar Wada',
            workflow: 'Slum',
            roundNumber: 2,
            totalUnits: 90,
            remainingUnits: 19,
            reservePrice: '₹2.2 Cr',
            currentBid: '₹2.9 Cr',
            status: 'Price Discovery',
            endsAt: '2025-02-18 12:00:00',
            participants: 20,
            icon: '👥',
            locked: true,
        },
    ]

    const workflowFilters = [
        { name: 'All Workflows', value: null },
        { name: 'Slum', value: 'Slum' },
        { name: 'Saleable', value: 'Saleable' },
        { name: 'Subsidized', value: 'Subsidized' },
        { name: 'Clearland', value: 'Clearland' },
    ]

    const filteredRounds = selectedFilter
        ? lockedRounds.filter((round) => round.workflow === selectedFilter)
        : lockedRounds

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Bidding Active':
                return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
            case 'Price Locked':
                return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
            case 'Settlement Pending':
                return 'bg-orange-500/20 text-orange-500 border-orange-500/30'
            case 'Quote Collection':
                return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30'
            case 'Price Discovery':
                return 'bg-purple-500/20 text-purple-500 border-purple-500/30'
            default:
                return 'bg-primary/20 text-primary border-primary/30'
        }
    }

    const getWorkflowColor = (workflow: string) => {
        switch (workflow) {
            case 'Slum':
                return 'text-rose-500 bg-rose-500/10'
            case 'Saleable':
                return 'text-emerald-500 bg-emerald-500/10'
            case 'Clearland':
                return 'text-cyan-500 bg-cyan-500/10'
            case 'Subsidized':
                return 'text-purple-500 bg-purple-500/10'
            default:
                return 'text-primary bg-primary/10'
        }
    }

    return (
        <main className='bg-background text-foreground'>
            <Navbar />

            {/* Hero Section */}
            <section className='relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20 pb-20'>
                <div className='absolute inset-0'>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 90] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        className='absolute -top-32 -right-32 w-96 h-96 bg-linear-to-br from-emerald-500/20 to-emerald-500/5 rounded-full blur-3xl'
                    />
                    <motion.div
                        animate={{ scale: [1.1, 1, 1.1], rotate: [90, 45, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        className='absolute -bottom-32 -left-32 w-96 h-96 bg-linear-to-tr from-secondary/15 to-secondary/5 rounded-full blur-3xl'
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
                        <p className='text-sm font-medium tracking-widest text-primary uppercase'>Real-Time Auction Hub</p>

                        <h1 className='text-5xl md:text-7xl lg:text-8xl font-light mt-8 mb-6 leading-[1.1] text-balance'>
                            <span className='block text-foreground'>Live</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className='block bg-linear-to-r from-emerald-500 via-primary to-secondary bg-clip-text text-transparent font-bold'
                            >
                                Auctions
                            </motion.span>
                            <span className='block text-foreground'>In Progress</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className='text-lg md:text-xl text-foreground/60 mb-8 max-w-2xl mx-auto font-light'
                        >
                            All currently locked rounds across institutional markets with real-time bidding activity.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className='inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10'
                        >
                            <p className='text-sm text-primary font-medium'>
                                {filteredRounds.length} Active Rounds
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section ref={sectionRef} className='relative py-12 px-6 bg-linear-to-b from-background to-card/5 border-b border-primary/10'>
                <div className='max-w-6xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className='flex flex-wrap gap-3'
                    >
                        {workflowFilters.map((filter, idx) => (
                            <motion.button
                                key={filter.value}
                                onClick={() => setSelectedFilter(filter.value)}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className={`px-5 py-2 rounded-full font-medium transition-all border ${selectedFilter === filter.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-primary/20 bg-card/50 text-foreground/70 hover:border-primary/50 hover:bg-card'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {filter.name}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Auction Cards */}
            <section className='relative py-20 px-6 bg-background'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {filteredRounds.map((round, idx) => (
                            <motion.div
                                key={round.id}
                                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: idx * 0.08,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                                whileHover={{ y: -12 }}
                            >
                                <div className='relative h-full p-8 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden group'>
                                    <motion.div
                                        className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                                    />

                                    {/* Top accent line with pulsing animation */}
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-primary to-secondary'
                                    />

                                    <div className='relative z-10'>
                                        {/* Header */}
                                        <div className='flex items-start justify-between mb-6'>
                                            <div className='flex-1'>
                                                <div className='text-4xl mb-3'>{round.icon}</div>
                                                <h3 className='text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors'>
                                                    {round.projectName}
                                                </h3>
                                                <div className='flex items-center gap-2 mb-4'>
                                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getWorkflowColor(round.workflow)}`}>
                                                        {round.workflow}
                                                    </span>
                                                    <span className='text-xs text-foreground/50'>Round {round.roundNumber}</span>
                                                </div>
                                            </div>

                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(round.status)}`}
                                            >
                                                ⚡ {round.status}
                                            </motion.div>
                                        </div>

                                        {/* Pricing */}
                                        <div className='space-y-3 mb-6 pb-6 border-b border-primary/10'>
                                            <div>
                                                <p className='text-xs text-foreground/60 mb-1'>Reserve Price</p>
                                                <p className='font-mono text-sm text-foreground/80'>{round.reservePrice}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-foreground/60 mb-1'>Current Bid</p>
                                                <motion.p
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className='font-mono text-lg font-bold text-primary'
                                                >
                                                    {round.currentBid}
                                                </motion.p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className='space-y-3 mb-6'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-sm text-foreground/60'>Units Remaining</span>
                                                <span className='font-semibold text-foreground'>
                                                    {round.remainingUnits} / {round.totalUnits}
                                                </span>
                                            </div>
                                            <div className='w-full h-1.5 bg-card rounded-full overflow-hidden'>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(round.remainingUnits / round.totalUnits) * 100}%` }}
                                                    transition={{ duration: 1.5 }}
                                                    className='h-full bg-linear-to-r from-primary to-secondary'
                                                />
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-sm text-foreground/60'>{round.participants} Participants</span>
                                                <span className='text-xs text-foreground/50'>Ends {new Date(round.endsAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px hsl(155, 78%, 48%, 0.2)' }}
                                            whileTap={{ scale: 0.95 }}
                                            className='w-full py-3 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all'
                                        >
                                            View Details
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
