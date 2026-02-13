// hooks/use-toast.tsx
"use client"

import { toast as sonnerToast } from "sonner"

type ToastPayload = {
    title: string
    description?: string
    // keep it open so pages using "destructive" continue to work
    variant?: "destructive" | "success" | "error" | "default"
    // optional: you can add duration or other sonner options here if needed
    duration?: number
}

/**
 * Compatibility wrapper so existing pages that call:
 * const { toast } = useToast()
 * toast({ title, description, variant: "destructive" })
 *
 * keep working while using sonner under the hood.
 */
export function useToast() {
    function toast(payload: ToastPayload) {
        const { title, description, variant, duration } = payload

        // map your previous 'destructive' to sonner's error
        if (variant === "destructive" || variant === "error") {
            // sonner supports toast.error(message, { description? })
            sonnerToast.error(description ?? title, {
                duration,
            })
            return
        }

        if (variant === "success") {
            sonnerToast.success(description ?? title, {
                duration,
            })
            return
        }

        // default
        sonnerToast(title, {
            description,
            duration,
        })
    }

    return { toast }
}

export default useToast
