"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"


interface AuctionTimerProps {
    endDate: string
}

export function AuctionTimer({ endDate }: AuctionTimerProps) {
    const [timeLeft, setTimeLeft] = useState("")
    const [isEnding, setIsEnding] = useState(false)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const end = new Date(endDate).getTime()
            const now = new Date().getTime()
            const distance = end - now

            if (distance < 0) {
                setTimeLeft("Ended")
                return
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            // Check if ending soon (less than 1 hour)
            setIsEnding(distance < 1000 * 60 * 60)

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`)
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`)
            } else {
                setTimeLeft(`${minutes}m ${seconds}s`)
            }
        }

        calculateTimeLeft()
        const interval = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [endDate])

    return (
        <Badge variant={isEnding ? "destructive" : "outline"} className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {timeLeft}
        </Badge>
    )
}
