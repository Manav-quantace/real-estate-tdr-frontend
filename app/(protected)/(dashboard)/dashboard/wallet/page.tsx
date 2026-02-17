"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WalletPage() {
    const { toast } = useToast()
    const [amount, setAmount] = useState("")

    const transactions = [
        {
            id: "1",
            type: "credit",
            description: "Wallet top-up",
            amount: 50000,
            date: "2025-01-10",
            status: "completed",
        },
        {
            id: "2",
            type: "debit",
            description: "Bid placed - TDR-MUM-001",
            amount: 25000,
            date: "2025-01-09",
            status: "completed",
        },
        {
            id: "3",
            type: "credit",
            description: "Refund - Failed bid",
            amount: 15000,
            date: "2025-01-08",
            status: "completed",
        },
        {
            id: "4",
            type: "debit",
            description: "Land purchase - DEL-045",
            amount: 125000,
            date: "2025-01-07",
            status: "completed",
        },
    ]

    function handleAddFunds() {
        if (!amount || Number.parseFloat(amount) <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Payment initiated",
            description: `Adding ₹${amount} to your wallet`,
        })
        setAmount("")
    }

    function handleWithdraw() {
        if (!amount || Number.parseFloat(amount) <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount",
                variant: "destructive",
            })
            return
        }

        toast({
            title: "Withdrawal initiated",
            description: `Withdrawing ₹${amount} from your wallet`,
        })
        setAmount("")
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Wallet</h1>
                <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
            </div>

            {/* Wallet Balance Card */}
            <Card className="bg-linear-to-br from-primary to-secondary text-primary-foreground">
                <CardHeader>
                    <CardDescription className="text-primary-foreground/80">Available Balance</CardDescription>
                    <CardTitle className="text-4xl">₹2,45,000</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Wallet className="h-4 w-4" />
                            <span>Primary Wallet</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4" />
                            <span>Verified</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Withdraw Funds */}
            <Tabs defaultValue="add" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="add">Add Funds</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>

                <TabsContent value="add">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Funds</CardTitle>
                            <CardDescription>Top up your wallet to participate in auctions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="add-amount">Amount (₹)</Label>
                                <Input
                                    id="add-amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setAmount("10000")}>
                                    ₹10,000
                                </Button>
                                <Button variant="outline" onClick={() => setAmount("50000")}>
                                    ₹50,000
                                </Button>
                                <Button variant="outline" onClick={() => setAmount("100000")}>
                                    ₹1,00,000
                                </Button>
                            </div>
                            <Button className="w-full" onClick={handleAddFunds}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Funds
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="withdraw">
                    <Card>
                        <CardHeader>
                            <CardTitle>Withdraw Funds</CardTitle>
                            <CardDescription>Transfer money back to your bank account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="withdraw-amount">Amount (₹)</Label>
                                <Input
                                    id="withdraw-amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">Withdrawal will be processed within 2-3 business days</p>
                            <Button className="w-full bg-transparent" variant="outline" onClick={handleWithdraw}>
                                Withdraw Funds
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View all your wallet transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-10 w-10 rounded-full flex items-center justify-center ${transaction.type === "credit" ? "bg-secondary/10" : "bg-destructive/10"
                                            }`}
                                    >
                                        {transaction.type === "credit" ? (
                                            <ArrowDownRight className="h-5 w-5 text-secondary" />
                                        ) : (
                                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`font-semibold ${transaction.type === "credit" ? "text-secondary" : "text-foreground"}`}
                                    >
                                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
