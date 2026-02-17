"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Gavel, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboardPage() {
    const stats = [
        {
            label: "Total Users",
            value: "12,456",
            change: "+245 this month",
            icon: Users,
            color: "text-blue-500",
        },
        {
            label: "Active Listings",
            value: "5,234",
            change: "+123 this week",
            icon: Building2,
            color: "text-green-500",
        },
        {
            label: "Live Auctions",
            value: "450",
            change: "62 ending today",
            icon: Gavel,
            color: "text-yellow-500",
        },
        {
            label: "Total Volume",
            value: "₹2,500 Cr",
            change: "+18.2% this month",
            icon: TrendingUp,
            color: "text-secondary",
        },
    ]

    const pendingActions = [
        {
            type: "kyc",
            title: "KYC Verifications Pending",
            count: 23,
            urgent: true,
            href: "/admin/kyc",
        },
        {
            type: "listing",
            title: "Listings Pending Approval",
            count: 12,
            urgent: false,
            href: "/admin/listings",
        },
        {
            type: "report",
            title: "Reported Issues",
            count: 5,
            urgent: true,
            href: "/admin/reports",
        },
    ]

    const recentActivities = [
        {
            user: "user****234",
            action: "Won auction for TDR-MUM-045",
            time: "2 minutes ago",
            type: "success",
        },
        {
            user: "admin",
            action: "Approved listing LAND-DEL-089",
            time: "15 minutes ago",
            type: "info",
        },
        {
            user: "user****567",
            action: "Submitted KYC documents",
            time: "1 hour ago",
            type: "pending",
        },
        {
            user: "user****891",
            action: "Reported an issue with listing",
            time: "2 hours ago",
            type: "warning",
        },
    ]

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage and monitor the exchange platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Actions</CardTitle>
                        <CardDescription>Items requiring your attention</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingActions.map((action) => (
                            <Link key={action.type} href={action.href}>
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-3">
                                        {action.urgent ? (
                                            <AlertCircle className="h-5 w-5 text-destructive" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-yellow-500" />
                                        )}
                                        <div>
                                            <p className="font-medium">{action.title}</p>
                                            <p className="text-sm text-muted-foreground">{action.count} items</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant={action.urgent ? "default" : "outline"}>
                                        Review
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest platform events</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                <div
                                    className={`h-2 w-2 rounded-full mt-2 ${activity.type === "success"
                                            ? "bg-secondary"
                                            : activity.type === "warning"
                                                ? "bg-yellow-500"
                                                : activity.type === "pending"
                                                    ? "bg-blue-500"
                                                    : "bg-muted-foreground"
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-medium">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Verified Users</CardDescription>
                            <CheckCircle2 className="h-4 w-4 text-secondary" />
                        </div>
                        <CardTitle className="text-3xl">10,234</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">82% of total users</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Successful Auctions</CardDescription>
                            <Gavel className="h-4 w-4 text-secondary" />
                        </div>
                        <CardTitle className="text-3xl">3,456</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">95% completion rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Avg. Transaction Value</CardDescription>
                            <TrendingUp className="h-4 w-4 text-secondary" />
                        </div>
                        <CardTitle className="text-3xl">₹72.3 L</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
