'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

type Participant = {
    role: string
    description: string
    responsibilities: string[]
    visibility: string
    selectable: boolean
}

export default function Participants() {
    const sectionRef = useRef<HTMLElement | null>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 80%', 'end 20%'],
    })

    const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.1])

    const participants: Participant[] = [
        {
            role: 'Developer',
            description: 'Acquires land and development rights for project execution',
            responsibilities: [
                'Submit project proposals',
                'Bid for acquisition rights',
                'Compliance documentation',
            ],
            visibility: 'Full market data, competitor bids masked',
            selectable: true,
        },
        {
            role: 'Buyer',
            description: 'Purchases land or development rights for investment or use',
            responsibilities: [
                'Financial capacity verification',
                'Bid participation',
                'Ownership registration',
            ],
            visibility: 'Anonymized market depth and pricing',
            selectable: true,
        },
        {
            role: 'Auditor',
            description: 'Independent verification of transaction and pricing integrity',
            responsibilities: [
                'Bid process observation',
                'Compliance verification',
                'Report generation',
            ],
            visibility: 'Complete transaction audit trail',
            selectable: true,
        },
        {
            role: 'Authority',
            description: 'Government agency setting policy and monitoring market health',
            responsibilities: [
                'Policy framework definition',
                'Market oversight',
                'Regulatory compliance',
            ],
            visibility: 'Aggregate market analytics and trends',
            selectable: false,
        },
    ]

    const cardXTransform = (idx: number): MotionValue<number> =>
        useTransform(scrollYProgress, [0, 1], [
            idx * 10 - 20,
            idx * -10 + 20,
        ])

    return (
        <section
            ref={sectionRef}
            className="relative py-40 px-6 bg-linear-to-b from-background to-card/10 overflow-hidden"
        >
            {/* Background accent */}
            <motion.div
                style={{ opacity: backgroundOpacity }}
                className="absolute -top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-24 text-center"
                >
                    <div className="h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs" />

                    <h2 className="text-5xl md:text-6xl font-light mb-6">
                        <span className="block">Market</span>
                        <span className="block font-bold text-primary">
                            Participants
                        </span>
                    </h2>

                    <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                        Each role serves a defined function in a rule-based market infrastructure.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {participants.map((participant, idx) => {
                        const x = cardXTransform(idx)

                        return (
                            <motion.div
                                key={participant.role}
                                initial={{ opacity: 0, y: 80, rotateX: 15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: idx * 0.12,
                                    ease: 'easeOut',
                                }}
                                whileHover={{ y: -12 }}
                                className="group"
                            >
                                <motion.div
                                    style={{ x }}
                                    className="relative h-full p-8 md:p-10 rounded-2xl
                                        border border-primary/20
                                        bg-linear-to-br from-card via-card/80 to-card/50
                                        backdrop-blur-xl
                                        hover:border-primary/50
                                        transition-all duration-500"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-semibold">
                                            {participant.role}
                                        </h3>

                                        {!participant.selectable && (
                                            <span className="text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                                                Policy
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-foreground/60 mb-8">
                                        {participant.description}
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                                                Key Responsibilities
                                            </h4>
                                            <ul className="space-y-2">
                                                {participant.responsibilities.map((resp) => (
                                                    <li
                                                        key={resp}
                                                        className="text-sm text-foreground/70 flex gap-3"
                                                    >
                                                        <span className="text-primary">→</span>
                                                        <span>{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="border-t border-primary/10" />

                                        <div>
                                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                                                Data Visibility
                                            </h4>
                                            <p className="text-sm text-foreground/60">
                                                {participant.visibility}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
