'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useViewportScroll } from 'framer-motion'
import Link from 'next/dist/client/link'

export default function Hero() {
    const containerRef = useRef(null)
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 400], [1, 0])
    const scale = useTransform(scrollY, [0, 400], [1, 0.8])
    const rotateX = useTransform(scrollY, [0, 400], [0, 15])

    return (
        <section
            ref={containerRef}
            className='relative min-h-screen bg-linear-to-br from-background via-card to-[hsl(160,18%,12%)] flex items-center justify-center overflow-hidden'
        >
            {/* Animated organic shapes background */}
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

            {/* Morphing mesh grid */}
            <motion.svg
                className='absolute inset-0 w-full h-full opacity-30'
                viewBox='0 0 1200 800'
                preserveAspectRatio='none'
            >
                <defs>
                    <linearGradient id='meshGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stopColor='hsl(155, 78%, 48%)' stopOpacity='0.3' />
                        <stop offset='100%' stopColor='hsl(48, 85%, 58%)' stopOpacity='0.1' />
                    </linearGradient>
                </defs>
                <motion.path
                    d='M0,0 Q300,200 600,150 T1200,0'
                    stroke='url(#meshGradient)'
                    strokeWidth='1'
                    fill='none'
                    animate={{ d: ['M0,0 Q300,200 600,150 T1200,0', 'M0,0 Q300,100 600,200 T1200,0', 'M0,0 Q300,200 600,150 T1200,0'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.path
                    d='M0,400 Q300,600 600,550 T1200,400'
                    stroke='url(#meshGradient)'
                    strokeWidth='1'
                    fill='none'
                    animate={{ d: ['M0,400 Q300,600 600,550 T1200,400', 'M0,400 Q300,500 600,600 T1200,400', 'M0,400 Q300,600 600,550 T1200,400'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
            </motion.svg>

            {/* Main content */}
            <motion.div
                style={{ opacity, scale }}
                className='relative z-10 text-center max-w-5xl px-6'
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='mb-8 space-y-2'
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className='h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs'
                    />
                    <p className='text-sm font-medium tracking-widest text-primary uppercase'>
                        Infrastructure Reimagined
                    </p>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className='text-6xl md:text-7xl lg:text-8xl font-light mb-6 leading-[1.1] text-balance'
                >
                    <span className='block text-foreground'>Algorithmic</span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className='block bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent font-bold'
                    >
                        Markets
                    </motion.span>
                    <span className='block text-foreground'>for Development</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className='text-lg md:text-xl text-foreground/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed'
                >
                    An institutional infrastructure replacing discretionary allocation with transparent, rules-based mechanisms for land, development rights, and public value capture.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className='flex flex-col sm:flex-row gap-4 justify-center items-center'
                >
                    <Link href='#request-access' scroll={false}>
                        <motion.button
                            whileHover={{ scale: 1.08, boxShadow: '0 0 30px hsl(155, 78%, 48%)' }}
                            whileTap={{ scale: 0.95 }}
                            className='px-10 py-3.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg '
                        >
                            Request Access
                        </motion.button>
                    </Link>
                    <Link href='/login' passHref >
                        <motion.button
                            whileHover={{ scale: 1.08, backgroundColor: 'hsl(160, 18%, 20%)' }}
                            whileTap={{ scale: 0.95 }}
                            className='px-10 py-3.5 border border-primary/40 text-primary font-medium rounded-lg hover:border-primary/70 transition-all duration-300 cursor-pointer'
                        >
                            Already a Member? Log In
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Token badges with stagger */}
                <motion.div
                    className='mt-20 flex flex-wrap justify-center gap-3'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {['LU', 'PRU', 'TDRU', 'DCU', 'GCU'].map((token, i) => (
                        <motion.div
                            key={token}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                            whileHover={{ scale: 1.1 }}
                            className='px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-mono text-primary'
                        >
                            {token}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Floating scroll indicator */}
            <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className='absolute bottom-10 left-1/2 -translate-x-1/2 z-10'
            >
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='text-center'
                >
                    <p className='text-xs text-foreground/40 mb-3 uppercase tracking-widest'>Scroll</p>
                    <motion.svg
                        className='w-5 h-8 text-primary mx-auto'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                    </motion.svg>
                </motion.div>
            </motion.div>
        </section>
    )
}
