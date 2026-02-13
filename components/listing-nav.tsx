
import { MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface ListingCardProps {
    listing: {
        id: string
        title: string
        type: "land" | "tdr"
        location: string
        area: string
        basePrice: number
        currentPrice: number
        status: "active" | "sold" | "pending"
        endDate?: string
        image?: string
    }
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
                <img
                    src={listing.image || `/placeholder.svg?height=192&width=384&query=${listing.type}-property`}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3" variant={listing.status === "active" ? "default" : "secondary"}>
                    {listing.status}
                </Badge>
                <Badge className="absolute top-3 left-3" variant="outline">
                    {listing.type === "land" ? "Land Parcel" : "TDR Certificate"}
                </Badge>
            </div>

            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Area</span>
                    <span className="font-medium">{listing.area}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">₹{listing.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-bold text-secondary">₹{listing.currentPrice.toLocaleString()}</span>
                </div>
                {listing.endDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <Calendar className="h-4 w-4" />
                        <span>Ends {listing.endDate}</span>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <Link href={`/marketplace/${listing.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
