"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await login(formData.email, formData.password, "admin")
            toast({
                title: "Admin login successful",
                description: "Welcome to the admin panel",
            })
            router.push("/admin/dashboard")
        } catch (error) {
            toast({
                title: "Login failed",
                description: (error as { message: string }).message || "Invalid admin credentials",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Access</h1>
                    <p className="text-muted-foreground">Sign in to the administration panel</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>Enter your admin credentials</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In as Admin"}
                            </Button>
                            <Link href="/login" className="text-sm text-center text-muted-foreground hover:text-foreground">
                                Back to user login
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
