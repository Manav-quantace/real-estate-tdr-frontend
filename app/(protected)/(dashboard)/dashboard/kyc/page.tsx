"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Upload, AlertCircle, Clock, FileCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type KYCStatus = "not-started" | "in-progress" | "under-review" | "verified" | "rejected"

export default function KYCPage() {
    const { toast } = useToast()
    const [kycStatus] = useState<KYCStatus>("not-started")
    const [step, setStep] = useState(1)
    const [files, setFiles] = useState({
        identity: null as File | null,
        address: null as File | null,
        pan: null as File | null,
    })

    function handleFileUpload(type: keyof typeof files, event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            setFiles({ ...files, [type]: file })
            toast({
                title: "File uploaded",
                description: `${file.name} has been uploaded successfully`,
            })
        }
    }

    function handleSubmit() {
        toast({
            title: "KYC submitted",
            description: "Your documents are under review. We'll notify you once verified.",
        })
    }

    const statusConfig = {
        "not-started": {
            icon: AlertCircle,
            color: "text-muted-foreground",
            bg: "bg-muted",
            label: "Not Started",
        },
        "in-progress": {
            icon: Clock,
            color: "text-blue-500",
            bg: "bg-blue-50",
            label: "In Progress",
        },
        "under-review": {
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-50",
            label: "Under Review",
        },
        verified: {
            icon: CheckCircle2,
            color: "text-secondary",
            bg: "bg-secondary/10",
            label: "Verified",
        },
        rejected: {
            icon: AlertCircle,
            color: "text-destructive",
            bg: "bg-destructive/10",
            label: "Rejected",
        },
    }

    const currentStatus = statusConfig[kycStatus]
    const StatusIcon = currentStatus.icon

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">KYC Verification</h1>
                <p className="text-muted-foreground mt-1">Complete your verification to start trading</p>
            </div>

            {/* KYC Status Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Verification Status</CardTitle>
                            <CardDescription>Your current KYC verification status</CardDescription>
                        </div>
                        <Badge className={`${currentStatus.bg} ${currentStatus.color} border-0`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {currentStatus.label}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {kycStatus === "not-started" || kycStatus === "in-progress" ? (
                <>
                    {/* Progress Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Steps</CardTitle>
                            <CardDescription>Complete all steps to verify your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { id: 1, title: "Personal Information", description: "Basic details and contact info" },
                                    { id: 2, title: "Identity Verification", description: "Government-issued ID proof" },
                                    { id: 3, title: "Address Verification", description: "Proof of residence" },
                                    { id: 4, title: "Additional Documents", description: "PAN card and other documents" },
                                ].map((s) => (
                                    <div key={s.id} className="flex items-center gap-4">
                                        <div
                                            className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= s.id ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {step > s.id ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{s.title}</p>
                                            <p className="text-sm text-muted-foreground">{s.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form based on step */}
                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Enter your basic details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Select defaultValue="IN">
                                        <SelectTrigger id="nationality">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IN">India</SelectItem>
                                            <SelectItem value="US">United States</SelectItem>
                                            <SelectItem value="UK">United Kingdom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={() => setStep(2)} className="w-full">
                                    Continue
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Identity Verification</CardTitle>
                                <CardDescription>Upload a government-issued photo ID</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="idType">ID Type</Label>
                                    <Select defaultValue="aadhaar">
                                        <SelectTrigger id="idType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                                            <SelectItem value="passport">Passport</SelectItem>
                                            <SelectItem value="license">Driving License</SelectItem>
                                            <SelectItem value="voter">Voter ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="idNumber">ID Number</Label>
                                    <Input id="idNumber" placeholder="Enter your ID number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="identityDoc">Upload Document</Label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                        <input
                                            id="identityDoc"
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload("identity", e)}
                                        />
                                        <label htmlFor="identityDoc" className="cursor-pointer">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                                            {files.identity && (
                                                <Badge className="mt-2" variant="outline">
                                                    {files.identity.name}
                                                </Badge>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 bg-transparent">
                                        Back
                                    </Button>
                                    <Button onClick={() => setStep(3)} className="flex-1">
                                        Continue
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Address Verification</CardTitle>
                                <CardDescription>Upload proof of your current address</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input id="address" placeholder="123 Main Street" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="Mumbai" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="Maharashtra" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input id="pincode" placeholder="400001" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Select defaultValue="IN">
                                            <SelectTrigger id="country">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IN">India</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="addressDoc">Upload Address Proof</Label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                        <input
                                            id="addressDoc"
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload("address", e)}
                                        />
                                        <label htmlFor="addressDoc" className="cursor-pointer">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">Utility bill, bank statement, or rent agreement</p>
                                            {files.address && (
                                                <Badge className="mt-2" variant="outline">
                                                    {files.address.name}
                                                </Badge>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 bg-transparent">
                                        Back
                                    </Button>
                                    <Button onClick={() => setStep(4)} className="flex-1">
                                        Continue
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 4 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Documents</CardTitle>
                                <CardDescription>Upload PAN card and other required documents</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="panNumber">PAN Number</Label>
                                    <Input id="panNumber" placeholder="ABCDE1234F" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="panDoc">Upload PAN Card</Label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                        <input
                                            id="panDoc"
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload("pan", e)}
                                        />
                                        <label htmlFor="panDoc" className="cursor-pointer">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                                            {files.pan && (
                                                <Badge className="mt-2" variant="outline">
                                                    {files.pan.name}
                                                </Badge>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="p-4 bg-accent rounded-lg">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-accent-foreground">Important Information</p>
                                            <p className="text-sm text-accent-foreground/80">
                                                Please ensure all documents are clear and readable. Your application will be reviewed within
                                                24-48 hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setStep(3)} className="flex-1 bg-transparent">
                                        Back
                                    </Button>
                                    <Button onClick={handleSubmit} className="flex-1">
                                        Submit for Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : kycStatus === "under-review" ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Clock className="h-16 w-16 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Under Review</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Your documents are currently being reviewed by our team. This usually takes 24-48 hours. We'll notify you
                            once the review is complete.
                        </p>
                    </CardContent>
                </Card>
            ) : kycStatus === "verified" ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Verification Complete</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Your account has been successfully verified. You can now participate in all trading activities without any
                            restrictions.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Verification Rejected</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-4">
                            Unfortunately, we couldn't verify your documents. Please review the feedback and submit again with correct
                            documents.
                        </p>
                        <Button onClick={() => setStep(1)}>Start New Application</Button>
                    </CardContent>
                </Card>
            )}

            {/* Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5" />
                        Required Documents
                    </CardTitle>
                    <CardDescription>List of documents needed for verification</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            "Government-issued photo ID (Aadhaar, Passport, Driving License, or Voter ID)",
                            "Proof of address (Utility bill, bank statement, or rent agreement)",
                            "PAN Card (mandatory for Indian residents)",
                            "Recent photograph (optional)",
                        ].map((doc, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-secondary mt-2" />
                                <p className="text-sm text-muted-foreground">{doc}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
