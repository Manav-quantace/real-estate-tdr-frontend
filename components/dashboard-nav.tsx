"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Building2,
    LayoutDashboard,
    Wallet,
    Gavel,
    ShoppingCart,
    FileCheck,
    Settings,
    LogOut,
    Menu,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "./ui/button"

export function DashboardNav() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
        { href: "/dashboard/listings", label: "My Listings", icon: Building2 },
        { href: "/dashboard/bids", label: "My Bids", icon: Gavel },
        { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
        { href: "/dashboard/kyc", label: "KYC Verification", icon: FileCheck },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ]

    const NavLinks = () => (
        <>
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                        <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                )
            })}
        </>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
                <div className="p-6 border-b border-border">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        <span className="font-bold">RE-TDR Exchange</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLinks />
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <div className="px-3 py-2 text-sm">
                        <p className="font-medium">t</p>
                        <p className="text-muted-foreground truncate">t</p>
                    </div>
                    <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden border-b border-border bg-card p-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <span className="font-bold">RE-TDR</span>
                </Link>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="p-6 border-b border-border">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                <span className="font-bold">RE-TDR Exchange</span>
                            </Link>
                        </div>

                        <nav className="p-4 space-y-2">
                            <NavLinks />
                        </nav>

                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
                            <div className="px-3 py-2 text-sm">
                                <p className="font-medium">t</p>
                                <p className="text-muted-foreground truncate">t</p>
                            </div>
                            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
