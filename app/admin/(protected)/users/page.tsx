"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, CheckCircle2, XCircle, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")

    const users = [
        {
            id: "1",
            name: "Rajesh Kumar",
            email: "rajesh.k@example.com",
            phone: "+91 98765 43210",
            kycStatus: "verified",
            role: "user",
            joinDate: "2024-12-15",
            totalTransactions: 23,
        },
        {
            id: "2",
            name: "Priya Sharma",
            email: "priya.s@example.com",
            phone: "+91 98765 43211",
            kycStatus: "pending",
            role: "user",
            joinDate: "2025-01-02",
            totalTransactions: 5,
        },
        {
            id: "3",
            name: "Amit Patel",
            email: "amit.p@example.com",
            phone: "+91 98765 43212",
            kycStatus: "rejected",
            role: "user",
            joinDate: "2024-11-28",
            totalTransactions: 0,
        },
        {
            id: "4",
            name: "Sneha Reddy",
            email: "sneha.r@example.com",
            phone: "+91 98765 43213",
            kycStatus: "verified",
            role: "user",
            joinDate: "2024-10-10",
            totalTransactions: 45,
        },
    ]

    const kycStatusConfig = {
        verified: { label: "Verified", icon: CheckCircle2, color: "text-secondary" },
        pending: { label: "Pending", icon: Clock, color: "text-yellow-500" },
        rejected: { label: "Rejected", icon: XCircle, color: "text-destructive" },
    }

    function handleSuspendUser(userId: string) {
        toast({
            title: "User suspended",
            description: "User has been suspended successfully",
        })
    }

    function handleVerifyUser(userId: string) {
        toast({
            title: "User verified",
            description: "User KYC has been manually verified",
        })
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor all platform users</p>
                </div>
                <Button>Export Users</Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Users</CardDescription>
                        <CardTitle className="text-3xl">12,456</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Verified</CardDescription>
                        <CardTitle className="text-3xl text-secondary">10,234</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Pending KYC</CardDescription>
                        <CardTitle className="text-3xl text-yellow-500">1,850</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active Today</CardDescription>
                        <CardTitle className="text-3xl">2,456</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>KYC Status</TableHead>
                                <TableHead>Transactions</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => {
                                const StatusIcon = kycStatusConfig[user.kycStatus as keyof typeof kycStatusConfig].icon
                                const statusColor = kycStatusConfig[user.kycStatus as keyof typeof kycStatusConfig].color

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">{user.email}</p>
                                                <p className="text-sm text-muted-foreground">{user.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${statusColor} border-0 bg-transparent`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {kycStatusConfig[user.kycStatus as keyof typeof kycStatusConfig].label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{user.totalTransactions}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{user.joinDate}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleVerifyUser(user.id)}>Verify KYC</DropdownMenuItem>
                                                    <DropdownMenuItem>View Transactions</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleSuspendUser(user.id)}>
                                                        Suspend User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
