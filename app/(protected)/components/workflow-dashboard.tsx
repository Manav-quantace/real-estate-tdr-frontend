'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from "./navbar"
import Footer from "@/app/components/sections/footer"


type Role = 'GOV_AUTHORITY' | 'AUDITOR' | 'DEVELOPER' | 'BUYER' | 'SLUM_DWELLER' | 'AFFORDABLE_DEVELOPER' | 'CONTRACTOR'

type RoundInfo = {
  t: number
  state: 'new' | 'open' | 'closed' | 'locked'
  is_open: boolean
  is_locked: boolean
}

type ValuerValuation = {
  status: string
  value_inr?: number | null
  updated_at: string
}

type ProjectBase = {
  project_id: string
  title: string
  category: string
  city: string
  zone: string
  status: string
  valuer_valuation?: ValuerValuation
  current_round?: RoundInfo | null
}

type WorkflowConfig = {
  name: string
  title: string
  description: string
  icon: React.ReactNode
  color: 'emerald' | 'blue' | 'amber' | 'purple'
  roles: Role[]
  features: {
    hasValuer: boolean
    hasRounds: boolean
    hasQuote: boolean
    hasAsk: boolean
    hasSettlement: boolean
    roleBasedAccess: boolean
  }
}

const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  saleable: {
    name: 'saleable',
    title: 'Saleable Redevelopment',
    description: 'Market-driven allocation for saleable properties through transparent pricing mechanisms',
    icon: '🏢',
    color: 'emerald',
    roles: ['DEVELOPER', 'BUYER', 'GOV_AUTHORITY', 'AUDITOR'],
    features: {
      hasValuer: true,
      hasRounds: true,
      hasQuote: true,
      hasAsk: true,
      hasSettlement: true,
      roleBasedAccess: true,
    },
  },
  subsidized: {
    name: 'subsidized',
    title: 'Subsidized Redevelopment',
    description: 'Government-subsidized projects with transparent allocation mechanisms',
    icon: '🏛️',
    color: 'blue',
    roles: ['DEVELOPER', 'BUYER', 'GOV_AUTHORITY', 'AUDITOR'],
    features: {
      hasValuer: true,
      hasRounds: true,
      hasQuote: true,
      hasAsk: true,
      hasSettlement: true,
      roleBasedAccess: true,
    },
  },
  slum: {
    name: 'slum',
    title: 'Slum Redevelopment',
    description: 'Community-driven slum redevelopment with role-based participant enrollment',
    icon: '🏘️',
    color: 'amber',
    roles: ['SLUM_DWELLER', 'AFFORDABLE_DEVELOPER', 'CONTRACTOR', 'GOV_AUTHORITY', 'AUDITOR'],
    features: {
      hasValuer: false,
      hasRounds: false,
      hasQuote: false,
      hasAsk: false,
      hasSettlement: false,
      roleBasedAccess: true,
    },
  },
  clearland: {
    name: 'clearland',
    title: 'Clear Land',
    description: 'Clear land allocation through institutional mechanisms',
    icon: '🌱',
    color: 'purple',
    roles: ['DEVELOPER', 'BUYER', 'GOV_AUTHORITY', 'AUDITOR'],
    features: {
      hasValuer: false,
      hasRounds: true,
      hasQuote: false,
      hasAsk: true,
      hasSettlement: true,
      roleBasedAccess: true,
    },
  },
}

const getRoleColor = (role: Role) => {
  const roleColors: Record<Role, string> = {
    GOV_AUTHORITY: 'from-blue-500 to-blue-600',
    AUDITOR: 'from-purple-500 to-purple-600',
    DEVELOPER: 'from-emerald-500 to-emerald-600',
    BUYER: 'from-amber-500 to-amber-600',
    SLUM_DWELLER: 'from-rose-500 to-rose-600',
    AFFORDABLE_DEVELOPER: 'from-cyan-500 to-cyan-600',
    CONTRACTOR: 'from-orange-500 to-orange-600',
  }
  return roleColors[role] || 'from-primary to-secondary'
}

const getRoleLabel = (role: Role) => {
  const labels: Record<Role, string> = {
    GOV_AUTHORITY: 'Government Authority',
    AUDITOR: 'Auditor',
    DEVELOPER: 'Developer',
    BUYER: 'Buyer',
    SLUM_DWELLER: 'Slum Dweller',
    AFFORDABLE_DEVELOPER: 'Affordable Housing Developer',
    CONTRACTOR: 'Contractor',
  }
  return labels[role] || role
}

interface WorkflowDashboardProps {
  workflow: string
  role: Role
  items: ProjectBase[]
  userProfile?: {
    name?: string
    email?: string
    organization?: string
  }
}

export default function WorkflowDashboard({
  workflow,
  role,
  items,
  userProfile,
}: WorkflowDashboardProps) {
  const config = WORKFLOW_CONFIGS[workflow] || WORKFLOW_CONFIGS.saleable
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const isRoleAvailable = config.roles.includes(role)

  return (
    <div className='bg-background text-foreground min-h-screen flex flex-col'>
    {/*<Navbar userProfile={userProfile} /> */}

      <main className='grow'>
        <div className='relative py-20 px-6 bg-linear-to-b from-background via-card/10 to-background overflow-hidden'>
          {/* Background accents */}
          <motion.div
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 8, repeat: Infinity }}
            className='absolute -top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl'
          />
          <motion.div
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className='absolute -bottom-40 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl'
          />

          <div className='max-w-6xl mx-auto relative z-10'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='mb-12'
            >
              <div className='flex items-center gap-4 mb-6'>
                <div className='text-5xl'>{config.icon}</div>
                <div>
                  <h1 className='text-5xl font-light text-balance'>
                    <span className='block text-foreground'>{config.title}</span>
                  </h1>
                  <p className='text-lg text-foreground/60 font-light mt-2 max-w-2xl'>
                    {config.description}
                  </p>
                </div>
              </div>

              {/* Role badge and actions */}
              <div className='flex flex-wrap items-center gap-4 pt-4 border-t border-primary/20'>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`px-4 py-2 rounded-full bg-linear-to-r ${getRoleColor(role)} text-white text-sm font-semibold`}
                >
                  {getRoleLabel(role)}
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href='/workflow-hub'
                    className='px-4 py-2 border border-primary/40 rounded-lg hover:border-primary/70 hover:bg-primary/5 transition-all text-sm font-medium'
                  >
                    Change Workflow
                  </Link>
                </motion.div>

                {workflow === 'slum' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Link
                      href={`/${workflow}/roles`}
                      className='px-4 py-2 bg-primary/20 border border-primary/40 rounded-lg hover:bg-primary/30 transition-all text-sm font-medium text-primary'
                    >
                      Manage Roles
                    </Link>
                  </motion.div>
                )}

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='ml-auto'
                >
                  <Link
                    href={`/${workflow}/projects/new`}
                    className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-semibold shadow-lg hover:shadow-lg hover:shadow-primary/30'
                  >
                    + New Project
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Projects section */}
            {!isRoleAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='mb-8 p-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur'
              >
                <p className='text-yellow-800 dark:text-yellow-200 font-medium'>
                  Your current role ({getRoleLabel(role)}) is not available for {config.title}. Please change your workflow or contact your administrator.
                </p>
              </motion.div>
            )}

            <div className='space-y-4'>
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='p-12 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur text-center'
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className='inline-block text-5xl mb-4'
                  >
                    {config.icon}
                  </motion.div>
                  <h3 className='text-xl font-semibold mb-2'>No projects yet</h3>
                  <p className='text-foreground/60 mb-6'>Start by creating your first project in this workflow.</p>
                  <Link
                    href={`/${workflow}/projects/new`}
                    className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium'
                  >
                    <span>+</span>
                    Create New Project
                  </Link>
                </motion.div>
              ) : (
                items.map((project, idx) => (
                  <motion.div
                    key={project.project_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <ProjectCard
                      project={project}
                      config={config}
                      role={role}
                      workflow={workflow}
                      isExpanded={expandedId === project.project_id}
                      onToggle={() =>
                        setExpandedId(expandedId === project.project_id ? null : project.project_id)
                      }
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface ProjectCardProps {
  project: ProjectBase
  config: WorkflowConfig
  role: Role
  workflow: string
  isExpanded: boolean
  onToggle: () => void
}

function ProjectCard({
  project,
  config,
  role,
  workflow,
  isExpanded,
  onToggle,
}: ProjectCardProps) {
  const round = project.current_round

  return (
    <motion.div
      onClick={onToggle}
      className='group cursor-pointer p-6 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card/80 to-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 overflow-hidden'
    >
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
        className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-secondary origin-left'
      />

      {/* Main content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='grow'>
            <div className='flex items-center gap-3 mb-2'>
              <h3 className='text-xl font-semibold text-foreground'>{project.title}</h3>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-linear-to-r ${getRoleColor(role)}`}
              >
                {project.status}
              </motion.span>
            </div>
            <p className='text-sm text-foreground/60'>
              {project.city} • {project.zone} • {project.category}
            </p>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </motion.div>
        </div>

        {/* Round info if available */}
        {config.features.hasRounds && round && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20'
          >
            <p className='text-sm font-mono text-primary'>
              <span className='font-semibold'>Round {round.t}</span> • State: <span className='font-semibold'>{round.state}</span>
            </p>
          </motion.div>
        )}

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='mt-4 space-y-4'
            >
              {/* Valuer info if applicable */}
              {config.features.hasValuer && project.valuer_valuation && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className='p-4 rounded-lg bg-card border border-border/50'
                >
                  <p className='text-xs font-bold text-primary uppercase tracking-widest mb-2'>Independent Valuation</p>
                  <div className='text-sm space-y-1 font-mono text-foreground/80'>
                    <p>Status: {project.valuer_valuation.status}</p>
                    <p>Value: ₹{project.valuer_valuation.value_inr?.toLocaleString() || '—'}</p>
                    <p>Updated: {project.valuer_valuation.updated_at?.split('T')[0] || '—'}</p>
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className='flex flex-wrap gap-2 pt-2 border-t border-border/50'
              >
                {role === 'DEVELOPER' && config.features.hasAsk && (
                  <Link
                    href={`/${workflow}/projects/${project.project_id}/ask`}
                    className='px-4 py-2 text-sm font-medium rounded-lg bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 transition-all'
                  >
                    Your Ask
                  </Link>
                )}

                {role === 'BUYER' && config.features.hasQuote && (
                  <Link
                    href={`/${workflow}/projects/${project.project_id}/quote`}
                    className='px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all'
                  >
                    Your Quote
                  </Link>
                )}

                {role === 'GOV_AUTHORITY' && (
                  <>
                    <Link
                      href={`/authority/${workflow}/projects/${project.project_id}/rounds`}
                      className='px-4 py-2 text-sm font-medium rounded-lg bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30 transition-all'
                    >
                      Manage Rounds
                    </Link>
                    <Link
                      href={`/authority/${workflow}/projects/${project.project_id}/inventory`}
                      className='px-4 py-2 text-sm font-medium rounded-lg bg-purple-500/20 text-purple-500 border border-purple-500/40 hover:bg-purple-500/30 transition-all'
                    >
                      Inventory
                    </Link>
                    <Link
                      href={`/authority/${workflow}/projects/${project.project_id}/charges`}
                      className='px-4 py-2 text-sm font-medium rounded-lg bg-purple-500/20 text-purple-500 border border-purple-500/40 hover:bg-purple-500/30 transition-all'
                    >
                      Government Charges
                    </Link>
                    
                  </>
                )}

                {round?.is_locked && config.features.hasSettlement && (
                  <>
                  <Link
                    href={`/${workflow}/projects/${project.project_id}/settlement`}
                    className='px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/40 hover:bg-amber-500/30 transition-all'
                  >
                    Settlement
                  </Link>
                  <Link
                    href={`/${workflow}/projects/${project.project_id}/matching`}
                    className='px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/40 hover:bg-amber-500/30 transition-all'
                  >
                    Matching
                  </Link>
                  </>
                )}

                {/* Unavailable feature indicator */}
                {!config.features.hasAsk && role === 'DEVELOPER' && (
                  <button
                    disabled
                    className='px-4 py-2 text-sm font-medium rounded-lg bg-muted/20 text-muted-foreground border border-muted/40 opacity-50 cursor-not-allowed'
                    title='Ask feature not available for this workflow'
                  >
                    Your Ask
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className='absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/0 via-primary to-primary/0 origin-left'
        />
      </div>
    </motion.div>
  )
}
