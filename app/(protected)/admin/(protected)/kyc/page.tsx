"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminKYCPage() {
    const { toast } = useToast()

    const kycRequests = [
        {
            id: "kyc-1",
            userId: "user-234",
            name: "Rahul Verma",
            email: "rahul.v@example.com",
            submittedOn: "2025-01-10",
            documents: {
                identity: "Aadhaar Card",
                address: "Utility Bill",
                pan: "PAN Card",
            },
            status: "pending",
        },
        {
            id: "kyc-2",
            userId: "user-567",
            name: "Anita Desai",
            email: "anita.d@example.com",
            submittedOn: "2025-01-09",
            documents: {
                identity: "Passport",
                address: "Bank Statement",
                pan: "PAN Card",
            },
            status: "pending",
        },
    ]

    function handleApprove(kycId: string) {
        toast({
            title: "KYC Approved",
            description: "User KYC has been successfully verified",
        })
    }

    function handleReject(kycId: string) {
        toast({
            title: "KYC Rejected",
            description: "User will be notified to resubmit documents",
            variant: "destructive",
        })
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">KYC Verification</h1>
                <p className="text-muted-foreground mt-1">Review and verify user KYC submissions</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                        <p className="text-3xl font-bold mt-2">23</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Approved Today</p>
                        <p className="text-3xl font-bold mt-2 text-secondary">45</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">Avg. Review Time</p>
                        <p className="text-3xl font-bold mt-2">18 hrs</p>
                    </CardContent>
                </Card>
            </div>

            {/* KYC Requests */}
            <div className="space-y-4">
                {kycRequests.map((request) => (
                    <Card key={request.id}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{request.name}</h3>
                                            <p className="text-sm text-muted-foreground">{request.email}</p>
                                        </div>
                                        <Badge variant="outline">Pending</Badge>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Submitted On</p>
                                            <p className="font-medium">{request.submittedOn}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">User ID</p>
                                            <p className="font-medium">{request.userId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Documents</p>
                                            <p className="font-medium">{Object.keys(request.documents).length} files</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="bg-transparent">
                                                <Eye className="mr-2 h-4 w-4" />
                                                Review
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>KYC Verification - {request.name}</DialogTitle>
                                                <DialogDescription>Review submitted documents and user information</DialogDescription>
                                            </DialogHeader>

                                            <Tabs defaultValue="identity" className="mt-4">
                                                <TabsList className="grid w-full grid-cols-3">
                                                    <TabsTrigger value="identity">Identity</TabsTrigger>
                                                    <TabsTrigger value="address">Address</TabsTrigger>
                                                    <TabsTrigger value="pan">PAN Card</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="identity" className="space-y-4">
                                                    <div className="border rounded-lg p-4 bg-muted/30">
                                                        <p className="text-sm text-muted-foreground mb-2">Document Type</p>
                                                        <p className="font-medium">{request.documents.identity}</p>
                                                    </div>
                                                    <div className="border rounded-lg aspect-3/2 bg-muted flex items-center justify-center">
                                                        <p className="text-muted-foreground">Document Preview</p>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="address" className="space-y-4">
                                                    <div className="border rounded-lg p-4 bg-muted/30">
                                                        <p className="text-sm text-muted-foreground mb-2">Document Type</p>
                                                        <p className="font-medium">{request.documents.address}</p>
                                                    </div>
                                                    <div className="border rounded-lg aspect-3/2 bg-muted flex items-center justify-center">
                                                        <p className="text-muted-foreground">Document Preview</p>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="pan" className="space-y-4">
                                                    <div className="border rounded-lg p-4 bg-muted/30">
                                                        <p className="text-sm text-muted-foreground mb-2">Document Type</p>
                                                        <p className="font-medium">{request.documents.pan}</p>
                                                    </div>
                                                    <div className="border rounded-lg aspect-3/2 bg-muted flex items-center justify-center">
                                                        <p className="text-muted-foreground">Document Preview</p>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>

                                            <DialogFooter className="gap-2">
                                                <Button variant="outline" className="bg-transparent" onClick={() => handleReject(request.id)}>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject
                                                </Button>
                                                <Button onClick={() => handleApprove(request.id)}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Approve
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 bg-transparent"
                                            onClick={() => handleReject(request.id)}
                                        >
                                            <XCircle className="mr-1 h-3 w-3" />
                                            Reject
                                        </Button>
                                        <Button size="sm" className="flex-1" onClick={() => handleApprove(request.id)}>
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
