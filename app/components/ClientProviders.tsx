// components/ClientProviders.tsx
"use client"

import React from "react"
import { Toaster } from "sonner"
// Optional: use Vercel Analytics for React/app router
// Only import if you installed @vercel/analytics
import { Analytics } from "@vercel/analytics/react"

export default function ClientProviders() {
    return (
        <>
            {/* Sonner Toaster — you can adjust position / richProps as needed */}
            <Toaster position="top-right" />

            {/* Vercel Analytics (optional) */}
            <Analytics />
        </>
    )
}
