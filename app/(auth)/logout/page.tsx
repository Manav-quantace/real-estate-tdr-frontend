//app/(auth)/logout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });
            } catch (e) {
                console.error("Logout error:", e);
            } finally {
                setTimeout(() => {
                    router.push("/login");
                    router.refresh();
                }, 1200);
            }
        };

        logout();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
            >
                <motion.div
                    className="h-14 w-14 rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-300 text-lg tracking-wide"
                >
                    Exiting Exchange…
                </motion.p>
            </motion.div>
        </div>
    );
}
