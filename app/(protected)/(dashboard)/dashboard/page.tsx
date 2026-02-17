"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Gavel, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      label: "Wallet Balance",
      value: "₹2,45,000",
      change: "+12.5%",
      positive: true,
      icon: Wallet,
    },
    {
      label: "Active Listings",
      value: "3",
      change: "+1 this week",
      positive: true,
      icon: Building2,
    },
    {
      label: "Active Bids",
      value: "7",
      change: "2 pending",
      positive: true,
      icon: Gavel,
    },
    {
      label: "Portfolio Value",
      value: "₹45.2L",
      change: "+8.3%",
      positive: true,
      icon: TrendingUp,
    },
  ]

  const recentActivity = [
    {
      type: "bid",
      title: "Bid placed on TDR-Mumbai-001",
      amount: "₹50,000",
      time: "2 hours ago",
      status: "pending",
    },
    {
      type: "listing",
      title: "New listing created",
      amount: "₹2,00,000",
      time: "1 day ago",
      status: "active",
    },
    {
      type: "won",
      title: "Auction won - Land-DEL-045",
      amount: "₹1,25,000",
      time: "2 days ago",
      status: "completed",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, test error </h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your trading activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.positive ? (
                    <ArrowUpRight className="h-3 w-3 text-secondary" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{activity.amount}</p>
                  <p className="text-xs text-muted-foreground capitalize">{activity.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your assets and trading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/marketplace">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Wallet className="mr-2 h-4 w-4" />
                Add Funds to Wallet
              </Button>
            </Link>
            <Link href="/dashboard/listings">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Create New Listing
              </Button>
            </Link>
            <Link href="/dashboard/kyc">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Complete KYC Verification
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
