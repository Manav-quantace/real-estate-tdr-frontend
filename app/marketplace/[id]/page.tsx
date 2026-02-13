"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Building2, Users, ArrowLeft, Gavel } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ListingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [bidAmount, setBidAmount] = useState("")

    // Mock data - will be replaced with API call
    const listing = {
        id: params.id,
        title: "Premium TDR Certificate - Mumbai Central",
        type: "tdr",
        location: "Mumbai Central, Maharashtra",
        area: "500 sq.ft FSI",
        basePrice: 2500000,
        currentPrice: 2750000,
        minimumIncrement: 50000,
        status: "active",
        endDate: "January 15, 2025, 6:00 PM",
        totalBids: 12,
        seller: "Premium Properties Ltd",
        description:
            "Premium TDR certificate for 500 sq.ft FSI in Mumbai Central area. Fully verified and ready for transfer. Ideal for residential development projects in the heart of Mumbai.",
        features: ["Verified Certificate", "Clear Title", "Immediate Transfer", "Prime Location"],
        documents: ["TDR Certificate", "Verification Report", "Land Survey", "Legal Opinion"],
    }

    const bidHistory = [
        { bidder: "User****234", amount: 2750000, time: "2 hours ago" },
        { bidder: "User****567", amount: 2700000, time: "5 hours ago" },
        { bidder: "User****891", amount: 2650000, time: "1 day ago" },
        { bidder: "User****123", amount: 2600000, time: "1 day ago" },
    ]

    function handlePlaceBid() {
        const amount = Number.parseFloat(bidAmount)
        if (!amount || amount <= listing.currentPrice) {
            toast({
                title: "Invalid bid amount",
                description: `Bid must be higher than current price (₹${listing.currentPrice.toLocaleString()})`,
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Bid placed successfully",
            description: `Your bid of ₹${amount.toLocaleString()} has been placed`,
        })
        setBidAmount("")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <nav className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Building2 className="h-8 w-8" />
                            <span className="text-xl font-bold">RE-TDR Exchange</span>
                        </Link>
                        <Link href="/dashboard">
                            <Button>Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Marketplace
                </Button>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Card className="overflow-hidden">
                            <div className="relative h-96 bg-muted">
                                <img
                                    src={`/.jpg?height=384&width=768&query=${listing.type}-certificate`}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                                <Badge className="absolute top-4 right-4" variant="default">
                                    {listing.status}
                                </Badge>
                                <Badge className="absolute top-4 left-4" variant="outline">
                                    {listing.type === "land" ? "Land Parcel" : "TDR Certificate"}
                                </Badge>
                            </div>
                        </Card>

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl">{listing.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{listing.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="overview">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="documents">Documents</TabsTrigger>
                                        <TabsTrigger value="bids">Bid History</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold mb-3">Description</h3>
                                            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-3">Key Features</h3>
                                            <ul className="space-y-2">
                                                {listing.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Area</p>
                                                <p className="font-semibold">{listing.area}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Seller</p>
                                                <p className="font-semibold">{listing.seller}</p>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="documents">
                                        <div className="space-y-3">
                                            {listing.documents.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <span className="font-medium">{doc}</span>
                                                    <Button size="sm" variant="outline">
                                                        Download
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="bids">
                                        <div className="space-y-3">
                                            {bidHistory.map((bid, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{bid.bidder}</p>
                                                        <p className="text-sm text-muted-foreground">{bid.time}</p>
                                                    </div>
                                                    <p className="font-bold text-secondary">₹{bid.amount.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Bidding Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Place Your Bid</CardTitle>
                                <CardDescription>Current auction status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Base Price</span>
                                        <span className="font-medium">₹{listing.basePrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Current Bid</span>
                                        <span className="text-2xl font-bold text-secondary">₹{listing.currentPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Minimum Increment</span>
                                        <span className="font-medium">₹{listing.minimumIncrement.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Ends {listing.endDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{listing.totalBids} bids placed</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="bidAmount">Your Bid Amount (₹)</Label>
                                        <Input
                                            id="bidAmount"
                                            type="number"
                                            placeholder={`Min: ${(listing.currentPrice + listing.minimumIncrement).toLocaleString()}`}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full" onClick={handlePlaceBid}>
                                        <Gavel className="mr-2 h-4 w-4" />
                                        Place Bid
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        By placing a bid, you agree to the platform's terms
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Seller Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{listing.seller}</p>
                                        <p className="text-sm text-muted-foreground">Verified Seller</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full bg-transparent">
                                    Contact Seller
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
