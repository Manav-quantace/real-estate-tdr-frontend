'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Trust() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  })

  const pillars = [
    {
      title: 'Transparency',
      description: 'All transactions, pricing algorithms, and auction mechanics are publicly auditable and verifiable.'
    },
    {
      title: 'Auditability',
      description: 'Independent auditors have full access to verify market integrity and compliance with economic principles.'
    },
    {
      title: 'Policy-Grade System',
      description: 'Built to standards of government-commissioned infrastructure, with redundancy and regulatory compliance.'
    },
    {
      title: 'Algorithm-Driven',
      description: 'Removes human discretion in pricing and allocation, replacing it with mathematically rigorous mechanisms.'
    }
  ]

  return (
    <section
      ref={sectionRef}
      className='relative py-40 px-6 bg-linear-to-b from-background to-card/10 overflow-hidden'
    >
      {/* Background accents */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.1]) }}
        className='absolute -bottom-40 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl'
      />

      <div className='max-w-6xl mx-auto relative z-10'>
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
            <span className='block text-foreground'>Institutional</span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold'
            >
              Trust & Governance
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='text-lg text-foreground/60 max-w-2xl mx-auto font-light'
          >
            Built on economic rigor, transparency, and institutional accountability standards.
          </motion.p>
        </motion.div>

        {/* Pillars grid */}
        <div className='grid md:grid-cols-2 gap-8 mb-20'>
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: idx * 0.12,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className='group'
            >
              <div className='relative h-full p-8 md:p-10 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-500 overflow-hidden flex flex-col'
              >
                {/* Background glow */}
                <motion.div
                  className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                />

                {/* Top accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                  className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
                />

                <div className='relative z-10 flex flex-col h-full'>
                  <h3 className='text-2xl font-semibold text-foreground mb-4'>
                    {pillar.title}
                  </h3>
                  <p className='text-foreground/60 leading-relaxed grow text-base'>
                    {pillar.description}
                  </p>

                  {/* Bottom accent */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    className='mt-8 h-0.5 bg-linear-to-r from-primary/0 via-primary to-primary/0 origin-left'
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy box */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='group relative p-8 md:p-12 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-500 overflow-hidden'
        >
          {/* Background glow */}
          <motion.div
            className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
          />

          {/* Top accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
          />

          <div className='relative z-10'>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='text-sm font-bold text-primary uppercase tracking-widest mb-4'
            >
              Platform Philosophy
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='text-foreground/80 leading-relaxed text-lg'
            >
              This platform is an execution layer for published economic research. Combining Vickrey auction theory with dynamic pricing algorithms to solve market failures in real estate and development rights allocation. Governance is institutional-grade—the kind NITI Aayog or SEBI might commission—prioritizing economic efficiency and transparency.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
