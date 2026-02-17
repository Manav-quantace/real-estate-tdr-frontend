//app/authority/clearland/projects/new/page.tsx
'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Check, Loader2, AlertCircle } from 'lucide-react'

interface FormErrors {
    title?: string
    city?: string
    zone?: string
    jurisdiction?: string
}

const initialForm = {
    title: '',
    city: '',
    zone: '',
    jurisdiction: '',
    description: '',
}

export default function NewClearlandProjectPage() {
    const router = useRouter()
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [completed, setCompleted] = useState<Set<string>>(new Set())

    const validateField = (name: string, value: string) => {
        if (['title', 'city', 'zone', 'jurisdiction'].includes(name) && !value.trim()) {
            return `${name[0].toUpperCase() + name.slice(1)} is required`
        }
        if (name === 'title' && value.length < 5) {
            return 'Title must be at least 5 characters'
        }
        return undefined
    }

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))

        const err = validateField(name, value)
        setErrors(prev => {
            const next = { ...prev }
            if (err) next[name as keyof FormErrors] = err
            else delete next[name as keyof FormErrors]
            return next
        })

        if (!err && value.trim()) {
            setCompleted(prev => new Set([...prev, name]))
        }
    }

    const validateForm = () => {
        const next: FormErrors = {}
            ; (['title', 'city', 'zone', 'jurisdiction'] as const).forEach(k => {
                const err = validateField(k, form[k])
                if (err) next[k] = err
            })
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const submit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            toast.error('Fix validation errors before submitting')
            return
        }

        setIsLoading(true)
        try {
            const payload = {
                workflow: 'clearland',
                title: form.title,
                metadata: {
                    kind: 'clearland',

                    // REQUIRED by schema
                    city: form.city,
                    zone: form.zone,

                    // 🔒 fixed quantity (book logic)
                    parcel_area_sq_m: 1000,        // placeholder, authority-controlled
                    parcel_size_band: 'M',         // authority policy band

                    // optional (has default)
                    parcel_status: 'available',
                },
            }

            const res = await fetch('/api/projects?workflow=clearland', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error('Failed to create project', {
                    description: data.detail || data.message || '',
                })
                setIsLoading(false)
                return
            }

            toast.success('Clearland project created', {
                description: 'Project initialized in INIT phase',
            })

            router.push(`/authority/clearland/projects/${data.projectId}/phase`)
        } catch (err) {
            console.error(err)
            toast.error('Network error — could not create project')
        } finally {
            setIsLoading(false)
        }
    }, [form, router])

    return (
        <section className="relative min-h-screen bg-linear-to-br from-background via-card to-[hsl(160,18%,12%)] flex items-center justify-center px-6 py-6">
            {/* Ambient background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
                />
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-3xl bg-card/90 backdrop-blur rounded-2xl shadow-xl border border-primary/20 p-8"
            >
                <h1 className="text-3xl font-light text-foreground mb-2">
                    New <span className="font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Clearland</span> Project
                </h1>
                <p className="text-sm text-foreground/60 mb-8">
                    Initialize a governed, competitive development-rights auction.
                    Quantity is fixed by policy; prices are discovered by the market.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium">Project title</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            className={`mt-2 w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-400 bg-red-50' : 'border-primary/30 bg-background'
                                }`}
                            placeholder="e.g. Eastern Corridor Redevelopment"
                        />
                        {errors.title && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {errors.title}
                            </p>
                        )}
                    </div>

                    {/* City / Zone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">City</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={onChange}
                                className="mt-2 w-full px-4 py-2 rounded-lg border border-primary/30 bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Zone / ward</label>
                            <input
                                name="zone"
                                value={form.zone}
                                onChange={onChange}
                                className="mt-2 w-full px-4 py-2 rounded-lg border border-primary/30 bg-background"
                            />
                        </div>
                    </div>

                    {/* Jurisdiction */}
                    <div>
                        <label className="text-sm font-medium">Jurisdiction authority</label>
                        <input
                            name="jurisdiction"
                            value={form.jurisdiction}
                            onChange={onChange}
                            className="mt-2 w-full px-4 py-2 rounded-lg border border-primary/30 bg-background"
                            placeholder="Municipal Corporation / State Authority"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium">Description (optional)</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={4}
                            className="mt-2 w-full px-4 py-2 rounded-lg border border-primary/30 bg-background"
                            placeholder="Public or internal notes about the project"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 rounded-lg border border-primary/30 text-foreground/70"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </section>
    )
}