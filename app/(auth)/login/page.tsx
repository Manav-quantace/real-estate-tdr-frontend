//app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);

    const [form, setForm] = useState({
        workflow: "saleable",
        username: "",
        password: "",
    });

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workflow: form.workflow,
                    username: form.username,
                    password: form.password,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Login failed");
            }

            toast({
                title: "Authenticated",
                description: `Workflow: ${form.workflow}`,
            });

            router.push("/workflow-hub");
        } catch (err: any) {
            toast({
                title: "Login failed",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workflow: form.workflow,
                    username: form.username,
                    new_password: form.password,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Reset failed");
            }

            toast({
                title: "Password overwritten",
                description: "You can now login with the new password",
            });

            setResetMode(false);
            setForm({ ...form, password: "" });
        } catch (err: any) {
            toast({
                title: "Reset failed",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">

            {/* animated glow */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent_40%)]"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="bg-zinc-950/90 border-zinc-800 backdrop-blur shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white tracking-wide">
                            TDR Exchange
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Secure auction & transfer system
                        </CardDescription>
                    </CardHeader>

                    {!resetMode ? (
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-5">

                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Workflow</Label>
                                    <select
                                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                                        value={form.workflow}
                                        onChange={(e) =>
                                            setForm({ ...form, workflow: e.target.value })
                                        }
                                    >
                                        <option value="saleable">Saleable TDR</option>
                                        <option value="clearland">Clear Land</option>
                                        <option value="slum">Slum Redevelopment</option>
                                        <option value="subsidized">Subsidized Redevelopment</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Username</Label>
                                    <Input
                                        className="bg-zinc-900 border-zinc-700 text-white"
                                        value={form.username}
                                        onChange={(e) =>
                                            setForm({ ...form, username: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-zinc-900 border-zinc-700 text-white"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setResetMode(true)}
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        Reset password (testing)
                                    </button>
                                </div>

                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying…" : "Enter Exchange"}
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <form onSubmit={handleReset}>
                            <CardContent className="space-y-4">
                                <p className="text-zinc-400 text-sm">
                                    Overwrite password (testing only)
                                </p>

                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Workflow</Label>
                                    <select
                                        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2"
                                        value={form.workflow}
                                        onChange={(e) =>
                                            setForm({ ...form, workflow: e.target.value })
                                        }
                                    >
                                        <option value="saleable">Saleable TDR</option>
                                        <option value="clearland">Clear Land</option>
                                        <option value="slum">Slum Redevelopment</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Username</Label>
                                    <Input
                                        className="bg-zinc-900 border-zinc-700 text-white"
                                        value={form.username}
                                        onChange={(e) =>
                                            setForm({ ...form, username: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-300">New Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-zinc-900 border-zinc-700 text-white"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </CardContent>

                            <CardFooter className="flex gap-3">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? "Overwriting…" : "Overwrite"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 text-zinc-300"
                                    onClick={() => setResetMode(false)}
                                >
                                    Back
                                </Button>
                            </CardFooter>
                        </form>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
