"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [notifications, setNotifications] = useState({
        email: true,
        bidUpdates: true,
        auctionReminders: true,
        priceAlerts: false,
    })

    function handleSaveProfile() {
        toast({
            title: "Profile updated",
            description: "Your profile has been successfully updated",
        })
    }

    function handleChangePassword() {
        toast({
            title: "Password changed",
            description: "Your password has been updated",
        })
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account preferences</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName"  />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email"  disabled />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <Button onClick={handleSaveProfile}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password to keep your account secure</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                            <Button onClick={handleChangePassword}>Update Password</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose what updates you want to receive</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                                </div>
                                <Switch
                                    checked={notifications.email}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Bid Updates</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when someone outbids you</p>
                                </div>
                                <Switch
                                    checked={notifications.bidUpdates}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, bidUpdates: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auction Reminders</Label>
                                    <p className="text-sm text-muted-foreground">Reminders before auctions end</p>
                                </div>
                                <Switch
                                    checked={notifications.auctionReminders}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, auctionReminders: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Price Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Alerts when prices change significantly</p>
                                </div>
                                <Switch
                                    checked={notifications.priceAlerts}
                                    onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
                                />
                            </div>
                            <Button>Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
