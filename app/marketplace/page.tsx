import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, Shield, TrendingUp, Users } from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-8 w-8" />
                            <span className="text-xl font-bold">RE-TDR Exchange</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                        <span className="h-2 w-2 bg-secondary rounded-full"></span>
                        India's First Real Estate & TDR Exchange
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                        Transparent Trading for Real Estate & Development Rights
                    </h1>
                    <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Trade land parcels and Transferable Development Rights through our secure, auction-based platform powered by
                        the Vickrey model for fair pricing.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/register">
                            <Button size="lg" className="w-full sm:w-auto">
                                Start Trading
                            </Button>
                        </Link>
                        <Link href="/marketplace">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                                Browse Listings
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold">Secure & Transparent</h3>
                        <p className="text-muted-foreground text-sm">
                            All transactions are recorded and verified with complete transparency and security measures.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold">Fair Pricing</h3>
                        <p className="text-muted-foreground text-sm">
                            Vickrey auction model ensures optimal price discovery and eliminates winner's curse.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold">Diverse Assets</h3>
                        <p className="text-muted-foreground text-sm">
                            Trade land parcels, TDR certificates, and development rights across multiple cities.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold">Verified Users</h3>
                        <p className="text-muted-foreground text-sm">
                            KYC-verified participants ensure trust and compliance with regulatory standards.
                        </p>
                    </Card>
                </div>
            </section>

            {/* Stats */}
            <section className="border-t border-border bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-secondary">5000+</div>
                            <div className="text-muted-foreground mt-2">Active Listings</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-secondary">₹2500 Cr</div>
                            <div className="text-muted-foreground mt-2">Transaction Volume</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-secondary">12000+</div>
                            <div className="text-muted-foreground mt-2">Verified Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-secondary">450+</div>
                            <div className="text-muted-foreground mt-2">Active Auctions</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-6 w-6" />
                            <span className="font-semibold">RE-TDR Exchange</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2025 RE-TDR Exchange. Transforming India's real estate market.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
