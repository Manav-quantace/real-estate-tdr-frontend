"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ListingCard } from "@/components/listing-nav"

export default function MyListingsPage() {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    // Mock data
    const myListings = [
        {
            id: "ml-1",
            title: "My TDR Certificate - Andheri",
            type: "tdr" as const,
            location: "Andheri, Mumbai",
            area: "300 sq.ft FSI",
            basePrice: 1500000,
            currentPrice: 1650000,
            status: "active" as const,
            endDate: "Jan 20, 2025",
        },
        {
            id: "ml-2",
            title: "Commercial Plot - Thane",
            type: "land" as const,
            location: "Thane, Maharashtra",
            area: "1500 sq.ft",
            basePrice: 6000000,
            currentPrice: 6000000,
            status: "pending" as const,
        },
    ]

    function handleCreateListing() {
        toast({
            title: "Listing created",
            description: "Your listing has been published successfully",
        })
        setOpen(false)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Listings</h1>
                    <p className="text-muted-foreground mt-1">Manage your property listings and auctions</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Listing
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Listing</DialogTitle>
                            <DialogDescription>List your land parcel or TDR certificate for auction</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Asset Type</Label>
                                <Select defaultValue="tdr">
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="land">Land Parcel</SelectItem>
                                        <SelectItem value="tdr">TDR Certificate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Premium TDR Certificate - Mumbai" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" placeholder="Mumbai, Maharashtra" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area">Area</Label>
                                    <Input id="area" placeholder="500 sq.ft" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="basePrice">Base Price (₹)</Label>
                                    <Input id="basePrice" type="number" placeholder="2500000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="increment">Minimum Increment (₹)</Label>
                                    <Input id="increment" type="number" placeholder="50000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Auction End Date</Label>
                                <Input id="endDate" type="datetime-local" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Describe your property..." rows={4} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateListing}>Create Listing</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {myListings.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                        <p className="text-muted-foreground text-center mb-4">Create your first listing to start trading</p>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Listing
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    )
}
