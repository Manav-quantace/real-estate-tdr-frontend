'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function WhyExchange() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 80%', 'end 20%'],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1])
    const xOffset = useTransform(scrollYProgress, [0, 1], [100, -100])

    const problems = [
        {
            title: 'Discretionary Allocation',
            description: 'Development rights distributed through opaque political processes.',
            icon: '⚖️',
        },
        {
            title: 'Price Discovery Failure',
            description: 'True economic value of development potential remains hidden.',
            icon: '📊',
        },
        {
            title: 'Value Leakage',
            description: 'Public value captured privately. Infrastructure externalities unpriced.',
            icon: '💧',
        },
        {
            title: 'Market Fragmentation',
            description: 'Secondary markets thin and illiquid. Information asymmetries prevail.',
            icon: '🔗',
        },
    ]

    return (
        <section
            ref={sectionRef}
            className='relative py-40 px-6 bg-linear-to-b from-background via-card/10 to-background overflow-hidden'
        >
            {/* Animated background elements */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0.05, 0.15]) }}
                className='absolute -top-32 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
            />
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0.5, 1], [0.05, 0.15]) }}
                className='absolute -bottom-32 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl'
            />

            <div className='max-w-6xl mx-auto relative z-10'>
                {/* Header with entrance animation */}
                <motion.div style={{ opacity, scale }} className='mb-24 text-center'>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.2 }}
                        className='h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs'
                    />
                    <h2 className='text-5xl md:text-6xl font-light mb-6 text-balance'>
                        <span className='block text-foreground'>Why</span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='block bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent font-bold text-5xl md:text-6xl'
                        >
                            This Exchange
                        </motion.span>
                        <span className='block text-foreground'>Exists</span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className='text-lg text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed'
                    >
                        Real estate allocation requires transparent, algorithmic infrastructure to solve endemic market inefficiencies and enable institutional efficiency.
                    </motion.p>
                </motion.div>

                {/* Problem cards with staggered reveal and parallax */}
                <div className='grid md:grid-cols-2 gap-8'>
                    {problems.map((problem, index) => (
                        <motion.div
                            key={problem.title}
                            initial={{ opacity: 0, y: 80, rotateX: 15 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.12,
                                ease: [0.23, 1, 0.320, 1],
                            }}
                            whileHover={{
                                y: -12,
                                transition: { duration: 0.3 },
                            }}
                            className='group relative'
                        >
                            <motion.div
                                style={{
                                    x: xOffset, // Replaced useTransform(scrollYProgress, [index * 0.2, (index + 1) * 0.3], [-30, 30]),
                                }}
                                className='relative p-8 md:p-10 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-500 overflow-hidden h-full flex flex-col'
                            >
                                {/* Animated background glow */}
                                <motion.div
                                    className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                                    animate={{
                                        backgroundPosition: ['0% 0%', '100% 100%'],
                                    }}
                                    transition={{ duration: 10, repeat: Infinity }}
                                />

                                {/* Top accent line */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                    className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
                                />

                                <div className='relative z-10 flex flex-col h-full'>
                                    <div
                                        className='text-5xl mb-6'
                                        
                                    >
                                        {problem.icon}
                                    </div>

                                    <h3 className='text-2xl font-semibold mb-4 text-foreground leading-tight'>
                                        {problem.title}
                                    </h3>

                                    <p className='text-foreground/60 leading-relaxed grow text-base'>
                                        {problem.description}
                                    </p>

                                    {/* Bottom accent reveal */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className='mt-8 h-0.5 bg-linear-to-r from-primary/0 via-primary to-primary/0 origin-left'
                                    />
                                </div>

                                {/* Corner accent */}
                                <motion.div
                                    className='absolute bottom-4 right-4 w-8 h-8 border border-primary/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom accent line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className='mt-24 h-px bg-linear-to-r from-transparent via-primary to-transparent max-w-xs mx-auto'
                />
            </div>
        </section>
    )
}
