"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { AuctionTimer } from "@/app/components/auction-timer"

export default function AuctionsPage() {
  const liveAuctions = [
    {
      id: "1",
      title: "Premium TDR Certificate - Mumbai Central",
      type: "tdr",
      location: "Mumbai, Maharashtra",
      area: "500 sq.ft FSI",
      currentBid: 2750000,
      totalBids: 12,
      endDate: "2025-01-15T18:00:00",
      image: "tdr-certificate",
    },
    {
      id: "2",
      title: "Commercial Land - Bandra West",
      type: "land",
      location: "Bandra, Mumbai",
      area: "2000 sq.ft",
      currentBid: 16500000,
      totalBids: 8,
      endDate: "2025-01-18T20:00:00",
      image: "commercial-land",
    },
    {
      id: "3",
      title: "Residential TDR - Andheri",
      type: "tdr",
      location: "Andheri, Mumbai",
      area: "750 sq.ft FSI",
      currentBid: 3200000,
      totalBids: 15,
      endDate: "2025-01-20T19:00:00",
      image: "residential-tdr",
    },
  ]

  const upcomingAuctions = [
    {
      id: "upcoming-1",
      title: "Industrial Land - Pune",
      type: "land",
      location: "Pune, Maharashtra",
      area: "4000 sq.ft",
      startingBid: 10000000,
      startDate: "2025-01-25T10:00:00",
      image: "industrial-land",
    },
  ]

  const endedAuctions = [
    {
      id: "ended-1",
      title: "TDR Certificate - Worli",
      type: "tdr",
      location: "Worli, Mumbai",
      area: "300 sq.ft FSI",
      finalBid: 1950000,
      winner: "User****234",
      endDate: "2025-01-10T18:00:00",
      image: "tdr-certificate",
    },
  ]

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
            <div className="flex items-center gap-4">
              <Link href="/marketplace">
                <Button variant="ghost">Marketplace</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Live Auctions</h1>
          <p className="text-muted-foreground mt-2">Participate in ongoing and upcoming auctions</p>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList>
            <TabsTrigger value="live">Live ({liveAuctions.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAuctions.length})</TabsTrigger>
            <TabsTrigger value="ended">Ended ({endedAuctions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4">
            {liveAuctions.map((auction) => (
              <Card key={auction.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 h-40 bg-muted rounded-lg overflow-hidden relative">
                      <img
                        src={`/.jpg?height=160&width=256&query=${auction.image}`}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <AuctionTimer endDate={auction.endDate} />
                      </div>
                      <Badge className="absolute top-3 left-3" variant="outline">
                        {auction.type === "land" ? "Land" : "TDR"}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{auction.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{auction.location}</span>
                          <span className="ml-4">Area: {auction.area}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Bid</p>
                          <p className="text-2xl font-bold text-secondary">₹{auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Bids</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <span className="text-xl font-semibold">{auction.totalBids}</span>
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Link href={`/marketplace/${auction.id}`} className="w-full">
                            <Button className="w-full">Place Bid</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAuctions.map((auction) => (
              <Card key={auction.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 h-40 bg-muted rounded-lg overflow-hidden relative">
                      <img
                        src={`/.jpg?height=160&width=256&query=${auction.image}`}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3" variant="outline">
                        {auction.type === "land" ? "Land" : "TDR"}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{auction.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{auction.location}</span>
                          <span className="ml-4">Area: {auction.area}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Starting Bid</p>
                          <p className="text-2xl font-bold">₹{auction.startingBid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Starts On</p>
                          <p className="font-semibold">{new Date(auction.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-end">
                          <Button variant="outline" className="w-full bg-transparent">
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="ended" className="space-y-4">
            {endedAuctions.map((auction) => (
              <Card key={auction.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 h-40 bg-muted rounded-lg overflow-hidden relative">
                      <img
                        src={`/.jpg?height=160&width=256&query=${auction.image}`}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3" variant="outline">
                        {auction.type === "land" ? "Land" : "TDR"}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-xl">{auction.title}</h3>
                          <Badge variant="outline">Sold</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{auction.location}</span>
                          <span className="ml-4">Area: {auction.area}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Final Bid</p>
                          <p className="text-xl font-bold text-secondary">₹{auction.finalBid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Winner</p>
                          <p className="font-semibold">{auction.winner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ended</p>
                          <p className="font-semibold">{new Date(auction.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Auction Stats */}
        <div className="grid md:grid-cols-4 gap-4 pt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Live Auctions</CardDescription>
              <CardTitle className="text-3xl">{liveAuctions.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Volume</CardDescription>
              <CardTitle className="text-3xl">₹22.4 Cr</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Bidders</CardDescription>
              <CardTitle className="text-3xl">245</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg. Participation</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                12
                <TrendingUp className="h-5 w-5 text-secondary" />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
