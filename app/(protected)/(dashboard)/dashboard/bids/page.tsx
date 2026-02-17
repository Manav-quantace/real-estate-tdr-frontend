"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function MyBidsPage() {
    const activeBids = [
        {
            id: "bid-1",
            listingId: "1",
            title: "Premium TDR Certificate - Mumbai Central",
            location: "Mumbai, Maharashtra",
            yourBid: 2750000,
            currentBid: 2750000,
            status: "leading",
            endDate: "Jan 15, 2025",
            image: "tdr-certificate",
        },
        {
            id: "bid-2",
            listingId: "4",
            title: "Industrial Land - Thane",
            location: "Thane, Maharashtra",
            yourBid: 8200000,
            currentBid: 8500000,
            status: "outbid",
            endDate: "Jan 22, 2025",
            image: "industrial-land",
        },
    ]

    const wonAuctions = [
        {
            id: "won-1",
            listingId: "land-045",
            title: "Residential Land - Delhi",
            location: "South Delhi, Delhi",
            winningBid: 1250000,
            wonDate: "Jan 8, 2025",
            status: "payment-pending",
            image: "residential-land",
        },
    ]

    const lostAuctions = [
        {
            id: "lost-1",
            listingId: "tdr-089",
            title: "TDR Certificate - Bandra",
            location: "Bandra, Mumbai",
            yourBid: 3100000,
            winningBid: 3250000,
            endDate: "Jan 5, 2025",
            image: "tdr-certificate",
        },
    ]

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Bids</h1>
                <p className="text-muted-foreground mt-1">Track your auction participation and results</p>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList>
                    <TabsTrigger value="active">Active ({activeBids.length})</TabsTrigger>
                    <TabsTrigger value="won">Won ({wonAuctions.length})</TabsTrigger>
                    <TabsTrigger value="lost">Lost ({lostAuctions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    {activeBids.map((bid) => (
                        <Card key={bid.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden">
                                        <img
                                            src={`/.jpg?height=128&width=192&query=${bid.image}`}
                                            alt={bid.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-semibold text-lg">{bid.title}</h3>
                                                <Badge variant={bid.status === "leading" ? "default" : "destructive"}>
                                                    {bid.status === "leading" ? (
                                                        <>
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Leading
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Outbid
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{bid.location}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Your Bid</p>
                                                <p className="font-semibold">₹{bid.yourBid.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Current Bid</p>
                                                <p className="font-semibold text-secondary">₹{bid.currentBid.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Ends</p>
                                                <p className="font-semibold">{bid.endDate}</p>
                                            </div>
                                            <div className="flex items-end">
                                                <Link href={`/marketplace/${bid.listingId}`}>
                                                    <Button size="sm" variant={bid.status === "outbid" ? "default" : "outline"}>
                                                        {bid.status === "outbid" ? "Increase Bid" : "View Auction"}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="won" className="space-y-4">
                    {wonAuctions.map((auction) => (
                        <Card key={auction.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden">
                                        <img
                                            src={`/.jpg?height=128&width=192&query=${auction.image}`}
                                            alt={auction.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-semibold text-lg">{auction.title}</h3>
                                                <Badge variant="default" className="bg-secondary">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Won
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{auction.location}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Winning Bid</p>
                                                <p className="font-semibold text-secondary">₹{auction.winningBid.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Won On</p>
                                                <p className="font-semibold">{auction.wonDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Status</p>
                                                <Badge variant="outline" className="capitalize">
                                                    {auction.status.replace("-", " ")}
                                                </Badge>
                                            </div>
                                            <div className="flex items-end">
                                                <Button size="sm">Complete Payment</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="lost" className="space-y-4">
                    {lostAuctions.map((auction) => (
                        <Card key={auction.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden">
                                        <img
                                            src={`/.jpg?height=128&width=192&query=${auction.image}`}
                                            alt={auction.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-semibold text-lg">{auction.title}</h3>
                                                <Badge variant="outline">Ended</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{auction.location}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Your Bid</p>
                                                <p className="font-semibold">₹{auction.yourBid.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Winning Bid</p>
                                                <p className="font-semibold text-secondary">₹{auction.winningBid.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Ended</p>
                                                <p className="font-semibold">{auction.endDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Active Bids</CardDescription>
                        <CardTitle className="text-3xl">{activeBids.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>In progress</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Auctions Won</CardDescription>
                        <CardTitle className="text-3xl">{wonAuctions.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-secondary">
                            <TrendingUp className="h-4 w-4" />
                            <span>100% success rate</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Amount Committed</CardDescription>
                        <CardTitle className="text-3xl">₹1.1 Cr</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Across all bids</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
