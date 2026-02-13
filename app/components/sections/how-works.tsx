'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HowWorks() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 80%', 'end 20%'],
    })

    const steps = [
        {
            num: '01',
            title: 'Dynamic Pricing',
            description: 'Real-time algorithmic pricing based on market data and comparable transactions.',
        },
        {
            num: '02',
            title: 'Tokenization',
            description: 'Land & rights fractioned into tradeable units: LU, PRU, TDRU, DCU, GCU.',
        },
        {
            num: '03',
            title: 'Sealed Auction',
            description: 'Vickrey mechanism ensures truthful bidding and optimal allocation.',
        },
        {
            num: '04',
            title: 'Iterative Rounds',
            description: 'Multiple bidding rounds allow market discovery and price convergence.',
        },
        {
            num: '05',
            title: 'Automated Settlement',
            description: 'Instant matching and transparent transfer of rights to winners.',
        },
        {
            num: '06',
            title: 'Adaptive Feedback',
            description: 'Transaction data optimizes pricing for next cycle. Continuous improvement.',
        },
    ]

    return (
        <section
            ref={sectionRef}
            className='relative py-40 px-6 bg-linear-to-b from-background to-card/10 overflow-hidden'
        >
            {/* Animated corner accents */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.15]) }}
                className='absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
            />
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0.5, 1], [0, 0.15]) }}
                className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl'
            />

            <div className='max-w-6xl mx-auto relative z-10'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='mb-24 text-center'
                >
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.2 }}
                        className='h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs'
                    />
                    <h2 className='text-5xl md:text-6xl font-light mb-6 text-balance'>
                        <span className='block text-foreground'>How It</span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold'
                        >
                            Works
                        </motion.span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className='text-lg text-foreground/60 max-w-2xl mx-auto font-light'
                    >
                        A six-step continuous cycle from pricing to execution to feedback optimization.
                    </motion.p>
                </motion.div>

                {/* Animated timeline */}
                <div className='relative'>
                    {/* Vertical/horizontal connector - animated */}
                    <motion.svg
                        className='absolute inset-0 w-full h-full pointer-events-none'
                        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.3, 0.8]) }}
                        viewBox='0 0 1200 800'
                        preserveAspectRatio='none'
                    >
                        <motion.path
                            d='M 50,100 Q 300,200 600,150 Q 900,100 1150,200'
                            stroke='url(#flowGradient)'
                            strokeWidth='2'
                            fill='none'
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5 }}
                        />
                        <defs>
                            <linearGradient id='flowGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                <stop offset='0%' stopColor='hsl(155, 78%, 48%)' />
                                <stop offset='100%' stopColor='hsl(48, 85%, 58%)' />
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    {/* Steps grid */}
                    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4'>
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.7,
                                    delay: idx * 0.1,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className='group relative'
                            >
                                <div className='flex flex-col h-full'>
                                    {/* Step circle */}
                                    <motion.div
                                        className='w-20 h-20 mx-auto mb-6 rounded-full border-2 border-primary bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center relative'
                                        whileHover={{
                                            boxShadow: '0 0 30px hsl(155, 78%, 48%, 0.4)',
                                            scale: 1.1,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className='text-xl font-bold text-primary'>{step.num}</span>
                                        <motion.div
                                            className='absolute inset-0 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100'
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>

                                    {/* Content */}
                                    <div className='grow'>
                                        <h3 className='text-center md:text-left font-semibold text-foreground mb-3 text-base leading-tight'>
                                            {step.title}
                                        </h3>
                                        <p className='text-center md:text-left text-sm text-foreground/60 leading-relaxed'>
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Bottom accent */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className='mt-6 h-0.5 bg-linear-to-r from-primary to-secondary origin-center'
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Cycle indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className='mt-20 text-center'
                >
                    <motion.div
                        className='inline-block'
                    >
                        <div className='px-6 py-3 rounded-full border border-primary/30 bg-primary/5'>
                            <p className='text-sm font-medium text-primary'>
                                ↻ Continuous cycle for market optimization
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
