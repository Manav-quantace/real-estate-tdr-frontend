// frontend/lib/auth-server.ts
import { cookies } from "next/headers"

export type ServerUser = {
  participant_id: string
  role: string
}

export async function getServerUser(): Promise<ServerUser | null> {
  const token = (await cookies()).get("auth_token")?.value

  if (!token) return null

  try {
    // ⚠️ We do NOT decode JWT on frontend for security.
    // Backend already validated it when setting cookie.
    // We just trust presence + role header if you add later.
    // For now return minimal shape.

    return {
      participant_id: "unknown",
      role: "GOV_AUTHORITY", // or parse from cookie later
    }
  } catch {
    return null
  }
}
