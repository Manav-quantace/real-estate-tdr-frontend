//app/authority/slum/projects/new/page.tsx
'use client'

import React from "react"

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { AlertCircle, Check, Loader2 } from 'lucide-react'

interface FormErrors {
    title?: string
    city?: string
    zone?: string
    jurisdiction?: string
}  

interface FormData {
    title: string
    city: string
    zone: string
    landType: 'road' | 'rail' | 'other'
    jurisdiction: string
}

const initialFormData: FormData = {
    title: '',
    city: '',
    zone: '',
    landType: 'road',
    jurisdiction: '',
}

const fieldDescriptions = {
    title: 'Give your slum redevelopment project a unique, descriptive name',
    city: 'The city or metropolitan area where the slum redevelopment project is located',
    zone: 'The specific zone, ward, or district within the city',
    landType: 'Classification of the land based on proximity to critical infrastructure',
    jurisdiction: 'The government body or authority overseeing the project',
}

export default function NewSlumProjectPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())

    const validateField = (name: string, value: string): string | undefined => {
        if (!value.trim()) {
            return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
        }

        if (name === 'title' && value.length < 5) {
            return 'Project title must be at least 5 characters'
        }

        if (name === 'city' && value.length < 2) {
            return 'City name must be at least 2 characters'
        }

        if (name === 'zone' && value.length < 2) {
            return 'Zone must be at least 2 characters'
        }

        if (name === 'jurisdiction' && value.length < 3) {
            return 'Jurisdiction body name must be at least 3 characters'
        }

        return undefined
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        const error = validateField(name, value)
        setErrors(prev => {
            const newErrors = { ...prev }
            if (error) {
                newErrors[name as keyof FormErrors] = error
            } else {
                delete newErrors[name as keyof FormErrors]
            }
            return newErrors
        })

        if (!error && value.trim()) {
            setCompletedFields(prev => new Set([...prev, name]))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        Object.entries(formData).forEach(([key, value]) => {
            const error = validateField(key, value)
            if (error) {
                newErrors[key as keyof FormErrors] = error
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (!validateForm()) {
                toast.error('Please fix all errors before submitting', {
                    description: 'Check the highlighted fields for details',
                })
                return
            }

            setIsLoading(true)

            try {
                const payload = {
                    workflow: 'slum',
                    title: formData.title,
                    metadata: {
                        kind: 'slum',
                        portal_slum_dweller_enabled: true,
                        portal_slum_land_developer_enabled: true,
                        portal_affordable_housing_dev_enabled: true,
                        government_land_type: formData.landType,
                        jurisdiction_body: formData.jurisdiction,
                        project_city: formData.city,
                        project_zone: formData.zone,
                    },
                }

                const res = await fetch('/api/projects?workflow=slum', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })

                const data = await res.json()

                if (!res.ok) {
                    toast.error('Failed to create project', {
                        description:
                            data.message ||
                            'An error occurred while creating the project. Please try again.',
                    })
                    return
                }

                toast.success('Project created successfully!', {
                    description: `${formData.title} is now ready for development.`,
                })

                setFormData(initialFormData)
                setErrors({})
                setCompletedFields(new Set())

                setTimeout(() => {
                    router.push(`/authority/projects/${data.projectId}/rounds`)
                }, 1000)
            } catch (error) {
                toast.error('Connection error', {
                    description: 'Unable to connect to the server. Please try again.',
                })
                console.error('Form submission error:', error)
            } finally {
                setIsLoading(false)
            }
        },
        [formData, router]
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    const backgroundVariants = {
        animate: {
            backgroundPosition: ['0% 0%', '100% 100%'],
            transition: { duration: 20, repeat: Infinity, repeatType: 'reverse' as const },
        },
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <motion.div
                variants={backgroundVariants}
                animate="animate"
                className="absolute inset-0 bg-linear-to-br from-emerald-50 via-teal-50 to-green-100 opacity-60"
                style={{
                    backgroundSize: '200% 200%',
                }}
            />

            {/* Floating Elements Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-2xl"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 mb-6"
                        >
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                        </motion.div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Slum <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Redevelopment</span>
                        </h1>
                        <p className="text-lg text-gray-600">
                            Create and manage urban renewal initiatives with transparency and community engagement
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Project Title
                                </label>
                                <p className="text-xs text-gray-500 mb-3">{fieldDescriptions.title}</p>
                                <div className="relative">
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Ramdev Nagar Phase 2 Redevelopment"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${errors.title
                                                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                                : completedFields.has('title')
                                                    ? 'border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                                    : 'border-gray-200 bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                            } outline-none`}
                                    />
                                    {completedFields.has('title') && !errors.title && (
                                        <Check className="absolute right-4 top-3.5 w-5 h-5 text-emerald-600" />
                                    )}
                                </div>
                                {errors.title && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            {/* City Field */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                                    City
                                </label>
                                <p className="text-xs text-gray-500 mb-3">{fieldDescriptions.city}</p>
                                <div className="relative">
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Mumbai, Delhi, Bangalore"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${errors.city
                                                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                                : completedFields.has('city')
                                                    ? 'border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                                    : 'border-gray-200 bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                            } outline-none`}
                                    />
                                    {completedFields.has('city') && !errors.city && (
                                        <Check className="absolute right-4 top-3.5 w-5 h-5 text-emerald-600" />
                                    )}
                                </div>
                                {errors.city && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.city}
                                    </div>
                                )}
                            </div>

                            {/* Zone Field */}
                            <div>
                                <label htmlFor="zone" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Zone / Ward
                                </label>
                                <p className="text-xs text-gray-500 mb-3">{fieldDescriptions.zone}</p>
                                <div className="relative">
                                    <input
                                        id="zone"
                                        name="zone"
                                        type="text"
                                        value={formData.zone}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Ward 34, Zone A"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${errors.zone
                                                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                                : completedFields.has('zone')
                                                    ? 'border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                                    : 'border-gray-200 bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                            } outline-none`}
                                    />
                                    {completedFields.has('zone') && !errors.zone && (
                                        <Check className="absolute right-4 top-3.5 w-5 h-5 text-emerald-600" />
                                    )}
                                </div>
                                {errors.zone && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.zone}
                                    </div>
                                )}
                            </div>

                            {/* Land Type Field */}
                            <div>
                                <label htmlFor="landType" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Land Type
                                </label>
                                <p className="text-xs text-gray-500 mb-3">{fieldDescriptions.landType}</p>
                                <div className="relative">
                                    <select
                                        id="landType"
                                        name="landType"
                                        value={formData.landType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all duration-200 appearance-none cursor-pointer"
                                    >
                                        <option value="road">Road Side Land</option>
                                        <option value="rail">Railway Adjacent Land</option>
                                        <option value="other">Other Classification</option>
                                    </select>
                                    <svg
                                        className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Jurisdiction Field */}
                            <div>
                                <label htmlFor="jurisdiction" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Jurisdiction Authority
                                </label>
                                <p className="text-xs text-gray-500 mb-3">{fieldDescriptions.jurisdiction}</p>
                                <div className="relative">
                                    <input
                                        id="jurisdiction"
                                        name="jurisdiction"
                                        type="text"
                                        value={formData.jurisdiction}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Municipal Corporation, MHADA"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${errors.jurisdiction
                                                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                                                : completedFields.has('jurisdiction')
                                                    ? 'border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                                    : 'border-gray-200 bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                            } outline-none`}
                                    />
                                    {completedFields.has('jurisdiction') && !errors.jurisdiction && (
                                        <Check className="absolute right-4 top-3.5 w-5 h-5 text-emerald-600" />
                                    )}
                                </div>
                                {errors.jurisdiction && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.jurisdiction}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading || Object.keys(errors).length > 0}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${isLoading || Object.keys(errors).length > 0
                                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                        : 'bg-linear-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Project...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Create Slum Redevelopment Project
                                    </>
                                )}
                            </motion.button>

                            {/* Info Footer */}
                            <p className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
                                All fields are required to proceed. Your project will be visible to all stakeholders
                                immediately after creation.
                            </p>
                        </form>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-600"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Secure & Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Government Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Community Transparent</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
