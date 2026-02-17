//app/(protected)/components/navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, LogOut, Settings, Bell } from 'lucide-react'

interface User {
    id: string
    email: string
    name?: string
    role?: string
    organization?: string
    profile_picture_url?: string
}

const underlineVariants = {
    rest: { scaleX: 0 },
    hover: { scaleX: 1 },
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        // Fetch user data from /api/auth/me
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me')
                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const getRoleBadgeColor = (role?: string) => {
        if (!role) return 'bg-primary/20 text-primary'
        switch (role.toUpperCase()) {
            case 'GOV_AUTHORITY':
                return 'bg-secondary/20 text-secondary'
            case 'DEVELOPER':
                return 'bg-primary/20 text-primary'
            case 'AUCTION_PARTICIPANT':
                return 'bg-emerald-500/20 text-emerald-500'
            default:
                return 'bg-primary/20 text-primary'
        }
    }

    const formatRole = (role?: string) => {
        if (!role) return 'Participant'
        return role
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-background/95 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-primary/5'
                : 'bg-transparent'
                }`}
        >
            <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
                {/* Logo / Brand */}
                <Link href='/workflow-hub'>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className='flex items-center gap-3 cursor-pointer'
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className='w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center'
                        >
                            <span className='text-xs font-bold text-white'>⬆</span>
                        </motion.div>
                        <div>
                            <h2 className='text-lg font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent'>
                                Exchange
                            </h2>
                            <p className='text-xs text-foreground/50 leading-none'>Market Operations</p>
                        </div>
                    </motion.div>
                </Link>

                {/* Center: Navigation Links */}
                <div className='hidden md:flex items-center gap-8'>
                    {[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'My Auctions', href: '/auctions' },
                        { label: 'Settlements', href: '/settlements' },
                    ].map((link) => (
                        <motion.div
                            key={link.label}
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                            className="relative group"
                        >
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>

                            <motion.div
                                variants={underlineVariants}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute bottom-0 left-0 right-0 h-0.5
               bg-linear-to-r from-primary to-secondary
               origin-left"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Right: User Menu */}
                <div className='flex items-center gap-4'>
                    {/* Notification Bell */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className='relative p-2 rounded-lg hover:bg-primary/10 transition-colors'
                    >
                        <Bell className='w-5 h-5 text-foreground/70' />
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className='absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary'
                        />
                    </motion.button>

                    {/* User Menu */}
                    {isLoading ? (
                        <div className='w-10 h-10 rounded-full bg-primary/20 animate-pulse' />
                    ) : user ? (
                        <div className='relative'>
                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-all duration-300 group'
                            >
                                {user.profile_picture_url ? (
                                    <img
                                        src={user.profile_picture_url || "/placeholder.svg"}
                                        alt={user.name || 'User'}
                                        className='w-8 h-8 rounded-full object-cover'
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                                        {(
                                            user.name?.charAt(0) ??
                                            user.email?.charAt(0) ??
                                            'U'
                                        ).toUpperCase()}
                                    </div>
                                )}

                                <div className='hidden sm:block text-left'>
                                    <p className='text-sm font-semibold text-foreground'>{user.name || 'User'}</p>
                                    <motion.span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${getRoleBadgeColor(
                                            user.role,
                                        )}`}
                                    >
                                        {formatRole(user.role)}
                                    </motion.span>
                                </div>

                                <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className='w-4 h-4 text-foreground/60' />
                                </motion.div>
                            </motion.button>

                            {/* Dropdown Menu */}
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={
                                    isMenuOpen
                                        ? { opacity: 1, y: 0, scale: 1 }
                                        : { opacity: 0, y: -10, scale: 0.95, pointerEvents: 'none' }
                                }
                                transition={{ duration: 0.2 }}
                                className='absolute right-0 mt-2 w-64 rounded-xl border border-primary/20 bg-linear-to-br from-card to-card/80 backdrop-blur-xl shadow-xl overflow-hidden'
                            >
                                {/* User Info */}
                                <div className='p-4 border-b border-primary/10 bg-primary/5'>
                                    <p className='text-sm font-semibold text-foreground'>{user.name || 'User'}</p>
                                    <p className='text-xs text-foreground/60 mt-1'>{user.email}</p>
                                    {user.organization && (
                                        <p className='text-xs text-primary font-medium mt-2'>{user.organization}</p>
                                    )}
                                </div>

                                {/* Menu Items */}
                                <div className='py-2'>
                                    {[
                                        { icon: Settings, label: 'Account Settings', href: '/settings' },
                                        { icon: Bell, label: 'Notifications', href: '/notifications' },
                                    ].map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <motion.div
                                                    whileHover={{ x: 4, backgroundColor: 'hsl(155, 78%, 48%, 0.1)' }}
                                                    className='px-4 py-3 flex items-center gap-3 text-sm text-foreground/80 transition-colors'
                                                >
                                                    <Icon className='w-4 h-4 text-primary' />
                                                    {item.label}
                                                </motion.div>
                                            </Link>
                                        )
                                    })}
                                </div>

                                {/* Divider */}
                                <div className='h-px bg-primary/10' />

                                {/* Logout */}
                                <Link href="/logout">
                                    <motion.button
                                        whileHover={{ backgroundColor: 'hsl(0, 0%, 0%, 0.05)' }}
                                        onClick={() => {
                                            // Handle logout
                                            setIsMenuOpen(false)
                                        }}
                                        className='w-full px-4 py-3 flex items-center gap-3 text-sm text-secondary hover:text-secondary transition-colors text-left'
                                    >
                                        <LogOut className='w-4 h-4' />
                                        Logout
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    ) : null}
                </div>
            </div>
        </motion.nav>
    )
}
