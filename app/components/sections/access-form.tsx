'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'


interface AccessFormProps {
    id?: string  // Optional ID for scroll target
}

export default function AccessForm({ id }: AccessFormProps) {
    const [step, setStep] = useState(1)
    const [role, setRole] = useState('')
    const [formData, setFormData] = useState({
        legalName: '',
        organization: '',
        registrationId: '',
        jurisdiction: '',
        purpose: '',
        agreed: false
    })

    const totalSteps = 4
    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1)
    }
    const handlePrev = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const isStepValid = () => {
        if (step === 1) return role
        if (step === 2) return formData.legalName && formData.organization && formData.registrationId && formData.jurisdiction
        if (step === 3) return formData.purpose
        if (step === 4) return formData.agreed
        return false
    }

    const roleConfig: Record<string, { label: string; fields: string[] }> = {
        developer: { label: 'Developer', fields: ['RERA Registration'] },
        buyer: { label: 'Individual/Entity Buyer', fields: ['PAN/Corporate ID'] },
        auditor: { label: 'Auditor', fields: ['CA License'] }
    }

    return (
        <section className='relative py-40 px-6 bg-linear-to-b from-background to-card/10 overflow-hidden' >
            {/* Background accents */}
            <motion.div
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className='absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
            />

            <div className='max-w-2xl mx-auto relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='mb-16 text-center'
                >
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.2 }}
                        className='h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8 max-w-xs'
                    />
                    <h2 className='text-5xl md:text-6xl font-light mb-6 text-balance'>
                        <span className='block text-foreground'>Request</span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold'
                        >
                            Access
                        </motion.span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className='text-lg text-foreground/60 max-w-xl mx-auto font-light'
                        id={id}
                    >
                        Four-step verification process to ensure institutional-grade participant qualification
                    </motion.p>
                </motion.div>

                {/* Progress Indicator with enhanced styling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className='mb-16'
                >
                    <div className='flex justify-between mb-6'>
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${i + 1 <= step
                                        ? 'border-primary bg-primary/20 text-primary'
                                        : 'border-primary/20 bg-card text-foreground/40'
                                    }`}
                                animate={{
                                    scale: i + 1 === step ? 1.15 : 1,
                                    boxShadow:
                                        i + 1 === step
                                            ? '0 0 30px hsl(155, 78%, 48%, 0.3)'
                                            : 'none',
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {i + 1 === step ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className='w-full h-full flex items-center justify-center'
                                    >
                                        {i + 1}
                                    </motion.div>
                                ) : (
                                    i + 1
                                )}
                            </motion.div>
                        ))}
                    </div>
                    <div className='h-1.5 bg-card rounded-full overflow-hidden border border-primary/20'>
                        <motion.div
                            className='h-full bg-linear-to-r from-primary to-secondary'
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className='relative p-10 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur-xl overflow-hidden'
                >
                    {/* Background glow */}
                    <motion.div
                        className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                    />

                    {/* Top accent */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
                    />
                    <div className='relative z-10'>
                        <AnimatePresence mode='wait'>
                            {/* Step 1: Role Selection */}
                            {step === 1 && (
                                <motion.div
                                    key='step1'
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className='text-lg font-semibold mb-6' >Select Your Role</h3>
                                    <RadioGroup value={role} onValueChange={setRole}>
                                        <div className='space-y-4'>
                                            {Object.entries(roleConfig).map(([key, config]) => (
                                                <div key={key} className='flex items-center space-x-3 p-4 rounded border border-border cursor-pointer hover:bg-muted/50 transition-colors'>
                                                    <RadioGroupItem value={key} id={key} />
                                                    <Label htmlFor={key} className='flex-1 cursor-pointer'>
                                                        <span className='font-medium text-foreground'>{config.label}</span>
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </motion.div>
                            )}

                            {/* Step 2: Identity & Compliance */}
                            {step === 2 && role && (
                                <motion.div
                                    key='step2'
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className='text-lg font-semibold mb-6'>Identity & Compliance</h3>
                                    <div className='space-y-4'>
                                        <div>
                                            <Label className='text-sm font-medium'>Legal Name</Label>
                                            <Input
                                                placeholder='Full legal name'
                                                value={formData.legalName}
                                                onChange={e => handleInputChange('legalName', e.target.value)}
                                                className='mt-2 bg-background border-border'
                                            />
                                        </div>
                                        <div>
                                            <Label className='text-sm font-medium'>Organization</Label>
                                            <Input
                                                placeholder='Company/entity name'
                                                value={formData.organization}
                                                onChange={e => handleInputChange('organization', e.target.value)}
                                                className='mt-2 bg-background border-border'
                                            />
                                        </div>
                                        <div>
                                            <Label className='text-sm font-medium'>
                                                {roleConfig[role].fields[0]}
                                            </Label>
                                            <Input
                                                placeholder='Registration ID'
                                                value={formData.registrationId}
                                                onChange={e => handleInputChange('registrationId', e.target.value)}
                                                className='mt-2 bg-background border-border'
                                            />
                                        </div>
                                        <div>
                                            <Label className='text-sm font-medium'>Geographic Jurisdiction</Label>
                                            <Input
                                                placeholder='State/Region'
                                                value={formData.jurisdiction}
                                                onChange={e => handleInputChange('jurisdiction', e.target.value)}
                                                className='mt-2 bg-background border-border'
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Intent Declaration */}
                            {step === 3 && (
                                <motion.div
                                    key='step3'
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className='text-lg font-semibold mb-6'>Intent Declaration</h3>
                                    <div className='space-y-4'>
                                        <div>
                                            <Label htmlFor='purpose' className='text-sm font-medium'>
                                                Purpose of Access
                                            </Label>
                                            <textarea
                                                id='purpose'
                                                placeholder='Describe your intended use of the platform'
                                                value={formData.purpose}
                                                onChange={e => handleInputChange('purpose', e.target.value)}
                                                className='mt-2 w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                                                rows={5}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Submission */}
                            {step === 4 && (
                                <motion.div
                                    key='step4'
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className='text-lg font-semibold mb-6'>Submission & Verification</h3>
                                    <div className='space-y-4 p-4 rounded border border-border bg-muted/20 mb-6'>
                                        <div className='flex items-start gap-3'>
                                            <Checkbox
                                                id='agree'
                                                checked={formData.agreed}
                                                onCheckedChange={checked => handleInputChange('agreed', !!checked)}
                                            />
                                            <Label htmlFor='agree' className='text-sm leading-relaxed cursor-pointer text-muted-foreground'>
                                                I acknowledge that credentials will be issued only after verification of all submitted information. I agree to the platform's terms and governance framework.
                                            </Label>
                                        </div>
                                    </div>

                                    <div className='p-4 rounded bg-secondary/10 border border-secondary/30'>
                                        <p className='text-sm text-foreground font-mono'>
                                            <span className='text-secondary'>→</span> Credentials will be emailed after verification
                                        </p>
                                        <p className='text-xs text-muted-foreground mt-2'>
                                            Expected verification time: 5-7 business days
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className='flex gap-4 mt-12 justify-between items-center'
                >
                    <motion.button
                        whileHover={{ scale: step === 1 ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrev}
                        disabled={step === 1}
                        className='px-6 py-2.5 border border-primary/30 text-foreground rounded-lg hover:border-primary/70 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
                    >
                        Previous
                    </motion.button>

                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className='text-xs text-primary uppercase tracking-widest font-semibold'
                    >
                        Step {step} of {totalSteps}
                    </motion.p>

                    <motion.button
                        whileHover={{ scale: isStepValid() ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={step === totalSteps ? () => { } : handleNext}
                        disabled={!isStepValid()}
                        className='px-8 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-lg hover:shadow-primary/30'
                    >
                        {step === totalSteps ? 'Submit' : 'Next'}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}
