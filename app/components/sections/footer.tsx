'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const columns = [
    {
      title: 'Platform',
      items: ['Algorithmic Exchange', 'Vickrey Auctions', 'Dynamic Pricing', 'Tokenized Rights'],
    },
    {
      title: 'Framework',
      items: ['Economic Research', 'Market Design', 'Institutional Grade', 'Open Auditable'],
    },
    {
      title: 'Governance',
      items: ['Compliance', 'Transparency', 'Auditability', 'Economic Rigor'],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <footer className='relative py-20 px-6 bg-linear-to-t from-card/20 to-background border-t border-primary/10 overflow-hidden'>
      {/* Background accent */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className='absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
      />

      <div className='max-w-6xl mx-auto relative z-10'>
        {/* Top divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className='h-px bg-linear-to-r from-transparent via-primary/50 to-transparent mx-auto mb-16 max-w-2xl'
        />

        {/* Columns */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          className='grid md:grid-cols-3 gap-12 mb-16'
        >
          {columns.map((col, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className='text-sm font-bold text-primary uppercase tracking-widest mb-6'>
                {col.title}
              </h4>
              <ul className='space-y-3'>
                {col.items.map((item, i) => (
                  <li key={i} className='text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-2'>
                    <span className='w-1 h-1 rounded-full bg-primary/50' />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className='h-px bg-linear-to-r from-transparent via-primary/30 to-transparent mx-auto mb-8'
        />

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='space-y-6 text-center'
        >
          <div className='space-y-3'>
            <p className='text-sm text-foreground/70 leading-relaxed max-w-2xl mx-auto'>
              An execution layer for published economic research on market-driven allocation mechanisms, replacing discretionary systems with mathematically rigorous algorithms.
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className='h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent mx-auto max-w-xs'
            />
          </div>

          <p className='text-xs text-foreground/50 font-light tracking-widest uppercase'>
            © {currentYear} Real Estate & TDR Exchange of India • Institutional Infrastructure for Market Efficiency
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
